from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod


if environment == 'production':
    table_args = {'schema': SCHEMA}
else:
    table_args = {}


recipe_ingredients_association = db.Table(
    'recipe_ingredients',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True),
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.id'), primary_key=True),
    **table_args
)



class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    recipes = db.relationship('Recipe', secondary=recipe_ingredients_association, back_populates='ingredients')
