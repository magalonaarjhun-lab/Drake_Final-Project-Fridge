import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import IngredientInput from './components/IngredientInput';
import PreferenceSelector from './components/PreferenceSelector';
import GenerateButton from './components/GenerateButton';
import RecipeResults from './components/RecipeResults';
import SavedRecipes from './components/SavedRecipes';
import ProjectModal from './components/ProjectModal';
import Footer from './components/Footer';
import { AlertCircle, X } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'fridge_saved_recipes_v1';
const THEME_KEY = 'fridge_theme_v1';

export default function App() {
  // Initial ingredients matching the reference screenshot
  const [ingredients, setIngredients] = useState(['Chicken', 'Garlic', 'Onion', 'Rice']);
  const [preference, setPreference] = useState('Quick & Easy');
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'saved'
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; }
  });

  // Apply theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  const handleToggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Load saved recipes from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedRecipes(parsed);
        }
      }
    } catch {
      // ignore localStorage parse error
    }
  }, []);

  // Save to localStorage whenever savedRecipes changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch {
      // ignore quota error
    }
  }, [savedRecipes]);

  // Toggle saving recipe
  const handleToggleSave = (recipe) => {
    const existingIndex = savedRecipes.findIndex(
      (item) => (item.id && item.id === recipe.id) || item.name.toLowerCase() === recipe.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Remove
      setSavedRecipes(savedRecipes.filter((_, idx) => idx !== existingIndex));
    } else {
      // Add with generated ID and savedAt timestamp
      const newSavedItem = {
        ...recipe,
        id: recipe.id || `recipe-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        savedAt: new Date().toISOString()
      };
      setSavedRecipes([newSavedItem, ...savedRecipes]);
    }
  };

  // Remove saved recipe
  const handleRemoveSaved = (idOrName) => {
    setSavedRecipes(savedRecipes.filter(
      (item) => item.id !== idOrName && item.name !== idOrName
    ));
  };

  // Generate recipes via backend API
  const handleGenerate = async () => {
    // 1. Validation: at least one ingredient
    if (!ingredients || ingredients.length === 0) {
      setErrorMessage('Please add at least one ingredient first.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients,
          preference
        })
      });

      let data = {};
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseErr) {
        if (!response.ok) {
          throw new Error(`Server returned error (${response.status}). Netlify Functions may still be deploying or missing environment variables.`);
        }
        throw new Error("Unable to parse server response. Please try again.");
      }

      if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}.`);
      }

      if (data.recipes && Array.isArray(data.recipes)) {
        setGeneratedRecipes(data.recipes);

        // Smooth scroll to results
        setTimeout(() => {
          const resultsEl = document.getElementById('results-view');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        throw new Error("Invalid response format received from AI.");
      }

    } catch (err) {
      console.error('Recipe generation error:', err);
      setErrorMessage(err.message || "Sorry, we couldn't generate recipes right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedRecipes.length}
        onOpenProjectInfo={() => setIsModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main>
        {/* Error / Alert banner */}
        {errorMessage && (
          <div className="alert-banner error" role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              className="alert-close"
              onClick={() => setErrorMessage(null)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {activeTab === 'generator' ? (
          <>
            {/* Hero Section */}
            <HeroSection />

            {/* Main Generator Card */}
            <div className="generator-card">
              {/* 1. Enter Ingredients */}
              <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
              />

              {/* 2. Choose Recipe Preference */}
              <PreferenceSelector
                preference={preference}
                setPreference={setPreference}
              />

              {/* Generate Button */}
              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
              />
            </div>

            {/* AI Generated Recipes Section */}
            <RecipeResults
              recipes={generatedRecipes}
              savedRecipes={savedRecipes}
              onToggleSave={handleToggleSave}
            />
          </>
        ) : (
          /* Saved Recipes Tab View */
          <SavedRecipes
            savedRecipes={savedRecipes}
            onRemoveSaved={handleRemoveSaved}
            onSwitchToGenerator={() => setActiveTab('generator')}
          />
        )}
      </main>

      {/* Student & Course Details Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenProjectInfo={() => setIsModalOpen(true)} />
    </div>
  );
}
