import React from 'react';
import { 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Network, 
  Presentation, 
  CheckCircle2, 
  Bell, 
  Search,
  Layers,
  Compass,
  Code2,
  Cpu,
  Share2,
  TrendingUp
} from 'lucide-react';

export function Navbar({ 
  activeView, 
  setActiveView, 
  talentTab, 
  setTalentTab, 
  user, 
  unreadNotifications, 
  setShowNotifications,
  openResumeParser,
  openVerificationModal
}) {
  return (
    <header className="header-container">
      {/* Top Banner for Bharat 2.0 / Hackathon Context */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 50%, rgba(16, 185, 129, 0.25) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '5px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#E2E8F0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            background: 'var(--grad-primary)', 
            color: '#fff', 
            padding: '2px 8px', 
            borderRadius: '4px', 
            fontWeight: 800,
            fontSize: '0.7rem',
            letterSpacing: '0.05em'
          }}>
            BUILD FOR BHARAT 2.0
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Problem Statement: Intelligent Talent & Workforce Ecosystem
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Tagline: <strong style={{ color: '#38BDF8' }}>Learn → Build → Verify → Connect → Discover → Get Hired → Grow</strong>
          </span>
          <button 
            onClick={() => setActiveView('presentation')}
            style={{
              background: activeView === 'presentation' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '2px 10px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Presentation size={12} />
            30-Slide Pitch Deck
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('talent')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.45rem', 
                fontWeight: 900, 
                letterSpacing: '-0.03em',
                color: '#fff'
              }}>
                Talent<span style={{ color: '#06B6D4' }}>X</span>
              </span>
              <span className="badge-pill badge-verified" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                AI INTELLIGENCE
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Intelligent Talent Ecosystem
            </div>
          </div>
        </div>

        {/* Stakeholder View Modes Switcher */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          gap: '2px'
        }}>
          <button
            onClick={() => setActiveView('talent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: activeView === 'talent' ? 'var(--grad-primary)' : 'transparent',
              color: activeView === 'talent' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeView === 'talent' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <User size={15} />
            Talent Portal
          </button>

          <button
            onClick={() => setActiveView('employer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: activeView === 'employer' ? 'var(--grad-primary)' : 'transparent',
              color: activeView === 'employer' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeView === 'employer' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Briefcase size={15} />
            Employer Portal
          </button>

          <button
            onClick={() => setActiveView('university')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: activeView === 'university' ? 'var(--grad-primary)' : 'transparent',
              color: activeView === 'university' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeView === 'university' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <GraduationCap size={15} />
            University Intelligence
          </button>

          <button
            onClick={() => setActiveView('skillgraph')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: 600,
              background: activeView === 'skillgraph' ? 'var(--grad-primary)' : 'transparent',
              color: activeView === 'skillgraph' ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeView === 'skillgraph' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Network size={15} />
            Skill Graph & Market
          </button>
        </nav>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* User Verified Status Pill */}
          <div 
            onClick={openVerificationModal}
            className="badge-pill badge-verified" 
            style={{ 
              cursor: 'pointer',
              padding: '6px 12px',
              boxShadow: '0 0 12px rgba(16, 185, 129, 0.2)' 
            }}
            title="Click to verify a new skill"
          >
            <CheckCircle2 size={14} color="#10B981" />
            <span>{user.verifiedBadgeCount} Verified Skills</span>
          </div>

          {/* Quick Resume Upload Button */}
          <button
            onClick={openResumeParser}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            title="Upload and parse resume with AI"
          >
            <Sparkles size={14} color="#A855F7" />
            AI Resume Parser
          </button>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  background: 'var(--accent-rose)',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* User Mini Avatar */}
          <div 
            onClick={() => { setActiveView('talent'); setTalentTab('profile'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '3px 8px 3px 4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.04)'
            }}
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              {user.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation bar when inside Talent Portal */}
      {activeView === 'talent' && (
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(10, 15, 28, 0.95)',
          padding: '0 24px'
        }}>
          <div style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '8px 0'
          }}>
            {[
              { id: 'profile', label: 'Intelligent Profile', icon: User, badge: 'Slide 6' },
              { id: 'verification', label: 'Skill Verification', icon: CheckCircle2, badge: 'Slide 8' },
              { id: 'career_ai', label: 'Career AI & Gaps', icon: Compass, badge: 'Slide 9-10' },
              { id: 'roadmap', label: 'Action Roadmap', icon: TrendingUp, badge: 'Slide 11' },
              { id: 'simulator', label: 'Career Simulator', icon: Cpu, badge: 'Slide 12' },
              { id: 'networking', label: 'Network & Feed', icon: Share2, badge: 'Slide 13' },
              { id: 'projects', label: 'Project & Team Hub', icon: Code2, badge: 'Slide 14' },
              { id: 'opportunities', label: 'Smart Opportunities', icon: Briefcase, badge: 'Slide 15' }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = talentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTalentTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    background: isActive ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                    color: isActive ? '#818CF8' : 'var(--text-secondary)',
                    border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent'
                  }}
                >
                  <Icon size={14} color={isActive ? '#818CF8' : '#94A3B8'} />
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#C7D2FE' : 'var(--text-muted)'
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
