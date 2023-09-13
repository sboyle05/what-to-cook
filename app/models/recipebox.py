from flask_sqlalchemy import SQLAlchemy
from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import date


class RecipeBox(db.Model):
    __tablename__ = 'recipe_boxes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    added_date = db.Column(db.Date, default=date.today, nullable=False)

    user = db.relationship('User', back_populates="recipe_boxes")
    recipe = db.relationship('Recipe', back_populates="recipe_boxes")
