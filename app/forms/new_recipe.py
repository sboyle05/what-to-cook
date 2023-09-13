from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FieldList, FormField
from wtforms.validators import DataRequired
from app.models import Recipe, Ingredient, MeasuredIngredient


class NewRecipeForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    directions = TextAreaField('Directions', validators=[DataRequired()])
    ingredients = FieldList(StringField('Ingredient'), min_entries=1)
    measured_ingredients = FieldList(StringField('Measured Ingredient'), min_entries=1)
