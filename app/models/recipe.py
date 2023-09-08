from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod



class Recipe(db.Model):
    __tablename__ = 'recipes'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    directions = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    is_seeded = db.Column(db.Boolean, default=False, nullable=False)
    submitted_date = db.Column(db.Date, default=date.today, nullable=False)

    recipe_ingredients = db.relationship('RecipeIngredient', back_populates='recipe')
    measured_ingredients = db.relationship('MeasuredIngredient', back_populates='recipe')
    comments = db.relationship('Comment', back_populates='recipe', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='recipes')
