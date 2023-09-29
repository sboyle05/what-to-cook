from flask import Blueprint, request, jsonify
from app.models import User, Recipe, Ingredient, recipe_ingredients_association, MeasuredIngredient
from ..models.db import db
from sqlalchemy import and_, or_, func  # Importing func for using SQL functions
from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy.orm import joinedload
import json

# Define your Blueprint
recipe_routes = Blueprint('recipes', __name__)
session = db.session

# Define your route for getting recipes
@recipe_routes.route('/search/', methods=["GET"])
def get_recipes():

    # Get the ingredients parameter from the request and split it into a list
    ingredients_param = request.args.get('ingredients', '')
    ingredients_list = ingredients_param.split(',')
    ingredients_list = [ingredient.strip().lower() for ingredient in ingredients_list]   # Stripping any white spaces and lowercase.

    if not ingredients_list or not ingredients_list[0]:
        print("No ingredients provided.")
        return jsonify({"message": "No ingredients were provided", "recipes": []}), 400

    # Build a base query for recipes
    query = db.session.query(Recipe)

    #Subquery for partial matching.
    if request.args.get('partial'):
        subquery = db.session.query(recipe_ingredients_association.c.recipe_id)\
            .join(Ingredient)\
            .filter(or_(
                *[Ingredient.name.ilike(f"%{term}%") for term in ingredients_list],  # Using ILIKE for case-insensitive matching
                *[func.similarity(Ingredient.name, term) > 0.3 for term in ingredients_list]  # Using Trigram similarity for fuzzy matching
            ))\
            .group_by(recipe_ingredients_association.c.recipe_id)
    else:

        subquery = db.session.query(recipe_ingredients_association.c.recipe_id)\
            .join(Ingredient)\
            .filter(Ingredient.name.in_(ingredients_list))\
            .group_by(recipe_ingredients_association.c.recipe_id)\
            .having(db.func.count() == len(ingredients_list))

    if request.args.get('exact'):
        query = query.filter(Recipe.id.in_(subquery))\
            .group_by(Recipe.id)\
            .having(db.func.count() == len(ingredients_list))

    elif request.args.get('extra_count'):
        try:
            extra_count = int(request.args.get('extra_count'))
        except ValueError:
            print("Invalid 'extra_count' value.")
            return jsonify({"message": "Invalid 'extra_count' value", "recipes": []}), 400

        subquery_all_ingredients = db.session.query(recipe_ingredients_association.c.recipe_id)\
            .join(Ingredient)\
            .filter(Ingredient.name.in_(ingredients_list))\
            .group_by(recipe_ingredients_association.c.recipe_id)\
            .having(db.func.count() == len(ingredients_list))

        query = query.join(Ingredient, Recipe.ingredients)\
            .group_by(Recipe.id)\
            .having(and_(
                db.func.count() <= len(ingredients_list) + extra_count,
                Recipe.id.in_(subquery_all_ingredients)
            ))

    else:
        query = query.filter(Recipe.id.in_(subquery))

    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        paginated_recipes = query.paginate(page=page, per_page=per_page, error_out=False)
        total = paginated_recipes.total
        recipes = paginated_recipes.items
    except SQLAlchemyError as e:
        print("Database error:", str(e))
        return jsonify({"error": "Database error"}), 500

    recipe_dicts = [recipe.to_dict() for recipe in recipes]
    return jsonify({
        "recipes": recipe_dicts,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': paginated_recipes.pages
        }
    }), 200

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

    result['measured_ingredients'] = [
    {
        'id': measured_ingredient.id,
        'description': measured_ingredient.description
    }
    for measured_ingredient in measured_ingredients
]
    result['ingredients'] = [ingredient.name for ingredient in ingredients]

    return jsonify(result)
