from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .shoppinglist import shoppinglist_ingredients_association

if environment == 'production':
    table_args = {'schema': SCHEMA}
else:
    table_args = {}


recipe_ingredients_association = db.Table(
    'recipe_ingredients',
    db.Column('recipe_id', db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), primary_key=True),
    db.Column('ingredient_id', db.Integer, db.ForeignKey(add_prefix_for_prod('ingredients.id')), primary_key=True),
    **table_args
)

Index('idx_recipe_ingredients', recipe_ingredients_association.c.recipe_id, recipe_ingredients_association.c.ingredient_id)

class Ingredient(db.Model):
    __tablename__ = 'ingredients'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True, index=True)
    recipes = db.relationship('Recipe', secondary=recipe_ingredients_association, back_populates='ingredients')
    shopping_lists = db.relationship('ShoppingList', secondary=shoppinglist_ingredients_association, back_populates='ingredients')
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
