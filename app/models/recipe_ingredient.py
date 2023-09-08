from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod


class RecipeIngredient(db.Model):
    __tablename__ = 'recipe_ingredients'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), primary_key=True)
    quantity = db.Column(db.Float, nullable=False)
    unit_of_measure = db.Column(db.String(50), nullable=True)

    ingredient = db.relationship('Ingredient', back_populates='recipe_ingredients')
    recipe = db.relationship('Recipe', back_populates='recipe_ingredients')
