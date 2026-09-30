import React, { useState } from 'react';
import { Search, Bookmark, UtensilsCrossed } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function SavedRecipes({ savedRecipes, onRemoveSaved, onSwitchToGenerator }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = savedRecipes.filter((recipe) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = recipe.name.toLowerCase().includes(q);
    const descMatch = recipe.description?.toLowerCase().includes(q);
    const ingredientMatch = recipe.ingredients?.some((ing) => ing.toLowerCase().includes(q));
    return nameMatch || descMatch || ingredientMatch;
  });

  return (
    <div className="saved-recipes-view">
      <div className="saved-page-header">
        <div>
          <h2 className="saved-title">Saved Recipes</h2>
          <p className="saved-subtitle">
            {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'} in your collection
          </p>
        </div>

        {savedRecipes.length > 0 && (
          <div className="saved-search-wrapper">
            <Search size={17} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search saved recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {savedRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Bookmark size={28} />
          </div>
          <h3 className="empty-state-title">No saved recipes yet.</h3>
          <p className="empty-state-desc">
            Generate a recipe and save your favorites here to easily view or cook them anytime!
          </p>
          <button
            type="button"
            className="btn-add-ingredient"
            onClick={onSwitchToGenerator}
            style={{ display: 'inline-flex', padding: '12px 24px' }}
          >
            <UtensilsCrossed size={16} />
            <span>Generate Recipes</span>
          </button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={28} />
          </div>
          <h3 className="empty-state-title">No matching recipes found</h3>
          <p className="empty-state-desc">
            We couldn't find any saved recipe matching "{searchQuery}". Try a different keyword!
          </p>
          <button
            type="button"
            className="btn-clear-tags"
            style={{ fontSize: '14px', color: 'var(--purple-light)' }}
            onClick={() => setSearchQuery('')}
          >
            Clear search query
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id || `${recipe.name}-${index}`}
              recipe={recipe}
              isSaved={true}
              isSavedPageView={true}
              onRemoveSaved={onRemoveSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
}
