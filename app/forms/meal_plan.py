from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, DateField, SelectField
from wtforms.validators import DataRequired

class NewMealPlanForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    date = DateField('date', validators=[DataRequired()])
    meal_type = SelectField('meal_type', choices=[('breakfast', 'Breakfast'), ('brunch', 'Brunch'), ('lunch', 'Lunch'), ('dinner', 'Dinner'), ('snack', 'Snack'), ('dessert', 'Dessert')], validators=[DataRequired()])
    recipe_id = IntegerField('recipe_id', validators=[DataRequired()])


class UpdateMealPlanForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    date = DateField('date', validators=[DataRequired()])
    meal_type = SelectField('meal_type', choices=[('breakfast', 'Breakfast'), ('brunch', 'Brunch'), ('lunch', 'Lunch'), ('dinner', 'Dinner'), ('snack', 'Snack'), ('dessert', 'Dessert')], validators=[DataRequired()])
    recipe_id = IntegerField('recipe_id', validators=[DataRequired()])
