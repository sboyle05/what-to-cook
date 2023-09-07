from flask import Blueprint, request, jsonify
from app.models import Recipe
from ..models.db import db
from flask_login import current_user, login_required
from sqlalchemy import and_, or_

recipe_routes = Blueprint('recipes', __name__)
session = db.session


@recipe_routes.route('/search', methods=["POST"])
def get_recipes():
    data = request.json
    ingredients_list = data.get('ingredients', [])

    #if no ingredients provided
    if not ingredients_list:
        return jsonify({"message": "No ingredients were provided", "recipes": []}), 400

    #Filter: exact same number of ingredients
    if data.get('exact'):
        query = session.query(Recipe).filter(
            and_(
                Recipe.ingredients.overlap(ingredients_list),
                Recipe.n_ingredients == len(ingredients_list)
            )
        )

    #Filter: allow for a certain number of extra ingredients
    elif data.get('extra_count'):
        extra_count = data.get('extra_count')
        query = session.query(Recipe).filter(
            and_(
                Recipe.ingredients.overlap(ingredients_list),
                Recipe.n_ingredients <= len(ingredients_list) + extra_count
            )
        )

    #Filter: any length allowed but must include all ingredients
    else:
        query = session.query(Recipe).filter(
            Recipe.ingredients.container(ingredients_list)
        )

    recipes = query.all()

    recipe_dicts = [recipe.to_dict() for recipe in recipes]

    return jsonify({"recipes": recipe_dicts}), 200
