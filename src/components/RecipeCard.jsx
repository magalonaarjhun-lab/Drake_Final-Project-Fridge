import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  Users, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Lightbulb, 
  Share2, 
  CheckCheck,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RecipeCard({ 
  recipe, 
  isSaved, 
  onToggleSave, 
  isSavedPageView = false, 
  onRemoveSaved 
}) {
  const [copied, setCopied] = useState(false);

  const handleSaveClick = () => {
    if (!isSaved) {
      // Gentle celebratory micro-interaction
      try {
        confetti({
          particleCount: 28,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#8B3FEF', '#C02BEA', '#2864E8', '#10B981']
        });
      } catch {
        // no-op if canvas confetti is blocked
      }
    }
    onToggleSave(recipe);
  };

  const handleShareClick = () => {
    const textToCopy = `🍳 ${recipe.name}\n${recipe.description}\n\n⏱ Total Time: ${recipe.totalTime || '20 mins'} | Servings: ${recipe.servings || 2}\n\nIngredients:\n${(recipe.ingredients || []).map(i => `• ${i}`).join('\n')}\n\nInstructions:\n${(recipe.steps || []).map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nGenerated with What's in My Fridge? (Arjhun Magalona, BSIT - 3)`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="recipe-card">
      <div>
        <div className="recipe-card-header">
          <h3 className="recipe-name">{recipe.name}</h3>
          <p className="recipe-desc">{recipe.description}</p>
        </div>

        {/* Time, Difficulty, Servings Badges */}
        <div className="recipe-meta-row">
          <span className="meta-chip" title="Total Cooking Time">
            <Clock size={13} />
            <span>{recipe.totalTime || (recipe.cookTime ? `${recipe.cookTime}` : '20 mins')}</span>
          </span>

          <span className="meta-chip" title="Difficulty Level">
            <Flame size={13} />
            <span>{recipe.difficulty || 'Easy'}</span>
          </span>

          <span className="meta-chip" title="Servings">
            <Users size={13} />
            <span>{recipe.servings ? `${recipe.servings} servings` : '2 servings'}</span>
          </span>
        </div>

        {/* User Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="recipe-block">
            <h4 className="recipe-block-title">
              <span>Ingredients</span>
            </h4>
            <ul className="recipe-list">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="recipe-list-item">
                  <Check size={14} className="check-icon" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Pantry Ingredients */}
        {recipe.additionalIngredients && recipe.additionalIngredients.length > 0 && (
          <div className="recipe-block">
            <h4 className="recipe-block-title">
              <span>Additional Ingredients</span>
            </h4>
            <ul className="recipe-list">
              {recipe.additionalIngredients.map((item, idx) => (
                <li key={idx} className="recipe-list-item">
                  <span className="bullet-icon">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="recipe-block">
            <h4 className="recipe-block-title">
              <span>Instructions</span>
            </h4>
            <div className="instructions-container">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="instruction-step">
                  <span className="step-num">{idx + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Cooking Tip Box */}
        {recipe.tips && (
          <div className="cooking-tip-box">
            <Lightbulb size={18} className="tip-icon" />
            <div className="tip-content">
              <strong>AI Cooking Tip</strong>
              <span>{recipe.tips}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="recipe-actions">
        {isSavedPageView ? (
          <button
            type="button"
            className="btn-save-recipe"
            style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#FCA5A5' }}
            onClick={() => onRemoveSaved(recipe.id || recipe.name)}
          >
            <Trash2 size={16} />
            <span>Remove Recipe</span>
          </button>
        ) : (
          <button
            type="button"
            className={`btn-save-recipe ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveClick}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={16} />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark size={16} />
                <span>Save Recipe</span>
              </>
            )}
          </button>
        )}

        <button
          type="button"
          className="btn-share-recipe"
          onClick={handleShareClick}
          title={copied ? "Copied recipe to clipboard!" : "Copy recipe details"}
          aria-label="Copy recipe details"
        >
          {copied ? <CheckCheck size={16} style={{ color: '#10B981' }} /> : <Share2 size={16} />}
        </button>
      </div>
    </article>
  );
}
