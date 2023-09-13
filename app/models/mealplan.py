from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from .db import db, environment, SCHEMA, add_prefix_for_prod

class MealPlan(db.Model):
    __tablename__ = 'meal_plans'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    meal_type = db.Column(Enum('breakfast', 'brunch', 'lunch', 'dinner', 'snack', 'dessert'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable = False)

    user = db.relationship('User', back_populates='meal_plans')

    def to_dict(self):
        return{
            'id': self.id,
            'date': self.date,
            'meal_type': self.meal_type,
            'recipe_id': self.recipe_id,
            'user_id': self.user_id
        }
