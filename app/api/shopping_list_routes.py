from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.models import User, Recipe, Ingredient, MeasuredIngredient, ShoppingList
from ..models.db import db
from sqlalchemy import and_, or_, exists
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
import json


shoppingList_routes = Blueprint('shoppingList', __name__)
session = db.session

#all lists
@shoppingList_routes.route('/shoppinglist/', methods=["GET"])
def get_shoppingLists():
  user_id = current_user.id
  shopping_lists = ShoppingList.query.filter(ShoppingList.user_id == user_id).all()
  return jsonify([shopping_list.to_dict() for shopping_list in shopping_lists])


#single list
@shoppingList_routes.route('/shoppinglist/<int:id>/', methods=["GET"])
def get_singleList(id):
  user_id = current_user.id
  try:
    shopping_list = ShoppingList.query.filter(
      and_(ShoppingList.user_id == user_id, ShoppingList.id == id)
    ).first()
    if shopping_list:
      return jsonify(shopping_list.to_dict())
    else:
      return jsonify({'error': 'Shopping list not found'}), 404
  except SQLAlchemyError as e:
    return jsonify({'error': str(e)}), 500

#new list
@shoppingList_routes.route('/shoppinglist/new/', methods=["POST"])
def createNewList():
    user_id = current_user.id
    data = request.json
    print("Received data:", request.json)

    try:
        new_shopping_list = ShoppingList(
            name=data.get('name', 'Shopping List'),
            user_id=user_id
        )
        db.session.add(new_shopping_list)

        # Add ingredients to shopping list
        ingredients_data = data.get('ingredients', [])
        for ingredient_data in ingredients_data:
            ingredient_name = ingredient_data.get('name')
            ingredient = Ingredient.query.filter_by(name=ingredient_name).first()
            if ingredient:
                new_shopping_list.ingredients.append(ingredient)

        # Add measured ingredients to shopping list
        measured_ingredients_data = data.get('measuredIngredients', {})
        for measured_ingredient_name, measured_ingredient_value in measured_ingredients_data.items():
            description = f"{measured_ingredient_name}: {measured_ingredient_value}"
            measured_ingredient = MeasuredIngredient(
                description=description,
                recipe_id=None
            )
            db.session.add(measured_ingredient)
            new_shopping_list.measured_ingredients.append(measured_ingredient)

        db.session.commit()

        print("Saved list:", new_shopping_list.to_dict())
        return jsonify(new_shopping_list.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

#update list name
@shoppingList_routes.route('/shoppinglist/update/<int:id>/', methods=["PUT"])
def updateList(id):
    data = request.json
    shopping_list = ShoppingList.query.get(id)
    if shopping_list:
        shopping_list.name = data.get('name', shopping_list.name)
        db.session.commit()
        return jsonify(shopping_list.to_dict())
    else:
        return jsonify({'error': 'Shopping list not found'}), 404

#add Ingredient
@shoppingList_routes.route('/shoppinglist/add_ingredient/<int:id>/', methods=["POST"])
def addIngredientToList(id):
    data = request.json
    shopping_list = ShoppingList.query.get(id)

    if shopping_list:
        new_ingredient_id = data.get('ingredient_id')
        new_measured_ingredient_id = data.get('measured_ingredient_id')
        if new_ingredient_id:
            ingredient = Ingredient.query.get(new_ingredient_id)
            if ingredient:
                shopping_list.ingredients.append(ingredient)

        if new_measured_ingredient_id:
            measured_ingredient = MeasuredIngredient.query.get(new_measured_ingredient_id)
            if measured_ingredient:
                shopping_list.measured_ingredients.append(measured_ingredient)

        db.session.commit()

        return jsonify(shopping_list.to_dict())

    return jsonify({'error': 'Shopping list not found'}), 404
# add multiple Ingredients
@shoppingList_routes.route('/shoppinglist/add_ingredients/<int:id>/', methods=["POST"])
def addMultipleIngredientsToList(id):
    data = request.json
    shopping_list = ShoppingList.query.get(id)
    if shopping_list:
        # Handling adding regular ingredients
        new_ingredients_ids = data['ingredient_ids']
        new_measured_ingredients = data['measured_ingredients']
        for new_ingredient_id in new_ingredients_ids:
            ingredient = Ingredient.query.get(new_ingredient_id)
            if ingredient:
                shopping_list.ingredients.append(ingredient)

        # Handling adding measured ingredients
        new_measured_ingredients = data.get('measured_ingredients', [])
        for new_measured_ingredient in new_measured_ingredients:
            measured_ingredient = MeasuredIngredient(
                description=new_measured_ingredient.get('description'),
                recipe_id=None
            )
            db.session.add(measured_ingredient)
            shopping_list.measured_ingredients.append(measured_ingredient)

        db.session.commit()
        return jsonify(shopping_list.to_dict())

    return jsonify({'error': 'Shopping list not found'}), 404
#delete
@shoppingList_routes.route('/shoppinglist/<int:id>/delete/', methods=["DELETE"])
def deleteList(id):
    shopping_list = ShoppingList.query.get(id)
    if shopping_list:
        db.session.delete(shopping_list)
        db.session.commit()
        return jsonify({'message': 'Deleted successfully'}), 200
    else:
        return jsonify({'error': 'Shopping list not found'}), 404
