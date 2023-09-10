from flask import Blueprint, request, jsonify
from app.models import User, Recipe, Ingredient, recipe_ingredients_association, MeasuredIngredient
from ..models.db import db
from flask_login import current_user, login_required
from sqlalchemy import and_, or_, exists
from sqlalchemy.exc import SQLAlchemyError
import json


recipe_box_routes = Blueprint('recipe_box', __name__)
session = db.session

@recipe_box_routes.route('/recipebox/', methods=["GET"])
@login_required
def get_recipe_box():
    user_id = current_user.id
    recipes = Recipe.query.filter(Recipe.user_id == user_id).all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@recipe_box_routes.route('/recipebox/', methods=["POST"])
@login_required
def add_to_recipe_box():
    user_id = current_user.id
    data = request.json

    new_recipe = Recipe(
        name=data["name"],
        directions=data["directions"],
        user_id=user_id

    )

    for ingredient_name in data.get('ingredients', []):
        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()
        if ingredient is None:
            ingredient = Ingredient(name=ingredient_name)
            db.session.add(ingredient)

        new_recipe.ingredients.append(ingredient)

    for measured_ingredient_data in data.get('measured_ingredients', []):
        measured_ingredient = MeasuredIngredient(
            description=measured_ingredient_data["description"],
            recipe=new_recipe
        )
        db.session.add(measured_ingredient)

    db.session.add(new_recipe)
    db.session.commit()

    return jsonify(new_recipe.to_dict())


@recipe_box_routes.route('/recipebox/<int:recipe_id>/', methods=["PUT"])
@login_required
def update_recipe_box(recipe_id):
    user_id = current_user.id
    data = request.json

    # Fetch the existing recipe
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()
    if recipe is None:
        return jsonify({"error": "Recipe not found"}), 404

    # Update simple fields
    recipe.name = data.get("name", recipe.name)
    recipe.directions = data.get("directions", recipe.directions)

    # Update ingredients
    new_ingredients = data.get("ingredients", [])
    existing_ingredients = [ingredient.name for ingredient in recipe.ingredients]

    # Remove ingredients that are not in the new list
    for ingredient in recipe.ingredients:
        if ingredient.name not in new_ingredients:
            recipe.ingredients.remove(ingredient)

    # Add new ingredients
    for ingredient_name in new_ingredients:
        if ingredient_name not in existing_ingredients:
            ingredient = Ingredient.query.filter_by(name=ingredient_name).first()
            if ingredient is None:
                ingredient = Ingredient(name=ingredient_name)
                db.session.add(ingredient)
            recipe.ingredients.append(ingredient)

    # Update measured ingredients
    new_measured_ingredients = data.get("measured_ingredients", [])
    for measured_ingredient_data in new_measured_ingredients:
        measured_ingredient = MeasuredIngredient.query.filter(
            MeasuredIngredient.recipe_id == recipe_id,
            MeasuredIngredient.description == measured_ingredient_data["description"]
        ).first()

        if measured_ingredient is None:
            measured_ingredient = MeasuredIngredient(description=measured_ingredient_data["description"], recipe=recipe)
            db.session.add(measured_ingredient)
        else:
            measured_ingredient.description = measured_ingredient_data.get("description", measured_ingredient.description)

    db.session.commit()

    return jsonify(recipe.to_dict())


@recipe_box_routes.route('/recipebox/<int:recipe_id>/', methods=["DELETE"])
@login_required
def delete_recipe_box(recipe_id):
    user_id = current_user.id

    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()
    if recipe is None:
        return jsonify({"error": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": "Recipe deleted"})
