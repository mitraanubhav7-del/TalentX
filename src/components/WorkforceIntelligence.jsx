import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  PieChart,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { WORKFORCE_SKILLS_DATA } from '../data/mockData';

export function WorkforceIntelligence() {
  const [data, setData] = useState(WORKFORCE_SKILLS_DATA);
  const [reskillSimulated, setReskillSimulated] = useState(false);

  const toggleReskillSimulation = () => {
    if (!reskillSimulated) {
      setData(prev => prev.map(item => {
        if (item.skill.includes('Cloud')) {
          return { ...item, currentWorkforce: 78, gapDelta: 10, action: "Upskill" };
        }
        if (item.skill.includes('Machine Learning')) {
          return { ...item, currentWorkforce: 65, gapDelta: 20, action: "Reskill (In Progress)" };
        }
        return item;
      }));
      setReskillSimulated(true);
    } else {
      setData(WORKFORCE_SKILLS_DATA);
      setReskillSimulated(false);
    }
  };

  const avgCurrent = Math.round(data.reduce((acc, curr) => acc + curr.currentWorkforce, 0) / data.length);
  const avgFuture = Math.round(data.reduce((acc, curr) => acc + curr.futureDemand, 0) / data.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
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
            <TrendingUp size={22} color="#FBBF24" />
            <span className="badge-pill badge-warning">Slide 19 — Workforce Intelligence</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Enterprise Workforce Planning: Current vs Future Demand
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
            Compare active internal workforce competencies against multi-year project requirements. TalentX synthesizes skill telemetry to optimize capital allocation across: 
            <strong style={{ color: 'var(--primary)' }}> HIRE → RESKILL → UPSKILL</strong>.
          </p>
        </div>

        <button
          onClick={toggleReskillSimulation}
          className={reskillSimulated ? "btn-verified" : "btn-secondary"}
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
        >
          <Zap size={15} />
          {reskillSimulated ? 'Reset Simulation' : 'Simulate Internal Reskilling Batch'}
        </button>
      </div>

      {/* STRATEGIC ALLOCATION STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRENT CAPABILITY INDEX</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>{avgCurrent}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across 1,240 Engineers</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FUTURE PROJECT DEMAND</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FBBF24' }}>{avgFuture}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Target for FY 2026-27</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RECOMMENDED EXTERNAL HIRES</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FB7185' }}>18 Roles</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>MLOps, Cloud Native</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>INTERNAL UPSKILL TARGETS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>84 Engineers</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Saved ₹2.4 Cr in hiring fees</div>
        </div>
      </div>

      {/* SKILL COMPARISON BARS (Slide 19 Architecture) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Current Workforce Skills vs Future Project Requirements
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Visualizing capability deficits and suggested tactical actions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#6366F1', borderRadius: '3px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Current Workforce</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#F59E0B', borderRadius: '3px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Future Demand</span>
            </div>
          </div>
        </div>

        {/* Bars List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {data.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface-tint)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.skill}</span>
                  <span style={{ fontSize: '0.78rem', color: item.gapDelta > 30 ? '#FB7185' : '#34D399', marginLeft: '10px', fontWeight: 600 }}>
                    {item.gapDelta > 30 ? `Critical Gap (${item.gapDelta}%)` : `Manageable Gap (${item.gapDelta}%)`}
                  </span>
                </div>

                <span className={`badge-pill badge-${item.action.includes('Hire') ? 'danger' : item.action.includes('Reskill') ? 'warning' : 'verified'}`}>
                  Action: {item.action}
                </span>
              </div>

              {/* Progress Bar 1: Current Workforce */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>Current Capability:</span>
                  <span>{item.currentWorkforce}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--track)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.currentWorkforce}%`, height: '100%', background: '#6366F1', borderRadius: '999px' }} />
                </div>
              </div>

              {/* Progress Bar 2: Future Demand */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                  <span>Future Demand Target:</span>
                  <span>{item.futureDemand}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--track)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.futureDemand}%`, height: '100%', background: '#F59E0B', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
