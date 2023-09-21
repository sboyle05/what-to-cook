from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod


if environment == 'production':
    table_args = {'schema': SCHEMA}
else:
    table_args = {}

shoppinglist_ingredients_association = db.Table(
    'shoppinglist_ingredients',
    db.Column('shoppinglist_id', db.Integer, db.ForeignKey(add_prefix_for_prod('shopping_lists.id')), primary_key=True),
    db.Column('ingredient_id', db.Integer, db.ForeignKey(add_prefix_for_prod('ingredients.id')), primary_key=True),
    **table_args
)

shoppinglist_measured_ingredients_association = db.Table(
    'shoppinglist_measured_ingredients',
    db.Column('shoppinglist_id', db.Integer, db.ForeignKey(add_prefix_for_prod('shopping_lists.id')), primary_key=True),
    db.Column('measured_ingredient_id', db.Integer, db.ForeignKey(add_prefix_for_prod('measured_ingredients.id')), primary_key=True),
    **table_args

)

class ShoppingList(db.Model):
    __tablename__ = 'shopping_lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    measured_ingredient_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('measured_ingredients.id')), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('ingredients.id')), nullable=True)

    ingredients = db.relationship('Ingredient', secondary=shoppinglist_ingredients_association, back_populates='shopping_lists')
    measured_ingredients = db.relationship('MeasuredIngredient', secondary=shoppinglist_measured_ingredients_association, back_populates='shopping_lists')
    user = db.relationship('User', back_populates='shopping_lists')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'ingredients': [ingredient.to_dict() for ingredient in self.ingredients],
            'measured_ingredients': [measured_ingredient.to_dict() for measured_ingredient in self.measured_ingredients]
        }
