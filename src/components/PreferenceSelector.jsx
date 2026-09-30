import React from 'react';
import { SlidersHorizontal, Zap, HeartPulse, PiggyBank } from 'lucide-react';

const PREFERENCES = [
  {
    id: 'Quick & Easy',
    title: 'Quick & Easy',
    desc: 'Ready in under 20 mins',
    icon: Zap,
    themeClass: 'quick'
  },
  {
    id: 'Healthy',
    title: 'Healthy',
    desc: 'Nutritious & wholesome',
    icon: HeartPulse,
    themeClass: 'healthy'
  },
  {
    id: 'Budget-friendly',
    title: 'Budget-friendly',
    desc: 'Uses affordable pantry staples',
    icon: PiggyBank,
    themeClass: 'budget'
  }
];

export default function PreferenceSelector({ preference, setPreference }) {
  return (
    <div className="section-group">
      <div className="section-header">
        <h2 className="section-title">
          <SlidersHorizontal size={18} />
          <span>2. Choose Recipe Preference</span>
        </h2>
      </div>

      <div className="preferences-grid" role="radiogroup" aria-label="Cooking preferences">
        {PREFERENCES.map((item) => {
          const isSelected = preference === item.id;
          const IconComp = item.icon;

          return (
            <div
              key={item.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`preference-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setPreference(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setPreference(item.id);
                }
              }}
            >
              <div className={`pref-icon-wrapper ${item.themeClass}`}>
                <IconComp size={22} />
              </div>
              <span className="pref-title">{item.title}</span>
              <span className="pref-desc">{item.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
