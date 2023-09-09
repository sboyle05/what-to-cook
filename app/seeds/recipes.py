from app.models import Recipe, MeasuredIngredient, db, Ingredient
from sqlalchemy.exc import IntegrityError
import pandas as pd

def read_dataset():
    return pd.read_csv('./app/seeds/recipe_dataset.csv')

def get_or_create(model, **kwargs):
    instance = db.session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        db.session.add(instance)
        return instance

def seed_recipes():
    df = read_dataset()
    batch_size = 4000

    for index, row in df.iterrows():
        if pd.isna(row['name']) or pd.isna(row['directions']) or pd.isna(row['measured_ingredients']):
            print(f"Skipping entry at index {index} due to NaN or None values")
            continue

        new_recipe = get_or_create(Recipe, name=row['name'], directions=row['directions'], is_seeded=True)

        try:
            db.session.flush()
        except IntegrityError:
            db.session.rollback()
            print(f"Skipping entry at index {index} due to unique constraint violation")
            continue

        measured_ingredients_list = eval(row['measured_ingredients'])
        for description in measured_ingredients_list:
            new_measured_ingredient = MeasuredIngredient(description=description, recipe_id=new_recipe.id)
            db.session.add(new_measured_ingredient)

        if index % batch_size == 0:
            db.session.commit()
            print(f"Committed up to index {index}")

    db.session.commit()
    print("Finished seeding the database.")

def undo_recipes():
    # Delete all entries seeded in the MeasuredIngredient table
    MeasuredIngredient.query.filter(
        MeasuredIngredient.recipe_id.in_(
            db.session.query(Recipe.id).filter_by(is_seeded=True)
        )
    ).delete(synchronize_session='fetch')

    # Delete all seeded entries in the Recipe table
    Recipe.query.filter_by(is_seeded=True).delete()

    db.session.commit()
