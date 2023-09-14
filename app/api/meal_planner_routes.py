from flask import Blueprint, request, jsonify
from app.models import User, Recipe, Ingredient, MeasuredIngredient, RecipeBox, MealPlan
from ..models.db import db
from datetime import date
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError
from ..forms.meal_plan import NewMealPlanForm, UpdateMealPlanForm
import json


meal_planner_routes = Blueprint('meal_planner', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'A mealplanner {field} is required')
    return errorMessages

@meal_planner_routes.route('/mealplanner/', methods=["GET"])
def get_meal_planner():
    user_id = current_user.id
    meal_planners = MealPlan.query.filter(MealPlan.user_id == user_id).all()
    return jsonify([meal_plan.to_dict() for meal_plan in meal_planners])


@meal_planner_routes.route('/mealplanner/new/', methods=["POST"])
def add_to_meal_planner():
    form = NewMealPlanForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_meal_plan = MealPlan(
            user_id=form.data['user_id'],
            date=form.data['date'],
            meal_type=form.data['meal_type'],
            recipe_id=form.data['recipe_id']
        )
        db.session.add(new_meal_plan)
        db.session.commit()
        return new_meal_plan.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@meal_planner_routes.route('/mealplanner/<int:id>/edit/', methods=['PUT'])
def update_meal_plan(id):
    meal_plan = MealPlan.query.get(id)

    if meal_plan.user_id != current_user.id:
        return {"message": "You don't have the permissions to update this."}

    form = UpdateMealPlanForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        meal_plan.date = form.data['date']
        meal_plan.meal_type = form.data['meal_type']
        meal_plan.recipe_id = form.data['recipe_id']

        db.session.commit()
        return meal_plan.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401



@meal_planner_routes.route('/mealplanner/<int:id>/delete/', methods=['DELETE'])
def delete_meal_plan(id):
    meal_plan = MealPlan.query.get(id)

    if meal_plan is None:
        return {"message": "Meal plan not found"}, 404

    if meal_plan.user_id != current_user.id:
        return {"message": "You don't have the permissions to delete this."}, 404

    try:
        db.session.delete(meal_plan)
        db.session.commit()
    except Exception as e:
        print("Database Exception:", str(e))
        return {"message": "Internal Server Error"}, 500

    return meal_plan.to_dict(), 200
