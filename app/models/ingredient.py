from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod



class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)

    recipes = db.relationship('Recipe', secondary='recipe_ingredients', back_populates='ingredients')
    recipe_ingredients = db.relationship('RecipeIngredient', back_populates='ingredient')
