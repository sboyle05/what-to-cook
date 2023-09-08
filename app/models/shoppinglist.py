from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from .db import db, environment, SCHEMA, add_prefix_for_prod


class ShoppingList(db.Model):
    __tablename__ = 'shopping_lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    measured_ingredient = db.Column(db.String(255), nullable=True)
    measured_ingredient_id = db.Column(db.Integer, db.ForeignKey('measured_ingredients.id'), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.id'), nullable=False)

    measured_ingredient_rel = db.relationship('MeasuredIngredient', back_populates='shopping_lists')
    user = db.relationship('User', back_populates='shopping_lists')
