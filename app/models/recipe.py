from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .ingredient import recipe_ingredients_association


class Recipe(db.Model):
    __tablename__ = 'recipes'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    directions = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    is_seeded = db.Column(db.Boolean, default=False, nullable=False)
    submitted_date = db.Column(db.Date, default=date.today, nullable=False)

    measured_ingredients = db.relationship('MeasuredIngredient', back_populates='recipe', cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='recipe', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='recipes')
    ingredients = db.relationship('Ingredient', secondary=recipe_ingredients_association, back_populates='recipes')
    recipe_boxes = db.relationship('RecipeBox', back_populates='recipe', cascade='all, delete-orphan')
    meal_plans = db.relationship('MealPlan', back_populates='recipe', cascade='all, delete-orphan')
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'directions': self.directions,
            'user_id': self.user_id,
            'is_seeded': self.is_seeded,
            'submitted_date': self.submitted_date.isoformat(),
            'measured_ingredients': [measured_ingredient.to_dict() for measured_ingredient in self.measured_ingredients],
            'ingredients': [ingredient.to_dict() for ingredient in self.ingredients]
        }
