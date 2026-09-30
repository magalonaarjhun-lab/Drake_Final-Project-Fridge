import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="hero-card">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={13} />
          <span>AI POWERED KITCHEN ASSISTANT</span>
        </div>

        <h1 className="hero-title">Turn leftovers into delicious meals!</h1>

        <p className="hero-subtitle">
          Type what ingredients you have in your fridge or pantry, select your cooking preference,
          and let our culinary AI generate mouth-watering recipes instantly.
        </p>
      </div>

      {/* Subtle food-themed vector decoration matching reference screenshot */}
      <div className="hero-decoration" aria-hidden="true">
        <svg viewBox="0 0 200 200" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="142" rx="80" ry="30" fill="rgba(147, 51, 234, 0.2)" />
          {/* Bowl body */}
          <path
            d="M30 108 C30 158 170 158 170 108 Z"
            fill="url(#bowlGrad)"
            stroke="rgba(217, 70, 239, 0.35)"
            strokeWidth="2.5"
          />
          {/* Bowl rim */}
          <ellipse cx="100" cy="108" rx="70" ry="18" fill="#2E1065" stroke="rgba(216, 180, 254, 0.5)" strokeWidth="2.5" />
          
          {/* Food items inside bowl */}
          <path d="M54 102 Q68 76 86 94 Q100 70 114 90 Q132 68 146 98 Z" fill="rgba(217, 70, 239, 0.45)" />
          <circle cx="78" cy="94" r="13" fill="rgba(239, 68, 68, 0.6)" />
          <circle cx="114" cy="90" r="15" fill="rgba(244, 63, 94, 0.6)" />
          <circle cx="136" cy="100" r="10" fill="rgba(251, 191, 36, 0.65)" />
          
          {/* Steam / Aroma lines */}
          <path d="M86 68 Q80 52 89 40" stroke="rgba(216, 180, 254, 0.45)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M106 62 Q115 46 107 34" stroke="rgba(216, 180, 254, 0.55)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M124 70 Q118 54 125 44" stroke="rgba(216, 180, 254, 0.4)" strokeWidth="2" strokeLinecap="round" />

          <defs>
            <linearGradient id="bowlGrad" x1="30" y1="108" x2="170" y2="158" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4C1D95" />
              <stop offset="1" stopColor="#1E0B3E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
