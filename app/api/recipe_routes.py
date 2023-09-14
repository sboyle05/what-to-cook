from flask import Blueprint, request, jsonify
from app.models import User, Recipe, Ingredient, recipe_ingredients_association, MeasuredIngredient
from ..models.db import db
from sqlalchemy import and_, or_, exists
from sqlalchemy.exc import SQLAlchemyError
import json

recipe_routes = Blueprint('recipes', __name__)
session = db.session

@recipe_routes.route('/search/', methods=["GET"])
def get_recipes():

    # Get ingredients as a comma-separated string from query parameters
    ingredients_param = request.args.get('ingredients', '')

    ingredients_list = ingredients_param.split(',')

    # Remove any leading/trailing white spaces from each ingredient
    ingredients_list = [ingredient.strip() for ingredient in ingredients_list]

    if not ingredients_list or not ingredients_list[0]:
        print("No ingredients provided.")
        return jsonify({"message": "No ingredients were provided", "recipes": []}), 400

    # Subquery to filter recipes containing all the ingredients in the list
    if request.args.get('partial'):
        subquery = session.query(recipe_ingredients_association.c.recipe_id)\
                          .join(Ingredient)\
                          .filter(or_(*[Ingredient.name.like(f"%{term}%") for term in ingredients_list]))\
                          .group_by(recipe_ingredients_association.c.recipe_id)
    else:
        subquery = session.query(recipe_ingredients_association.c.recipe_id)\
                          .join(Ingredient)\
                          .filter(Ingredient.name.in_(ingredients_list))\
                          .group_by(recipe_ingredients_association.c.recipe_id)\
                          .having(db.func.count() == len(ingredients_list))

    query = None

    # Filter: exact same number of ingredients
    if request.args.get('exact'):
        query = session.query(Recipe)\
                       .join(recipe_ingredients_association)\
                       .filter(Recipe.id.in_(subquery))\
                       .group_by(Recipe.id)\
                       .having(db.func.count() == len(ingredients_list))

    # Filter: allow for a certain number of extra ingredients
    elif request.args.get('extra_count'):
        try:
            extra_count = int(request.args.get('extra_count'))
        except ValueError:
            print("Invalid 'extra_count' value.")
            return jsonify({"message": "Invalid 'extra_count' value", "recipes": []}), 400

        query = session.query(Recipe)\
                       .join(recipe_ingredients_association)\
                       .filter(Recipe.id.in_(subquery))\
                       .group_by(Recipe.id)\
                       .having(db.func.count() <= len(ingredients_list) + extra_count)

    # Filter: any length allowed but must include all ingredients
    else:
        query = session.query(Recipe)\
                       .join(recipe_ingredients_association)\
                       .filter(Recipe.id.in_(subquery))

    recipes = query.all() if query else []
    recipe_dicts = [recipe.to_dict() for recipe in recipes]

    return jsonify({"recipes": recipe_dicts}), 200

@recipe_routes.route('/recipes/<int:recipe_id>', methods=["DELETE"])
def delete_recipe(recipe_id):
    recipe = Recipe.query.get(recipe_id)
    if recipe is None:
        return jsonify({"error": "Recipe not found"}), 404
    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": "Recipe deleted successfully"}), 200

@recipe_routes.route('/recipes/<int:id>', methods=["GET"])
def single_recipe(id):
    recipe = Recipe.query.get(id)

    if recipe is None:
        return jsonify({'error': 'Recipe not found'}), 404

    result = recipe.to_dict()

    author_id = recipe.user_id
    if author_id is None:
        result['author'] = "a What-to-Cook generated recipe"
    else:
        author = User.query.get(author_id)
        result['author'] = author.to_dict()

    measured_ingredients = MeasuredIngredient.query.filter(MeasuredIngredient.recipe_id == recipe.id).all()

    ingredients = recipe.ingredients

    result['measured_ingredients'] = [measured_ingredient.description for measured_ingredient in measured_ingredients]
    result['ingredients'] = [ingredient.name for ingredient in ingredients]

    return jsonify(result)
