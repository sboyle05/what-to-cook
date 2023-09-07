import pandas as pd
from app.models import Recipe, Tag, db

def read_dataset():
    return pd.read_csv('../../dataset/your_dataset.csv')

def seed_recipes():
    df = read_dataset()
    for index, row in df.iterrows():
        new_recipe = Recipe(
            name=row['name'],
            minutes=row['minutes'],
            description=row['description'],
            ingredients=eval(row['ingredients']),
            n_ingredients=row['n_ingredients'],
            n_steps=row['n_steps'],
            steps=eval(row['steps']),
            is_seeded=True
        )
        tags = eval(row['tags'])
        new_recipe.tags = Tag.query.filter(Tag.name.in_(tags)).all()
        db.session.add(new_recipe)
    db.session.commit()

def undo_recipes():
    Recipe.query.filter_by(is_seeded=True).delete()
