import pandas as pd
from app.models import Recipe, MeasuredIngredient, db, RecipeIngredient, Ingredient

def read_dataset():
    return pd.read_csv('./app/seeds/recipe_dataset.csv')

def seed_recipes():
    df = pd.read_csv('./app/seeds/recipe_dataset.csv')

    for index, row in df.iterrows():
        if pd.isna(row['name']) or pd.isna(row['directions']) or pd.isna(row['measured_ingredients']) or pd.isna(row['ingredients']):
            print(f"Skipping entry at index {index} due to NaN or None values")
            continue

        new_recipe = Recipe(
            name=row['name'],
            directions=row['directions'],
            is_seeded=True
        )
        db.session.add(new_recipe)
        db.session.flush()

        measured_ingredients_list = eval(row['measured_ingredients'])
        for description in measured_ingredients_list:
            new_measured_ingredient = MeasuredIngredient(
                description=description,
                recipe_id=new_recipe.id
            )
            db.session.add(new_measured_ingredient)

        ingredients_list = eval(row['ingredients'])
        for ingredient_name in ingredients_list:
            existing_ingredient = Ingredient.query.filter_by(name=ingredient_name).first()

            if existing_ingredient is None:
                new_ingredient = Ingredient(
                    name=ingredient_name
                )
                db.session.add(new_ingredient)
                db.session.flush()
                ingredient_id = new_ingredient.id
            else:
                ingredient_id = existing_ingredient.id

            new_recipe_ingredient = RecipeIngredient(
                recipe_id=new_recipe.id,
                ingredient_id=ingredient_id,
                quantity=1,
                unit_of_measure="unit"
            )
            db.session.add(new_recipe_ingredient)

        db.session.commit()

def undo_recipes():
    # Delete all entries seeded in the RecipeIngredient table
    RecipeIngredient.query.filter(
        RecipeIngredient.recipe_id.in_(
            db.session.query(Recipe.id).filter_by(is_seeded=True)
        )
    ).delete(synchronize_session='fetch')

    # Delete all entries seeded in the MeasuredIngredient table
    MeasuredIngredient.query.filter(
        MeasuredIngredient.recipe_id.in_(
            db.session.query(Recipe.id).filter_by(is_seeded=True)
        )
    ).delete(synchronize_session='fetch')

    # delete all seeded entries in the Recipe table
    Recipe.query.filter_by(is_seeded=True).delete()

    db.session.commit()
