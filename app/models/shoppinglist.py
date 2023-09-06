from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from .db import db, environment, SCHEMA, add_prefix_for_prod


class ShoppingList(db.Model):
    __tablename__ = 'shopping_lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    ingredient = db.Column(db.String(150), nullable=False)
    quantity = db.Column(db.String(50), nullable=True)
    unitofmeasure = db.Column(Enum('lbs', 'oz', 'grams', 'cups', 'tbsp', 'tsp', 'n/a'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='shopping_lists')
