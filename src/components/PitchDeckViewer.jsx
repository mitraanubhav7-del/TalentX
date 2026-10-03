import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Play, 
  RotateCcw,
  Presentation,
  ExternalLink
} from 'lucide-react';
import { SLIDES_DATA } from '../data/mockData';

export function PitchDeckViewer({ onNavigateToFeature }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = SLIDES_DATA[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  const handleNext = () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 'calc(100vh - 180px)' }}>
      {/* Presentation Top Control Bar */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '12px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Presentation size={20} color="#818CF8" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
            Build for Bharat 2.0 Pitch Deck
          </span>
          <span className="badge-pill badge-indigo">
            Slide {slide.number} of {SLIDES_DATA.length}
          </span>
        </div>

        {/* Slide Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
            style={{
              background: 'var(--surface-tint)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              maxWidth: '300px'
            }}
          >
            {SLIDES_DATA.map((s, idx) => (
              <option key={s.number} value={idx} style={{ background: '#FFFFFF', color: 'var(--text-primary)' }}>
                Slide {s.number}: {s.title.substring(0, 38)}...
              </option>
            ))}
          </select>

          {/* Nav arrows */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="btn-secondary"
              style={{ padding: '6px 12px', opacity: currentSlideIndex === 0 ? 0.4 : 1 }}
              title="Previous Slide (Left Arrow)"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES_DATA.length - 1}
              className="btn-secondary"
              style={{ padding: '6px 12px', opacity: currentSlideIndex === SLIDES_DATA.length - 1 ? 0.4 : 1 }}
              title="Next Slide (Right Arrow or Space)"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SLIDE STAGE */}
      <div className="glass-panel" style={{
        flex: 1,
        minHeight: '520px',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}>
        {/* Slide Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span className="badge-pill badge-cyan" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
              {slide.category} • SLIDE {slide.number}
            </span>

            {slide.badge && (
              <span className="badge-pill badge-verified" style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                {slide.badge}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: '12px',
            fontFamily: 'var(--font-heading)'
          }}>
            {slide.title}
          </h1>

          <div style={{
            fontSize: '1.2rem',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '28px'
          }}>
            {slide.subtitle}
          </div>

          {slide.tagline && (
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              borderLeft: '4px solid #6366F1',
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: 'var(--primary)',
              marginBottom: '28px'
            }}>
              {slide.tagline}
            </div>
          )}

          {/* Slide Bullets with Rich Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '900px' }}>
            {slide.bullets.map((bullet, bIdx) => (
              <div
                key={bIdx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  background: 'var(--surface-tint)',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '1.05rem',
                  color: '#E2E8F0',
                  lineHeight: 1.5
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {bIdx + 1}
                </div>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer Action Button (Live feature link) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '32px',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Use ← / → keyboard arrows to navigate slides
          </div>

          <button
            onClick={() => onNavigateToFeature(slide.interactiveAction)}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <Sparkles size={16} /> Open Interactive Platform Feature <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
