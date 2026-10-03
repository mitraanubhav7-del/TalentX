import React, { useState } from 'react';
import { 
  Code2, 
  Users, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Trophy, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { COLLABORATION_PROJECTS } from '../data/mockData';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function ProjectHub({ user }) {
  const [projectsList, setProjectsList] = useState(COLLABORATION_PROJECTS);
  const [joinedRoles, setJoinedRoles] = useState({}); // { projId-role: true }
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEvent, setNewEvent] = useState('Build for Bharat 2.0');

  const handleApplyRole = (projectId, role) => {
    const key = `${projectId}-${role}`;
    setJoinedRoles(prev => ({ ...prev, [key]: true }));

    // update project state
    setProjectsList(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          team: p.team.map(m => m.role === role ? { ...m, member: user.name, filled: true } : m)
        };
      }
      return p;
    }));
  };

  const handleCreateProject = () => {
    if (!newTitle.trim()) return;

    const newProj = {
      id: `collab_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || "Collaborative multi-disciplinary project solving high-impact Bharat challenges.",
      team: [
        { role: "Project Lead (AI/Data)", member: user.name, filled: true },
        { role: "UI/UX Designer", member: null, filled: false },
        { role: "Backend Developer", member: null, filled: false },
        { role: "Domain Specialist", member: null, filled: false }
      ],
      event: newEvent,
      deadline: "In 30 days",
      tags: ["Bharat2.0", "AI", "Collaboration"],
      githubUrl: "https://github.com/talentx-bharat/team-build"
    };

    setProjectsList([newProj, ...projectsList]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 160, 107, 0.15) 0%, rgba(34, 128, 74, 0.1) 100%)',
        border: '1px solid rgba(34, 160, 107, 0.35)',
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
            <Code2 size={22} color="#22A06B" />
            <span className="badge-pill badge-cyan">Slide 14 — Project & Collaboration Hub</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Learn by Building: Complementary Skill Team Formation
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
            Find multi-disciplinary collaborators with complementary skills for national hackathons, research publications, and open-source systems.
            <br />
            <strong style={{ color: 'var(--primary)' }}>AI Developer + UI/UX Designer + Backend Developer + Data Analyst = Winning Team</strong>
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          <Plus size={16} /> Propose Project / Form Team
        </button>
      </div>

      {/* Projects List with Team Slot Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projectsList.map(project => (
          <div
            key={project.id}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="badge-pill badge-indigo">
                    <Trophy size={12} /> {project.event}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Deadline: {project.deadline}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
              </div>

              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              >
                <GithubIcon size={14} /> Repository
              </a>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {project.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.tags.map((tag, tIdx) => (
                <span key={tIdx} className="badge-pill badge-cyan" style={{ fontSize: '0.72rem' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* COMPLEMENTARY SKILL TEAM SLOTS (Slide 14 Architecture) */}
            <div style={{
              background: 'var(--surface-tint)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Users size={14} /> TEAM COMPOSITION & VACANT SLOTS:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {project.team.map((slot, idx) => {
                  const key = `${project.id}-${slot.role}`;
                  const isUserJoined = joinedRoles[key];
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: slot.filled ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                        border: slot.filled ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '80px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {slot.role}
                        </span>
                        {slot.filled ? (
                          <span className="badge-pill badge-verified" style={{ fontSize: '0.65rem' }}>
                            Filled ✓
                          </span>
                        ) : (
                          <span className="badge-pill badge-warning" style={{ fontSize: '0.65rem' }}>
                            Vacant
                          </span>
                        )}
                      </div>

                      {slot.filled ? (
                        <div style={{ fontSize: '0.78rem', color: '#6EE7B7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={13} /> {slot.member}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyRole(project.id, slot.role)}
                          className="btn-primary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            marginTop: '6px',
                            width: '100%',
                            background: isUserJoined ? 'var(--accent-emerald)' : 'var(--grad-primary)'
                          }}
                        >
                          {isUserJoined ? 'Joined Team ✓' : 'Join as ' + slot.role}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            background: 'var(--bg-glass-heavy)',
            border: '1px solid rgba(34, 160, 107, 0.4)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Create New Collaboration Project
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              List your hackathon project and invite complementary talent (UI/UX, Backend, AI, Data).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. SwasthyaAI - Vernacular Telehealth Bot"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--surface-tint)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Problem Brief</label>
                <textarea
                  rows={3}
                  placeholder="Describe the challenge you are solving and who you are building for..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--surface-tint)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Hackathon / Event</label>
                <input
                  type="text"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--surface-tint)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateProject} className="btn-primary">
                Publish Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
