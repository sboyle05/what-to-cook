from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FieldList, FormField
from wtforms.validators import DataRequired, Length
from app.models import Recipe, Ingredient, MeasuredIngredient


class NewRecipeForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=75)])
    directions = TextAreaField('Directions', validators=[DataRequired(), Length(min=3, max=1000)])
    ingredients = FieldList(StringField('Ingredient'), min_entries=1)
    measured_ingredients = FieldList(StringField('Measured Ingredient'), min_entries=1)
