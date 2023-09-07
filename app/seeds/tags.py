import pandas as pd
from app.models import Tag, db

def read_dataset():
    return pd.read_csv('./app/seeds/RAW_recipes.csv')

def seed_tags():
    df = read_dataset()
    unique_tags = set()
    for index, row in df.iterrows():
        tags = eval(row['tags'])
        unique_tags.update(tags)

    for tag in unique_tags:
        new_tag = Tag(name=tag)
        db.session.add(new_tag)
    db.session.commit()

def undo_tags():
    Tag.query.delete()
