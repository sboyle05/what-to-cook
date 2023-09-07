from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod


class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), primary_key=True)
    quantity = db.Column(db.Float, nullable=False)
    unit_of_measure = db.Column(db.String(50), nullable=True)

    ingredient = db.relationship('Ingredient', back_populates='recipes')
    recipe = db.relationship('Recipe', back_populates='ingredients')


class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)

    recipes = db.relationship('RecipeIngredient', back_populates='ingredient')
