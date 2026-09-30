import React from 'react';
import { X, UserCheck, ShieldCheck, Cpu } from 'lucide-react';

export default function ProjectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Cpu size={20} style={{ color: 'var(--purple-vibrant)' }} />
            <span>Project &amp; Course Details</span>
          </h2>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Student Profile Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UserCheck size={18} style={{ color: 'var(--purple-vibrant)' }} />
              <strong style={{ fontSize: '15.5px', color: 'var(--text-primary)' }}>Student Information</strong>
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong style={{ color: 'var(--text-primary)' }}>Name:</strong> Arjhun Magalona</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Program &amp; Year:</strong> BSIT - 3</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Course:</strong> Application Development &amp; Emerging Technologies</div>
              <div><strong style={{ color: 'var(--text-primary)' }}>Project:</strong> Individual AI-Integrated Web Application</div>
            </div>
          </div>

          {/* Architecture / Defense Summary */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: '14px',
            padding: '18px'
          }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={17} style={{ color: '#10B981' }} />
              <span>Project Architecture &amp; Technology Stack</span>
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>• <strong style={{ color: 'var(--text-secondary)' }}>Frontend:</strong> React 19 + Vite with custom modern CSS design system.</div>
              <div>• <strong style={{ color: 'var(--text-secondary)' }}>Backend Proxy:</strong> Node.js / Express server running on port 5000 handling all AI communication securely.</div>
              <div>• <strong style={{ color: 'var(--text-secondary)' }}>AI Model:</strong> Google Gemini Generative AI (Flash models) generating structured culinary recipes.</div>
              <div>• <strong style={{ color: 'var(--text-secondary)' }}>Local Storage:</strong> Persistent saved recipes collection preserved across sessions.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

