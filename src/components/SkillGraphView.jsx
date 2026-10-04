import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Info,
  Maximize2,
  Filter
} from 'lucide-react';
import { MARKET_SKILL_TRENDS } from '../data/mockData';

export function SkillGraphView({ onNavigateToVerify }) {
  const canvasRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTrendTab, setActiveTrendTab] = useState('demanded'); // 'demanded' | 'emerging' | 'declining'

  // Graph Data Nodes
  const nodes = [
    { id: 'role_ds', label: 'Data Scientist', type: 'role', x: 260, y: 180, color: 'var(--primary)' },
    { id: 'role_ml', label: 'ML Engineer', type: 'role', x: 380, y: 320, color: 'var(--primary)' },
    { id: 'role_da', label: 'Data Analyst', type: 'role', x: 140, y: 320, color: 'var(--primary)' },

    { id: 'skill_py', label: 'Python', type: 'skill', x: 260, y: 60, color: 'var(--primary)' },
    { id: 'skill_sql', label: 'SQL', type: 'skill', x: 120, y: 160, color: 'var(--primary)' },
    { id: 'skill_ml', label: 'Machine Learning', type: 'skill', x: 420, y: 160, color: 'var(--primary)' },
    { id: 'skill_cloud', label: 'Cloud (AWS)', type: 'skill', x: 480, y: 260, color: 'var(--primary)' },
    { id: 'skill_stats', label: 'Statistics', type: 'skill', x: 180, y: 240, color: 'var(--primary)' },
    { id: 'skill_mlops', label: 'MLOps', type: 'skill', x: 500, y: 380, color: 'var(--primary)' },

    { id: 'comp_swiggy', label: 'Swiggy AI', type: 'company', x: 260, y: 440, color: '#F59E0B' },
    { id: 'comp_razorpay', label: 'Razorpay', type: 'company', x: 120, y: 440, color: '#F59E0B' },
    { id: 'comp_msft', label: 'Microsoft Research', type: 'company', x: 420, y: 460, color: '#F59E0B' },

    { id: 'proj_agri', label: 'AgriVision AI', type: 'project', x: 360, y: 80, color: '#10B981' }
  ];

  const links = [
    { from: 'skill_py', to: 'role_ds' },
    { from: 'skill_sql', to: 'role_ds' },
    { from: 'skill_stats', to: 'role_ds' },
    { from: 'skill_ml', to: 'role_ds' },
    { from: 'skill_py', to: 'role_ml' },
    { from: 'skill_ml', to: 'role_ml' },
    { from: 'skill_mlops', to: 'role_ml' },
    { from: 'skill_cloud', to: 'role_ml' },
    { from: 'skill_sql', to: 'role_da' },
    { from: 'skill_stats', to: 'role_da' },
    { from: 'skill_py', to: 'proj_agri' },
    { from: 'skill_ml', to: 'proj_agri' },
    { from: 'role_ds', to: 'comp_swiggy' },
    { from: 'role_da', to: 'comp_razorpay' },
    { from: 'role_ml', to: 'comp_msft' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Links
    links.forEach(link => {
      const fromNode = nodes.find(n => n.id === link.from);
      const toNode = nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const isConnected = selectedNode && (selectedNode.id === fromNode.id || selectedNode.id === toNode.id);

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = isConnected ? '#35B879' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = isConnected ? 2.5 : 1.2;
      ctx.stroke();
    });

    // Draw Nodes
    nodes.forEach(node => {
      const isSelected = selectedNode && selectedNode.id === node.id;

      // Glow circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? 22 : 16, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isSelected ? 20 : 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Border ring
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Node Label
      ctx.font = isSelected ? 'bold 12px Outfit, sans-serif' : '11px Outfit, sans-serif';
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + (isSelected ? 34 : 28));
    });
  }, [selectedNode]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Find clicked node
    const found = nodes.find(node => {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      return dist <= 24;
    });

    setSelectedNode(found || null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 128, 74, 0.15) 0%, rgba(34, 160, 107, 0.15) 100%)',
        border: '1px solid rgba(34, 128, 74, 0.35)',
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
            <Network size={22} color="#22A06B" />
            <span className="badge-pill badge-indigo">Connected Skill Graph</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            The Intelligence Layer Behind TalentX
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
            TalentX connects: <strong style={{ color: 'var(--primary)' }}>People ↔ Skills ↔ Roles ↔ Jobs ↔ Companies ↔ Projects</strong>.
            Click any node below to inspect relationships and dynamic career paths.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#35A36A', display: 'inline-block' }} /> Roles
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22A06B', display: 'inline-block' }} /> Skills
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#F59E0B' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} /> Companies
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10B981' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Projects
          </div>
        </div>
      </div>

      {/* GRAPH CANVAS & INSPECTOR ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'stretch' }}>
        {/* Interactive Canvas */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={620}
            height={520}
            onClick={handleCanvasClick}
            style={{ width: '100%', height: 'auto', maxHeight: '520px', cursor: 'pointer' }}
          />

          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            💡 Click on any node to highlight multi-hop connections.
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              NODE INTELLIGENCE INSPECTOR
            </div>

            {selectedNode ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: selectedNode.color }} />
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>{selectedNode.label}</h3>
                </div>
                <span className="badge-pill badge-indigo" style={{ marginBottom: '14px' }}>
                  Type: {selectedNode.type.toUpperCase()}
                </span>

                <div style={{
                  background: 'var(--surface-tint)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  {selectedNode.type === 'role' && `This role anchors core competencies in data processing and mathematical modeling. High employer demand across e-commerce and fintech.`}
                  {selectedNode.type === 'skill' && `Core programming competence required by 92% of AI job descriptions. Verified by TalentX Adaptive Assessments.`}
                  {selectedNode.type === 'company' && `Top tech enterprise hiring verified candidates directly through TalentX Fast-Track screening.`}
                  {selectedNode.type === 'project' && `Hands-on proof of skill built during national hackathon challenge.`}
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  CONNECTED EDGES:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {links
                    .filter(l => l.from === selectedNode.id || l.to === selectedNode.id)
                    .map((l, idx) => {
                      const otherId = l.from === selectedNode.id ? l.to : l.from;
                      const otherNode = nodes.find(n => n.id === otherId);
                      return (
                        <span key={idx} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(34, 128, 74, 0.15)', color: 'var(--primary)' }}>
                          ↔ {otherNode?.label}
                        </span>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Network size={36} color="var(--border-medium)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: '0.85rem' }}>Select any role, skill, or company in the graph to inspect its multi-hop relationships.</p>
              </div>
            )}
          </div>

          {selectedNode && selectedNode.type === 'skill' && (
            <button
              onClick={() => onNavigateToVerify(selectedNode.label)}
              className="btn-verified"
              style={{ width: '100%', padding: '10px' }}
            >
              Verify {selectedNode.label} Now
            </button>
          )}
        </div>
      </div>

      {/* MARKET DEMAND ANALYTICS (Slide 7 & 23) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Live Labor Market Intelligence & Trends
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Data-driven analytics synthesized from 25,000+ national job postings, government datasets, and platform assessments.
            </p>
          </div>

          <div style={{
            display: 'flex',
            background: 'var(--surface-tint)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            gap: '4px'
          }}>
            {[
              { id: 'demanded', label: 'Top Demanded' },
              { id: 'emerging', label: 'Emerging Hyper-Growth' },
              { id: 'declining', label: 'Declining / Legacy' }
            ].map(tab => {
              const isActive = activeTrendTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrendTab(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: isActive ? 'var(--grad-primary)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Top Demanded */}
        {activeTrendTab === 'demanded' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {MARKET_SKILL_TRENDS.topDemanded.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--surface-tint)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name}</span>
                  <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 700 }}>{item.growthYoY}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Demand Index: <strong style={{ color: 'var(--primary)' }}>{item.demandIndex}/100</strong>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Common in: {item.roles}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Emerging Hyper Growth */}
        {activeTrendTab === 'emerging' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {MARKET_SKILL_TRENDS.emergingHyperGrowth.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(34, 128, 74, 0.06)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 128, 74, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</span>
                  <span className="badge-pill badge-indigo">{item.badge}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>
                  {item.growthYoY} YoY
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                  Salary Impact: {item.salaryImpact}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Declining / Legacy */}
        {activeTrendTab === 'declining' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {MARKET_SKILL_TRENDS.decliningSkills.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</span>
                  <span className="badge-pill badge-danger">{item.status}</span>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FB7185', marginBottom: '4px' }}>
                  {item.growthYoY}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Migrate to: <strong style={{ color: 'var(--text-primary)' }}>{item.replacement}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
