import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchRecipes } from "../../store/recipe";
import './ingredientSearch.css'
const IngredientSearch = ({ addIngredient, selectedIngredients, removeIngredient }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/ingredients/search?q=${input}`);
        const data = await response.json();
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Error gathering ingredient suggestions", error);
      }
    };

    fetchSuggestions();
  }, [input]);

  const fetchSuggestions = async () => {
    if (input.length <= 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/ingredients/search?q=${input}`);
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Error gathering ingredient suggestions", error);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    fetchSuggestions();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter") {
      const indexToUse = selectedIndex === -1 ? 0 : selectedIndex;
      if (indexToUse >= 0 && indexToUse < suggestions.length) {
        const selectedIngredient = suggestions[indexToUse];
        setInput("");
        addIngredient(selectedIngredient);
        setSelectedIndex(-1)
      }
    }
  };

const handleClick = (suggestion, index) => {
    setInput("");
    setSuggestions([]);
    addIngredient(suggestion);
    setSelectedIndex(-1);
  };
  const handleRemoveIngredient = (ingredientToRemove) => {
    removeIngredient(ingredientToRemove);
  };

  return (
    <section>
        <section className="inputContainer">
      <input id="ingredientInput"
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for ingredients"
      />

        <section className={`suggestedIngredients ${suggestions.length > 0 ? 'open' : ''}`}>
        {suggestions.map((suggestion, index) => (
            <div key={index} onClick={() => handleClick(suggestion, index)}>
            {suggestion}
            </div>
        ))}
        </section>
      </section>
      <div className="selectedIngredients">
      {selectedIngredients.map((ingredient, index) => (
        <div key={index} onClick={() => removeIngredient(ingredient)}>
          {ingredient}
        </div>
      ))}
    </div>
    </section>
  );
};

export default IngredientSearch;
