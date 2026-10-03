import React from 'react';
import {
  ShieldCheck,
  Award,
  Globe,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  ExternalLink,
  Plus,
  Star,
  Users,
  Trophy,
  Sparkles,
} from 'lucide-react';

const GithubIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function ProfileView({
  user,
  openResumeParser,
  openVerificationModal,
  onNavigateToTab
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{
          height: '196px',
          backgroundImage: `linear-gradient(180deg, rgba(22, 101, 52, 0.15) 0%, rgba(22, 101, 52, 0.55) 100%), url(${user.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />

        <div style={{ padding: '0 24px 20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', marginTop: '-72px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '152px',
                    height: '152px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #FFFFFF',
                    background: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: '#057642',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff'
                }}>
                  <ShieldCheck size={16} color="#fff" />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '16px' }}>
              <button onClick={openResumeParser} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <Sparkles size={15} /> Upload resume
              </button>
              <button onClick={() => openVerificationModal('Machine Learning')} className="btn-verified" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                <ShieldCheck size={15} /> Verify skill
              </button>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.55rem' }}>{user.name}</h1>
              <span className="badge-pill badge-verified">
                <Award size={12} /> Verified Fellow
              </span>
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {user.title}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '0.86rem',
              color: 'var(--text-secondary)',
              marginTop: '6px',
              flexWrap: 'wrap'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} /> {user.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <GraduationCap size={14} /> {user.university}
              </span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 650 }}>
                Open to: {user.targetRole}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div className="metric-tile">
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 650 }}>VERIFIED SKILLS</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{user.verifiedBadgeCount}</div>
            </div>
            <div className="metric-tile">
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 650 }}>CAREER READINESS</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>{user.careerReadiness}%</div>
            </div>
            <div className="metric-tile">
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 650 }}>REPUTATION</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#C37D16' }}>{user.reputationScore}</div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '850px', marginTop: '16px' }}>
            {user.about}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <GithubIcon size={14} /> GitHub
            </a>
            <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <LinkedinIcon size={14} /> LinkedIn
            </a>
            <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Globe size={14} /> Portfolio
            </a>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="icon-well green"><ShieldCheck size={16} /></span>
              Skills
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', paddingLeft: '44px' }}>
              Verified through scenario tests — not just self-reported.
            </p>
          </div>
          <button onClick={() => openVerificationModal('Machine Learning')} className="btn-verified" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            <Plus size={14} /> Add skill
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {user.skills.map((skill, idx) => (
            <div
              key={idx}
              style={{
                background: skill.verified ? '#F3F9F5' : 'var(--surface-tint)',
                border: skill.verified ? '1px solid #B7DCC4' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{skill.name}</span>
                {skill.verified ? (
                  <span className="badge-pill badge-verified">Verified</span>
                ) : (
                  <span className="badge-pill badge-warning">Unverified</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Level: <strong style={{ color: skill.verified ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>{skill.level}</strong></span>
                <span>Score: <strong>{skill.score}/100</strong></span>
              </div>
              <div style={{ height: '6px', background: 'var(--track)', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{
                  height: '100%',
                  width: `${skill.score}%`,
                  background: skill.verified ? 'var(--accent-emerald)' : 'var(--primary)',
                  borderRadius: '999px'
                }} />
              </div>
              {skill.verified ? (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {skill.certId}
                </div>
              ) : (
                <button onClick={() => openVerificationModal(skill.name)} className="btn-secondary" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
                  Take verification test
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="icon-well blue"><Code size={16} /></span>
              Projects
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', paddingLeft: '44px' }}>
              Live work with verified GitHub repositories.
            </p>
          </div>
          <button onClick={() => onNavigateToTab('projects')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            Open project hub
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '12px' }}>
          {user.projects.map(proj => (
            <div key={proj.id} style={{
              background: 'var(--surface-tint)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                {proj.hackathonAward && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FEF3E8',
                    border: '1px solid #F0D0B0',
                    color: '#B24020',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}>
                    <Trophy size={13} /> {proj.hackathonAward}
                  </div>
                )}
                <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {proj.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="badge-pill badge-indigo">{tech}</span>
                  ))}
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} color="#C37D16" /> {proj.stars}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} /> {proj.collaborators}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={proj.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <GithubIcon size={12} /> Code
                  </a>
                  <a href={proj.demo} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <ExternalLink size={12} /> Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="icon-well purple"><Briefcase size={16} /></span>
            Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user.experience.map(exp => (
              <div key={exp.id} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{exp.role}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary)', marginBottom: '4px' }}>
                  {exp.company} • <span style={{ color: 'var(--text-muted)' }}>{exp.period}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '6px' }}>
                  {exp.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {exp.skillsUsed.map((sk, sIdx) => (
                    <span key={sIdx} className="badge-pill badge-indigo">{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span className="icon-well amber"><GraduationCap size={16} /></span>
            Education
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            {user.education.map((edu, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid var(--accent-emerald)', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{edu.degree}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>{edu.institution}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{edu.period} • {edu.grade}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{edu.highlights}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.04em' }}>
            LICENSES & CERTIFICATIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {user.certifications.map((cert, idx) => (
              <div key={idx} style={{
                background: 'var(--surface-tint)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 650 }}>{cert.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cert.issuer} • {cert.date}</div>
                </div>
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 650 }}>
                  Verify
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
