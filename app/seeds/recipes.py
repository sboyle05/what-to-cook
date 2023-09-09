from app.models import Recipe, MeasuredIngredient, Ingredient, db
from sqlalchemy.exc import IntegrityError
import pandas as pd

def read_dataset():
    return pd.read_csv('./app/seeds/recipe_dataset_trimmed.csv')

def get_or_create(model, **kwargs):
    instance = db.session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance
    else:
        instance = model(**kwargs)
        db.session.add(instance)
        return instance

def insert_row(row):
    index, row_data = row
    if pd.isna(row_data['name']) or pd.isna(row_data['directions']) or pd.isna(row_data['measured_ingredients']) or pd.isna(row_data['ingredients']):
        print(f"Skipping entry at index {index} due to NaN or None values")
        return

    new_recipe = get_or_create(Recipe, name=row_data['name'], directions=row_data['directions'], is_seeded=True)

    try:
        db.session.flush()
    except IntegrityError:
        db.session.rollback()
        print(f"Skipping entry at index {index} due to unique constraint violation")
        return

    measured_ingredients_list = eval(row_data['measured_ingredients'])
    for description in measured_ingredients_list:
        new_measured_ingredient = MeasuredIngredient(description=description, recipe_id=new_recipe.id)
        db.session.add(new_measured_ingredient)

    # Seed the ingredients
    ingredients_list = eval(row_data['ingredients'])
    for ingredient_name in ingredients_list:
        get_or_create(Ingredient, name=ingredient_name)

    db.session.commit()

def seed_recipes():
    df = read_dataset()
    batch_size = 2500

    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]

        for row in batch.iterrows():
            insert_row(row)

        print(f"Processed batch {int(i/batch_size) + 1}")

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

    # Delete all seeded entries in the Ingredient table
    Ingredient.query.delete()

    db.session.commit()
