import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Globe, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Code, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Star,
  Users,
  Trophy,
  FileText
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* PROFILE HEADER / HERO BANNER */}
      <div className="glass-panel" style={{
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        background: 'var(--bg-glass-heavy)'
      }}>
        {/* Banner Image */}
        <div style={{
          height: '160px',
          backgroundImage: `linear-gradient(180deg, rgba(7, 10, 18, 0.2) 0%, rgba(7, 10, 18, 0.85) 100%), url(${user.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={openResumeParser}
              className="btn-secondary"
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                padding: '6px 14px',
                fontSize: '0.8rem'
              }}
            >
              <Sparkles size={14} color="#A855F7" />
              Sync Resume with AI
            </button>
            <button
              onClick={() => openVerificationModal("Machine Learning")}
              className="btn-verified"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} />
              Verify New Skill
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div style={{ padding: '0 28px 28px', marginTop: '-50px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Avatar & Core Title */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{
                    width: '110px',
                    height: '110px',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '4px solid #0F172A',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  background: 'var(--grad-verified)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #0F172A',
                  boxShadow: 'var(--shadow-emerald-glow)'
                }}>
                  <ShieldCheck size={18} color="#042f1a" />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.8rem', color: '#fff' }}>{user.name}</h1>
                  <span className="badge-pill badge-verified">
                    TalentX Verified Fellow
                  </span>
                </div>
                <div style={{ fontSize: '1rem', color: '#38BDF8', fontWeight: 600, marginTop: '2px' }}>
                  {user.title}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  marginTop: '6px'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#94A3B8" /> {user.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GraduationCap size={14} color="#94A3B8" /> {user.university}
                  </span>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>
                    Target: {user.targetRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>VERIFIED BADGES</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34D399' }}>
                  {user.verifiedBadgeCount}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CAREER READINESS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818CF8' }}>
                  {user.careerReadiness}%
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 18px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REPUTATION</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FBBF24' }}>
                  {user.reputationScore}
                </div>
              </div>
            </div>
          </div>

          {/* About Bio */}
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '850px',
            marginBottom: '16px'
          }}>
            {user.about}
          </p>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <GithubIcon size={14} /> GitHub Profile
            </a>
            <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <LinkedinIcon size={14} /> LinkedIn
            </a>
            <a href={user.socialLinks.portfolio} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <Globe size={14} /> Portfolio Site
            </a>
          </div>
        </div>
      </div>

      {/* VERIFIED SKILLS SECTION (Slide 8) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#fff' }}>
                Verified Skill Credentials
              </h2>
              <span className="badge-pill badge-verified">Don't Just Claim. Prove It.</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Skills validated through rigorous scenario tests, automated code sandboxes, and cryptographic evaluation.
            </p>
          </div>

          <button
            onClick={() => openVerificationModal("Machine Learning")}
            className="btn-verified"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={14} /> Verify Another Skill
          </button>
        </div>

        {/* Skills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {user.skills.map((skill, idx) => (
            <div
              key={idx}
              style={{
                background: skill.verified ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                border: skill.verified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{skill.name}</span>
                {skill.verified ? (
                  <span className="badge-pill badge-verified" style={{ fontSize: '0.7rem' }}>
                    Verified ✓
                  </span>
                ) : (
                  <span className="badge-pill badge-warning" style={{ fontSize: '0.7rem' }}>
                    Unverified
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <span>Level: <strong style={{ color: skill.verified ? '#34D399' : '#fff' }}>{skill.level}</strong></span>
                <span>Score: <strong style={{ color: skill.verified ? '#34D399' : 'var(--text-muted)' }}>{skill.score}/100</strong></span>
              </div>

              {/* Progress meter */}
              <div style={{
                height: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.score}%`,
                  background: skill.verified ? 'var(--grad-verified)' : 'var(--accent-amber)',
                  borderRadius: '999px'
                }} />
              </div>

              {skill.verified ? (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {skill.certId}
                </div>
              ) : (
                <button
                  onClick={() => openVerificationModal(skill.name)}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '6px', fontSize: '0.75rem', marginTop: '4px' }}
                >
                  Take Verification Test
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROJECTS & COLLABORATIONS SECTION (Slide 14) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={20} color="#06B6D4" /> Portfolio Projects & Hackathons
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              "Learn by Building" — Live deployed applications with verified GitHub codebases.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('projects')}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            Project & Team Hub →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
          {user.projects.map(proj => (
            <div
              key={proj.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {proj.hackathonAward && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#FBBF24',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}>
                    <Trophy size={13} /> {proj.hackathonAward}
                  </div>
                )}

                <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>
                  {proj.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {proj.description}
                </p>

                {/* Tech Stacks */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="badge-pill badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {tech}
                    </span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={13} color="#FBBF24" /> {proj.stars} stars
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} /> {proj.collaborators} teammates
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={proj.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <GithubIcon size={12} /> Code
                  </a>
                  <a href={proj.demo} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <ExternalLink size={12} /> Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERIENCE & EDUCATION SPLIT (Slide 6) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Experience Timeline */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Briefcase size={18} color="#818CF8" /> Industry Experience
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {user.experience.map(exp => (
              <div key={exp.id} style={{ borderLeft: '2px solid rgba(99, 102, 241, 0.4)', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{exp.role}</div>
                <div style={{ fontSize: '0.8rem', color: '#38BDF8', marginBottom: '4px' }}>
                  {exp.company} • <span style={{ color: 'var(--text-muted)' }}>{exp.period}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '6px' }}>
                  {exp.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {exp.skillsUsed.map((sk, sIdx) => (
                    <span key={sIdx} style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <GraduationCap size={18} color="#06B6D4" /> Education & Certifications
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
            {user.education.map((edu, idx) => (
              <div key={idx} style={{ borderLeft: '2px solid rgba(6, 182, 212, 0.4)', paddingLeft: '14px' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{edu.degree}</div>
                <div style={{ fontSize: '0.8rem', color: '#06B6D4' }}>{edu.institution}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{edu.period} • {edu.grade}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{edu.highlights}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            LICENSES & CERTIFICATIONS:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {user.certifications.map((cert, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{cert.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cert.issuer} • {cert.date}</div>
                </div>
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{ color: '#38BDF8', fontSize: '0.75rem' }}>
                  Verify ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
