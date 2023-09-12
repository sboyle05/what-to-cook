from flask import Blueprint, request, jsonify
from app.models import User, Recipe, Ingredient, MeasuredIngredient, RecipeBox
from ..models.db import db
from datetime import date
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError
import json

recipe_box_routes = Blueprint('recipe_box', __name__)

@recipe_box_routes.route('/recipebox/', methods=["GET"])
def get_recipe_box():
    user_id = current_user.id
    recipe_boxes = RecipeBox.query.filter(RecipeBox.user_id == user_id).all()
    recipes = [box.recipe for box in recipe_boxes]
    return jsonify([recipe.to_dict() for recipe in recipes])

@recipe_box_routes.route('/recipebox/', methods=["POST"])
def add_to_recipe_box():
    if not current_user:
        return jsonify({"error": "User not authenticated"}), 401

    user_id = current_user.id
    data = request.json

    # Validate the incoming data
    if not all(key in data for key in ("name", "directions")):
        return jsonify({"error": "Missing required fields"}), 400

    new_recipe = Recipe(
        name=data["name"],
        directions=data["directions"],
        user_id=user_id
    )

    for ingredient_obj in data.get('ingredients', []):
        ingredient_name = ingredient_obj.get('name', None)
        if ingredient_name is None:
            continue

        ingredient = Ingredient.query.filter_by(name=ingredient_name).first()
        if ingredient is None:
            ingredient = Ingredient(name=ingredient_name)
            db.session.add(ingredient)

        new_recipe.ingredients.append(ingredient)

    for measured_ingredient_name, measured_ingredient_value in data.get('measuredIngredients', {}).items():
        measured_ingredient = MeasuredIngredient(
            description=f"{measured_ingredient_name}: {measured_ingredient_value}",
            recipe=new_recipe
        )
        db.session.add(measured_ingredient)

    db.session.add(new_recipe)
    db.session.commit()

    new_recipe_box = RecipeBox(
        user_id=user_id,
        recipe_id=new_recipe.id
    )
    db.session.add(new_recipe_box)
    db.session.commit()

    return jsonify(new_recipe.to_dict())


@recipe_box_routes.route('/recipebox/add_existing/', methods=["POST"])
def add_existing_to_recipe_box():
    user_id = current_user.id
    data = request.json
    print("*************ADD EXISITNG RECIPE DATA FROM BACKEND****************",data)
    recipe_id = data["id"]

    existing_recipe = Recipe.query.filter_by(id=recipe_id).first()
    if existing_recipe is None:
        return jsonify({"error": "Recipe not found"}), 404

    new_recipe_box = RecipeBox(
        user_id=user_id,
        recipe_id=recipe_id
    )
    db.session.add(new_recipe_box)
    db.session.commit()

    return jsonify(existing_recipe.to_dict())

@recipe_box_routes.route('/recipebox/<int:recipe_id>/', methods=["PUT"])
def update_recipe_box(recipe_id):
    user_id = current_user.id
    data = request.json

    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first()
    if recipe is None:
        return jsonify({"error": "Recipe not found"}), 404

    recipe.name = data.get("name", recipe.name)
    recipe.directions = data.get("directions", recipe.directions)

    # Update Ingredients
    new_ingredient_names = [ingredient.get('name') for ingredient in data.get('ingredients', [])]
    existing_ingredient_names = [ingredient.name for ingredient in recipe.ingredients]

    for ingredient in recipe.ingredients:
        if ingredient.name not in new_ingredient_names:
            recipe.ingredients.remove(ingredient)

    for ingredient_object in data.get('ingredients', []):
        ingredient_name = ingredient_object.get('name', None)
        if ingredient_name is None:
            continue

        if ingredient_name not in existing_ingredient_names:
            ingredient = Ingredient.query.filter_by(name=ingredient_name).first()
            if ingredient is None:
                ingredient = Ingredient(name=ingredient_name)
                db.session.add(ingredient)
            recipe.ingredients.append(ingredient)

    # Delete existing measured ingredients
    MeasuredIngredient.query.filter_by(recipe_id=recipe_id).delete()

    # Update Measured Ingredients
    for measured_ingredient_data in data.get('measuredIngredients', []):
        measured_ingredient_description = measured_ingredient_data.get('description')
        if measured_ingredient_description is None:
            continue

        new_measured_ingredient = MeasuredIngredient(
            description=measured_ingredient_description,
            recipe=recipe
        )
        db.session.add(new_measured_ingredient)

    db.session.commit()


    return jsonify(recipe.to_dict())


@recipe_box_routes.route('/recipebox/<int:recipe_id>/', methods=["DELETE"])
def delete_recipe_box(recipe_id):
    user_id = current_user.id

    recipe_box_entry = RecipeBox.query.filter_by(recipe_id=recipe_id, user_id=user_id).first()
    if recipe_box_entry is None:
        return jsonify({"error": "Recipe not found in your recipe box"}), 404

    db.session.delete(recipe_box_entry)
    db.session.commit()

    return jsonify({"message": "Recipe removed from your recipe box"})
