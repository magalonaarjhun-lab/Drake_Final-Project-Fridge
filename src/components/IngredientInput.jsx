import React, { useState } from 'react';
import { ShoppingBasket, Plus, X, Trash2 } from 'lucide-react';

const QUICK_ADD_LIST = [
  'Chicken',
  'Eggs',
  'Garlic',
  'Onion',
  'Rice',
  'Tomatoes',
  'Cheese'
];

export default function IngredientInput({ ingredients, setIngredients }) {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = (item) => {
    if (!item) return;
    const trimmed = item.trim().toLowerCase();
    if (!trimmed) return;

    // Capitalize first letter for clean display
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    // Prevent duplicate entries
    const exists = ingredients.some(
      (ing) => ing.toLowerCase() === formatted.toLowerCase()
    );

    if (!exists) {
      setIngredients([...ingredients, formatted]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
        setInputValue('');
      }
    } else if (e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
        setInputValue('');
      }
    }
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      addIngredient(inputValue);
      setInputValue('');
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, idx) => idx !== indexToRemove));
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  return (
    <div className="section-group">
      <div className="section-header">
        <h2 className="section-title">
          <ShoppingBasket size={19} />
          <span>1. Enter Ingredients You Have</span>
        </h2>
        <span className="section-helper">Press Enter or comma to add</span>
      </div>

      {/* Main text input bar with white container & + Add button */}
      <div className="ingredient-input-wrapper">
        <input
          type="text"
          id="ingredient-input"
          className="ingredient-input"
          placeholder="e.g. chicken, eggs, garlic, onion, rice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          id="add-ingredient-btn"
          className="btn-add-ingredient"
          onClick={handleAddClick}
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Quick Add Pills */}
      <div className="quick-add-container">
        <span className="quick-add-label">Quick add:</span>
        {QUICK_ADD_LIST.map((item) => {
          const isAdded = ingredients.some(
            (ing) => ing.toLowerCase() === item.toLowerCase()
          );
          return (
            <button
              key={item}
              type="button"
              className={`quick-add-chip ${isAdded ? 'added' : ''}`}
              onClick={() => !isAdded && addIngredient(item)}
              disabled={isAdded}
              title={isAdded ? `${item} is already in your list` : `Add ${item}`}
            >
              <Plus size={12} />
              <span>{item}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Tag Box */}
      <div className="tags-container" aria-label="Selected ingredients">
        {ingredients.length === 0 ? (
          <span className="tag-empty-msg">
            No ingredients added yet. Type an ingredient above or tap a quick-add button!
          </span>
        ) : (
          ingredients.map((ing, index) => (
            <div key={`${ing}-${index}`} className="ingredient-tag">
              <span>{ing}</span>
              <button
                type="button"
                className="tag-remove-btn"
                onClick={() => removeIngredient(index)}
                aria-label={`Remove ${ing}`}
                title={`Remove ${ing}`}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="tags-action-bar">
          <button
            type="button"
            className="btn-clear-tags"
            onClick={clearAllIngredients}
          >
            Clear all ({ingredients.length})
          </button>
        </div>
      )}
    </div>
  );
}
