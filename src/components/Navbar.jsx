import React from 'react';
import { Utensils, Bookmark, Sparkles, Sun, Moon } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, savedCount, onOpenProjectInfo, theme, onToggleTheme }) {
  return (
    <header className="navbar">
      <div 
        className="nav-brand" 
        onClick={() => setActiveTab('generator')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setActiveTab('generator')}
      >
        <div className="brand-icon-wrapper">
          <img src="/favicon.svg" alt="What's in My Fridge Logo" className="brand-icon-img" />
        </div>
        <div className="brand-text">
          <span className="brand-title">What's in My Fridge?</span>
          <span className="brand-subtitle">Smart AI Recipe Generator</span>
        </div>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className={`nav-btn ${activeTab === 'generator' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('generator')}
        >
          <Utensils size={16} />
          <span className="nav-btn-label">Recipe Generator</span>
        </button>

        <button
          type="button"
          className={`nav-btn ${activeTab === 'saved' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={16} />
          <span className="nav-btn-label">Saved Recipes</span>
          {savedCount > 0 && <span className="nav-counter">{savedCount}</span>}
        </button>

        <button
          type="button"
          className="theme-toggle-btn"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        <button
          type="button"
          className="info-btn"
          title="Project & Developer Info (Arjhun Magalona, BSIT - 3)"
          onClick={onOpenProjectInfo}
          aria-label="Project Information"
        >
          <Sparkles size={18} />
        </button>
      </div>
    </header>
  );
}
