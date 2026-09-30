import React from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeResults({ recipes, savedRecipes, onToggleSave }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <section className="results-section" id="results-view">
      <div className="results-header">
        <h2 className="results-title">Your AI-Generated Recipes</h2>
        <p className="results-subtitle">
          Based on the ingredients you provided.
        </p>
      </div>

      <div className="recipes-grid">
        {recipes.map((recipe, index) => {
          const isSaved = savedRecipes.some(
            (saved) => (saved.id && saved.id === recipe.id) || saved.name.toLowerCase() === recipe.name.toLowerCase()
          );

          return (
            <RecipeCard
              key={`${recipe.name}-${index}`}
              recipe={recipe}
              isSaved={isSaved}
              onToggleSave={onToggleSave}
            />
          );
        })}
      </div>
    </section>
  );
}
