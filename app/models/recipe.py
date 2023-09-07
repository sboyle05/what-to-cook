from flask_sqlalchemy import SQLAlchemy
from datetime import date
from .db import db, environment, SCHEMA, add_prefix_for_prod


#many to many association table
tags_association = db.Table(
    'tags_association',
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
)

ingredients_association = db.Table(
    'ingredients_association',
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.id'), primary_key=True),
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True)
)

class Recipe(db.Model):
    __tablename__ = 'recipes'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    minutes = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    is_seeded = db.Column(db.Boolean, default=False, nullable=False)
    submitted_date = db.Column(db.Date, default=date.today, nullable=False)
    steps = db.Column(db.JSON, nullable=False)
    n_steps = db.Column(db.Integer, nullable=False)
    n_ingredients = db.Column(db.Integer, nullable=False)
    ingredients = db.Relationship('Ingredient', secondary=ingredients_association, lazy='subquery')
    tags = db.relationship('Tag', secondary=tags_association, lazy='subquery')

    comments = db.relationship('Comment', back_populates='recipe', cascade='all, delete-orphan')
    user = db.relationship('User', back_populates='recipes')
