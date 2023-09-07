from flask import Blueprint, request, jsonify
from app.models import Recipe, Tag
from ..models.db import db
from flask_login import current_user, login_required
from sqlalchemy import and_, or_

recipe_routes = Blueprint('recipes', __name__)
session = db.session


def filter_by_tags(tags):
    recipes = session.query(Recipe).filter(
        Recipe.tags.any(Tag.name.in_(tags))
    ).all()
    return recipes

@recipe_routes.route('/search', methods=["POST"])
def get_recipes():
    data = request.json
    ingredients_list = data.get('ingredients', [])
    tags_list = data.get('tags', [])

    #if no ingredients provided or no tags
    if not ingredients_list and not tags_list:
        return jsonify({"message": "No ingredients or tags were provided", "recipes": []}), 400

    query = None

    if ingredients_list:
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
                Recipe.ingredients.contains(ingredients_list)
            )
    if tags_list:
            tag_query = session.query(Recipe).filter(
                 Recipe.id.in_([recipe.id for recipe in filter_by_tags(tags_list)])
            )
            if query is not None:
                 query = query.intersect(tag_query)
            else:
                 query = tag_query

    recipes = query.all() if query else []

    recipe_dicts = [recipe.to_dict() for recipe in recipes]

    return jsonify({"recipes": recipe_dicts}), 200
