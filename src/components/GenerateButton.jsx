import React from 'react';
import { Sparkles } from 'lucide-react';

export default function GenerateButton({ onClick, isLoading, disabled }) {
  return (
    <button
      type="button"
      id="generate-recipe-btn"
      className="btn-generate"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <div className="spinner" aria-hidden="true" />
          <span>Generating Recipes...</span>
        </>
      ) : (
        <>
          <Sparkles size={18} />
          <span>Generate Recipes with AI</span>
        </>
      )}
    </button>
  );
}
