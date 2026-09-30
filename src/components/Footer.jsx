import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer({ onOpenProjectInfo }) {
  return (
    <footer className="app-footer">
      <div 
        className="footer-personalization"
        onClick={onOpenProjectInfo}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        title="Click to view Project & Course Details"
      >
        <Sparkles size={14} />
        <span>Developed by Arjhun Magalona | BSIT - 3</span>
      </div>

      <p className="footer-meta">
        Application Development &amp; Emerging Technologies • Powered by Google Gemini AI
      </p>
    </footer>
  );
}
