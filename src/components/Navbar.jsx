import React, { useState } from 'react';
import {
  Home,
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Presentation,
  Bell,
  Search,
  CheckCircle2,
  Sparkles,
  Compass,
  Cpu,
  Share2,
  Code2,
} from 'lucide-react';

export function Navbar({
  activeView,
  setActiveView,
  talentTab,
  setTalentTab,
  user,
  unreadNotifications,
  setShowNotifications,
  openResumeParser
}) {
  const [query, setQuery] = useState('');

  const goHome = () => {
    setActiveView('talent');
    setTalentTab('networking');
  };

  const goProfile = () => {
    setActiveView('talent');
    setTalentTab('profile');
  };

  const topNav = [
    { id: 'talent', label: 'Home', icon: Home, action: goHome },
    { id: 'network', label: 'Network', icon: Users, action: () => { setActiveView('talent'); setTalentTab('networking'); }, active: activeView === 'talent' && talentTab === 'networking' },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, action: () => { setActiveView('talent'); setTalentTab('opportunities'); }, active: activeView === 'talent' && talentTab === 'opportunities' },
    { id: 'employer', label: 'Hiring', icon: CheckCircle2, action: () => setActiveView('employer'), active: activeView === 'employer' },
    { id: 'university', label: 'Campus', icon: GraduationCap, action: () => setActiveView('university'), active: activeView === 'university' },
    { id: 'skillgraph', label: 'Insights', icon: TrendingUp, action: () => setActiveView('skillgraph'), active: activeView === 'skillgraph' },
  ];

  const talentTabs = [
    { id: 'career_ai', label: 'Career AI', icon: Compass },
    { id: 'roadmap', label: 'Roadmap', icon: TrendingUp },
    { id: 'simulator', label: 'Simulator', icon: Cpu },
    { id: 'networking', label: 'Feed', icon: Share2 },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'opportunities', label: 'Jobs', icon: Briefcase },
  ];

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    if (q.includes('job') || q.includes('hire') || q.includes('opportunit')) {
      setActiveView('talent');
      setTalentTab('opportunities');
    } else if (q.includes('network') || q.includes('feed')) {
      setActiveView('talent');
      setTalentTab('networking');
    } else if (q.includes('skill') || q.includes('verif')) {
      setActiveView('talent');
      setTalentTab('profile');
    } else if (q.includes('project')) {
      setActiveView('talent');
      setTalentTab('projects');
    } else if (q.includes('employer') || q.includes('hiring')) {
      setActiveView('employer');
    } else {
      setActiveView('talent');
      setTalentTab('networking');
    }
  };

  return (
    <header className="header-container">
      <div style={{
        maxWidth: '1128px',
        margin: '0 auto',
        padding: '10px 12px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '72px'
      }}>
        <button onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', flexShrink: 0 }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            background: '#1ba83a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-0.04em'
          }}>
            tX
          </div>
          <div style={{ lineHeight: 1.1, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.04em', color: '#0A66C2' }}>
              TalentX
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              PROFESSIONAL NETWORK
            </div>
          </div>
        </button>

        <form className="nav-search" onSubmit={onSearch}>
          <Search size={16} color="#666666" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, people, skills"
            aria-label="Search"
          />
        </form>

        <nav style={{ display: 'flex', alignItems: 'stretch', marginLeft: 'auto', height: '100%' }}>
          {topNav.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item${item.active ? ' active' : ''}`}
                onClick={item.action}
              >
                <Icon className="nav-icon" size={22} strokeWidth={item.active ? 2.2 : 1.8} />
                <span className="label">{item.label}</span>
              </button>
            );
          })}

          <button
            className="nav-item"
            onClick={() => setShowNotifications(prev => !prev)}
            style={{ position: 'relative' }}
          >
            <Bell className="nav-icon" size={22} strokeWidth={1.8} />
            <span className="label">Alerts</span>
            {unreadNotifications > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '18px',
                minWidth: '16px',
                height: '16px',
                padding: '0 4px',
                background: '#CC1016',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '0.62rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadNotifications}
              </span>
            )}
          </button>

          <button
            className={`nav-item${activeView === 'presentation' ? ' active' : ''}`}
            onClick={() => setActiveView('presentation')}
          >
            <Presentation className="nav-icon" size={22} strokeWidth={activeView === 'presentation' ? 2.2 : 1.8} />
            <span className="label">Deck</span>
          </button>

          <button
            onClick={goProfile}
            className={`nav-item${activeView === 'talent' && talentTab === 'profile' ? ' active' : ''}`}
            style={{ borderLeft: '1px solid var(--border-subtle)', minWidth: '64px' }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span className="label">Profile</span>
          </button>
        </nav>
      </div>

      {activeView === 'talent' && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', background: '#FFFFFF' }}>
          <div style={{
            maxWidth: '1128px',
            margin: '0 auto',
            padding: '0 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto'
          }}>
            {talentTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = talentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className={`subnav-link${isActive ? ' active' : ''}`}
                  onClick={() => setTalentTab(tab.id)}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.3 : 1.8} />
                  {tab.label}
                </button>
              );
            })}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', padding: '8px 0' }}>
              <button onClick={openResumeParser} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <Sparkles size={14} /> Upload resume
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
