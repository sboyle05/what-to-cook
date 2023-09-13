import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import RecipeSearch from "./components/RecipeSearch";
import SingleRecipeComponent from "./components/SingleRecipe";
import RecipeBox from "./components/recipeBox";
import NewRecipe from "./components/newRecipeForm";
import UpdateRecipe from "./components/updateRecipeForm";
import MealPlanner from "./components/mealplanner";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/login" >
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/recipebox">
            <RecipeBox/>
          </Route>
          <Route exact path="/recipebox/new">
            <NewRecipe/>
          </Route>
          <Route exact path="/recipebox/update/:id">
            <UpdateRecipe/>
          </Route>
          <Route exact path="/recipes/:id">
            <SingleRecipeComponent/>
          </Route>
          <Route exact path="/mealplanner">
            <MealPlanner/>
          </Route>
          <Route exact path="/">
          <RecipeSearch/>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
