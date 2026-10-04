import React, { useState } from 'react';
import {
  Home,
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Bell,
  LogOut,
  Search,
  CheckCircle2,
  Sparkles,
  Compass,
  Code2,
  MoreHorizontal,
  BarChart2,
} from 'lucide-react';

export function Navbar({
  role,
  authUser,
  onLogout,
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const goHome = () => {
    if (role === 'recruiter') {
      setActiveView('employer');
    } else {
      setActiveView('talent');
      setTalentTab('career_ai');
    }
  };

  const goProfile = () => {
    if (role === 'recruiter') {
      setActiveView('recruiter-profile');
    } else {
      setActiveView('talent');
      setTalentTab('profile');
    }
  };

  const topNav = [
    {
      id: 'talent',
      label: 'Home',
      icon: Home,
      action: goHome,
      active: activeView === 'talent' && talentTab !== 'networking' && talentTab !== 'opportunities' && talentTab !== 'profile',
    },
    {
      id: 'network',
      label: 'Network',
      icon: Users,
      action: () => { setActiveView('talent'); setTalentTab('networking'); },
      active: activeView === 'talent' && talentTab === 'networking',
    },
    {
      id: 'jobs',
      label: 'Jobs',
      icon: Briefcase,
      action: () => { setActiveView('talent'); setTalentTab('opportunities'); },
      active: activeView === 'talent' && talentTab === 'opportunities',
    },
    { id: 'employer', label: 'Hiring', icon: CheckCircle2, action: () => setActiveView('employer'), active: activeView === 'employer' },
    { id: 'university', label: 'Campus', icon: GraduationCap, action: () => setActiveView('university'), active: activeView === 'university' },
    { id: 'skillgraph', label: 'Insights', icon: TrendingUp, action: () => setActiveView('skillgraph'), active: activeView === 'skillgraph' },
  ];
  const visibleTopNav = role === 'recruiter'
    ? topNav.filter(item => item.id === 'employer')
    : topNav.filter(item => item.id !== 'employer' && item.id !== 'university');

  const talentTabs = [
    { id: 'career_ai', label: 'Career AI', icon: Compass },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'skill_gap', label: 'Skill Gap Matrix', icon: BarChart2 },
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
      setTalentTab('career_ai');
    }
  };

  return (
    <header className="header-container">
      <div className="header-main-row" style={{
        maxWidth: '1128px',
        margin: '0 auto',
        padding: '10px 12px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '72px'
      }}>
        <button className="header-brand" onClick={goHome} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', flexShrink: 0 }}>
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
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.04em', color: 'var(--primary)' }}>
              TalentX
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              PROFESSIONAL NETWORK
            </div>
          </div>
        </button>

        {role === 'candidate' && (
          <form className="nav-search" onSubmit={onSearch}>
            <Search size={16} color="#666666" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, people, skills"
              aria-label="Search"
            />
          </form>
        )}

        <nav className="primary-nav" style={{ display: 'flex', alignItems: 'stretch', marginLeft: 'auto', height: '100%' }}>
          {visibleTopNav.map(item => {
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

          {role === 'candidate' && (
            <>
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
                onClick={goProfile}
                className={`nav-item${activeView === 'talent' && talentTab === 'profile' ? ' active' : ''}`}
                style={{ borderLeft: '1px solid var(--border-subtle)', minWidth: '64px' }}
              >
                <img
                  src={user.avatar}
                  alt={authUser.name}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="label">Profile</span>
              </button>
            </>
          )}

          {role === 'recruiter' && (
            <button
              onClick={goProfile}
              className={`nav-item${activeView === 'recruiter-profile' ? ' active' : ''}`}
              style={{ borderLeft: '1px solid var(--border-subtle)', minWidth: '64px' }}
            >
              <img
                src={user.avatar}
                alt={authUser.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span className="label">Profile</span>
            </button>
          )}

          <button onClick={onLogout} className="nav-item" title={`Sign out ${authUser.email}`}>
            <LogOut className="nav-icon" size={20} />
            <span className="label">Sign out</span>
          </button>
        </nav>
      </div>

      {activeView === 'talent' && (talentTab === 'career_ai' || talentTab === 'projects' || talentTab === 'skill_gap') && (
        <div className="subnav-wrapper" style={{ borderTop: '1px solid var(--border-subtle)', background: '#FFFFFF' }}>
          <div className="subnav-scroll" style={{
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

            <div className="subnav-utility" style={{ marginLeft: 'auto', display: 'flex', gap: '8px', padding: '8px 0' }}>
              <button onClick={openResumeParser} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <Sparkles size={14} /> Upload resume
              </button>
            </div>
          </div>
        </div>
      )}

      {isMoreMenuOpen && (
        <>
          <button
            className="mobile-menu-backdrop"
            aria-label="Close more menu"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="mobile-more-menu" role="group" aria-label="More navigation">
            <button onClick={() => { setActiveView('skillgraph'); setIsMoreMenuOpen(false); }}>
              <TrendingUp size={18} /> Insights
            </button>
            <button onClick={() => { setShowNotifications(true); setIsMoreMenuOpen(false); }}>
              <Bell size={18} /> Alerts
              {unreadNotifications > 0 && <span className="mobile-alert-count">{unreadNotifications}</span>}
            </button>
            <button onClick={() => { openResumeParser(); setIsMoreMenuOpen(false); }}>
              <Sparkles size={18} /> Upload resume
            </button>
            <button onClick={onLogout}>
              <LogOut size={18} /> Sign out
            </button>
          </div>
        </>
      )}

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {role === 'candidate' ? (
          <>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab !== 'networking' && talentTab !== 'opportunities' && talentTab !== 'profile' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('career_ai'); }}
              aria-label="Home"
            >
              <Home size={21} />
              <span>Home</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'networking' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('networking'); }}
              aria-label="Network"
            >
              <Users size={21} />
              <span>Network</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'opportunities' ? ' active' : ''}`}
              onClick={() => { setActiveView('talent'); setTalentTab('opportunities'); }}
              aria-label="Jobs"
            >
              <Briefcase size={21} />
              <span>Jobs</span>
            </button>
            <button
              className={`mobile-tab${activeView === 'talent' && talentTab === 'profile' ? ' active' : ''}`}
              onClick={goProfile}
              aria-label="Profile"
            >
              <img src={user.avatar} alt="" />
              <span>Profile</span>
            </button>
            <button
              className={`mobile-tab${isMoreMenuOpen ? ' active' : ''}`}
              onClick={() => setIsMoreMenuOpen(open => !open)}
              aria-expanded={isMoreMenuOpen}
              aria-label="More"
            >
              <MoreHorizontal size={21} />
              <span>More</span>
            </button>
          </>
        ) : (
          <>
            <button className={`mobile-tab${activeView === 'employer' ? ' active' : ''}`} onClick={goHome}>
              <CheckCircle2 size={21} />
              <span>Hiring</span>
            </button>
            <button className={`mobile-tab${activeView === 'recruiter-profile' ? ' active' : ''}`} onClick={goProfile}>
              <img src={user.avatar} alt="" />
              <span>Profile</span>
            </button>
            <button className="mobile-tab" onClick={onLogout}>
              <LogOut size={21} />
              <span>Sign out</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
