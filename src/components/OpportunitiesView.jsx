import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Users, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Filter,
  DollarSign,
  Trophy
} from 'lucide-react';
import { OPPORTUNITIES } from '../data/mockData';

export function OpportunitiesView({ user }) {
  const [filterType, setFilterType] = useState('All');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [appliedIds, setAppliedIds] = useState(['opp_3']); // registered for Build for Bharat Hackathon

  const filteredOpportunities = filterType === 'All' 
    ? OPPORTUNITIES 
    : OPPORTUNITIES.filter(o => o.type.toLowerCase() === filterType.toLowerCase());

  const handleApply = (id) => {
    setAppliedIds(prev => [...prev, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Briefcase size={22} color="#818CF8" />
            <span className="badge-pill badge-indigo">Slide 15 — Smart Opportunities</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            AI-Matched Opportunities: Jobs, Internships & Hackathons
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
            Instead of showing everyone the same spam feed, TalentX ranks opportunities using explainable skill matching. Your verified credentials fast-track screening directly to technical interview rounds.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-tint)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          gap: '4px'
        }}>
          {['All', 'Job', 'Internship', 'Hackathon'].map(cat => {
            const isSelected = filterType === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isSelected ? 'var(--grad-primary)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-secondary)'
                }}
              >
                {cat === 'All' ? 'All Opportunities' : cat + 's'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Opportunities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
        {filteredOpportunities.map(opp => {
          const isApplied = appliedIds.includes(opp.id);
          return (
            <div
              key={opp.id}
              className="glass-panel glass-panel-interactive"
              style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
            >
              <div>
                {/* Top Row: Type & Match Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge-pill badge-indigo">
                    {opp.type}
                  </span>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    <Sparkles size={14} color="#10B981" />
                    <span>{opp.aiMatchScore}% AI Match</span>
                  </div>
                </div>

                {/* Title & Company */}
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                  {opp.title}
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '10px' }}>
                  {opp.company}
                </div>

                {/* Details pill row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#94A3B8" /> {opp.location}
                  </span>
                  <span style={{ color: '#FBBF24', fontWeight: 600 }}>
                    {opp.salary}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {opp.experience}
                  </span>
                </div>

                {/* Required Skills */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Required Competencies:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {opp.requiredSkills.map((sk, sIdx) => {
                      const isVerified = user.skills.some(us => us.name.toLowerCase().includes(sk.toLowerCase()) && us.verified);
                      return (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: isVerified ? '#34D399' : 'var(--text-secondary)',
                            border: isVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isVerified && <ShieldCheck size={11} />}
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Fast track notice */}
                <div style={{
                  background: 'rgba(99, 102, 241, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span>{opp.assessmentRequired}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '14px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '6px'
              }}>
                <button
                  onClick={() => setSelectedOpp(opp)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Inspect Match Breakdown
                </button>

                <button
                  onClick={() => handleApply(opp.id)}
                  className={isApplied ? "btn-verified" : "btn-primary"}
                  style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                >
                  {isApplied ? 'Application Sent ✓' : '1-Click Apply with TalentX'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPLAINABLE MATCH BREAKDOWN MODAL */}
      {selectedOpp && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '620px',
            padding: '28px',
            background: 'var(--bg-glass-heavy)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedOpp(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--track)',
                border: 'none',
                color: 'var(--text-secondary)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#38BDF8" />
              <span className="badge-pill badge-indigo">Slide 18 — Explainable AI Matching</span>
            </div>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Match Breakdown: {selectedOpp.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '20px' }}>
              {selectedOpp.company} • {selectedOpp.salary}
            </p>

            {/* Score Ring / Bar */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRANSPARENT MATCH INDEX</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                  {selectedOpp.aiMatchScore}% Profile Alignment
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6EE7B7', maxWidth: '240px', textAlign: 'right' }}>
                Verified competencies exceed the 80% threshold required for instant fast-track.
              </div>
            </div>

            {/* Matched Skills */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> CONFIRMED MATCHED SKILLS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedOpp.skillMatchBreakdown.matched.map((m, idx) => (
                  <div key={idx} style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{m}</span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Pass ✓</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            {selectedOpp.skillMatchBreakdown.missing.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FBBF24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> POTENTIAL SKILL GAPS:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedOpp.skillMatchBreakdown.missing.map((gap, idx) => (
                    <div key={idx} style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.08)',
                      fontSize: '0.82rem',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{gap}</span>
                      <span style={{ color: '#FBBF24', fontSize: '0.75rem' }}>Gap can be closed during ramp-up</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedOpp(null)} className="btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedOpp.id);
                  setSelectedOpp(null);
                }}
                className="btn-primary"
              >
                Submit Fast-Track Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
