# ingredient_routes.py
from flask import Blueprint, request, jsonify
from app.models import Ingredient
from sqlalchemy.exc import SQLAlchemyError
from app.models.db import db

ingredient_routes = Blueprint('ingredients', __name__)
session = db.session

@ingredient_routes.route('/search', methods=["GET"])
def search_ingredients():
    try:
        search_term = request.args.get('q', '').lower()
        if not search_term:
            return jsonify({"suggestions": []})

        query = session.query(Ingredient).filter(Ingredient.name.ilike(f"%{search_term}%"))
        ingredients = query.all()
        suggestions = [ingredient.name for ingredient in ingredients]
        return jsonify({"suggestions": suggestions})

    except SQLAlchemyError as e:
        print("Database error occurred:", str(e))
        return jsonify({"error": "Database error"}), 500
    except Exception as e:
        print("An unexpected error occurred:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500
