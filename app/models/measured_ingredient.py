from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod


class MeasuredIngredient(db.Model):
    __tablename__ = 'measured_ingredients'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    recipe = db.relationship('Recipe', back_populates='measured_ingredients')
    shopping_lists = db.relationship('ShoppingList', back_populates='measured_ingredient_rel')

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'recipe_id': self.recipe_id
        }
