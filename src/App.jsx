import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthLoading, AuthScreen, PendingApproval } from './components/AuthScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileView } from './components/ProfileView';
import { ProfileSetup } from './components/ProfileSetup';
import { SkillVerificationModal } from './components/SkillVerificationModal';
import { ResumeParserModal } from './components/ResumeParserModal';
import { CareerIntelligence } from './components/CareerIntelligence';
import { NetworkingFeed } from './components/NetworkingFeed';
import { ProjectHub } from './components/ProjectHub';
import { OpportunitiesView } from './components/OpportunitiesView';
import { EmployerPortal } from './components/EmployerPortal';
import { UniversityPortal } from './components/UniversityPortal';
import { SkillGraphView } from './components/SkillGraphView';
import { INITIAL_USER } from './data/mockData';
import { authApi } from './services/auth';
import { profileIsComplete } from './utils/profile';
import { 
  Bell,
  X
} from 'lucide-react';

export function App() {
  const [user, setUser] = useState(INITIAL_USER);
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isRefreshingApproval, setIsRefreshingApproval] = useState(false);
  const [authError, setAuthError] = useState('');
  const [capacityNotice, setCapacityNotice] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeView, setActiveView] = useState('talent'); // 'talent' | 'employer' | 'university' | 'skillgraph'
  const [talentTab, setTalentTab] = useState('career_ai');

  useEffect(() => {
    let isCurrent = true;
    authApi.currentUser()
      .then(({ user: currentUser }) => {
        if (!isCurrent) return;
        setAuthUser(currentUser);
        if (currentUser.role === 'recruiter') {
          setUser(prev => ({ ...prev, ...currentUser.profile, name: currentUser.name }));
          setActiveView('employer');
        } else if (currentUser.role === 'admin') {
          setUser(prev => ({ ...prev, name: currentUser.name }));
        } else {
          setUser(prev => ({ ...prev, ...currentUser.profile, name: currentUser.name }));
          setActiveView('talent');
          setTalentTab('career_ai');
        }
      })
      .catch(error => {
        if (!isCurrent) return;
        if (error.code === 'user_capacity_reached') {
          setCapacityNotice(error.message);
        } else if (error.status !== 401) {
          setAuthError(error.message);
        }
      })
      .finally(() => {
        if (isCurrent) setIsCheckingSession(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const handleAuthenticated = (authenticatedUser) => {
    setAuthError('');
    setCapacityNotice('');
    setAuthUser(authenticatedUser);
    if (authenticatedUser.role === 'recruiter') {
      setUser(prev => ({ ...prev, ...authenticatedUser.profile, name: authenticatedUser.name }));
      setActiveView('employer');
    } else if (authenticatedUser.role === 'admin') {
      setUser(prev => ({ ...prev, name: authenticatedUser.name }));
    } else {
      setUser(prev => ({ ...prev, ...authenticatedUser.profile, name: authenticatedUser.name }));
      setActiveView('talent');
      setTalentTab('career_ai');
    }
  };

  const handleProfileSaved = profile => {
    setAuthUser(current => ({ ...current, profile }));
    setUser(current => ({ ...current, ...profile }));
    setIsEditingProfile(false);
    if (authUser.role === 'recruiter') {
      setActiveView('employer');
    } else {
      setActiveView('talent');
      setTalentTab('career_ai');
    }
  };

  useEffect(() => {
    if (
      !authUser
      || authUser.role === 'admin'
      || (authUser.role === 'recruiter' && !authUser.approved)
    ) return undefined;

    let isCurrent = true;
    const intervalId = setInterval(async () => {
      try {
        await authApi.activity();
      } catch (error) {
        if (!isCurrent) return;
        if (error.code === 'user_capacity_reached') {
          setCapacityNotice(error.message);
          setAuthUser(null);
          setActiveView('talent');
          setTalentTab('networking');
        } else if (error.status === 401) {
          setAuthError(error.message);
          setAuthUser(null);
        } else {
          setAuthError(`Could not confirm this active session: ${error.message}`);
        }
      }
    }, 60_000);

    return () => {
      isCurrent = false;
      clearInterval(intervalId);
    };
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setAuthUser(null);
      setAuthError('');
      setActiveView('talent');
      setTalentTab('networking');
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleRefreshApproval = async () => {
    setIsRefreshingApproval(true);
    setAuthError('');
    try {
      const { user: currentUser } = await authApi.currentUser();
      handleAuthenticated(currentUser);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsRefreshingApproval(false);
    }
  };

  // Modals
  const [isResumeParserOpen, setIsResumeParserOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationDefaultSkill, setVerificationDefaultSkill] = useState("Machine Learning");
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Swiggy AI Labs Shortlisted Your Profile",
      desc: "Your verified Python (88%) & SQL (82%) scores qualified you for direct Round 2 interview.",
      time: "10 mins ago",
      read: false
    },
    {
      id: 2,
      title: "Aditya Nair (Swiggy AI) Sent a Connection Request",
      desc: "Matched via AI Networking based on your target role in Data Science.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 3,
      title: "Build for Bharat 2.0 Registration Closing",
      desc: "12 days remaining to submit final AgriVision AI project repository.",
      time: "1 day ago",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpenVerification = (skillName = "Machine Learning") => {
    setVerificationDefaultSkill(skillName);
    setIsVerificationModalOpen(true);
  };

  // Called when Skill Verification is passed
  const handleSkillVerified = (result) => {
    setUser(prev => {
      const existing = prev.skills.filter(s => s.name.toLowerCase() !== result.skill.toLowerCase());
      const updatedSkill = {
        name: result.skill,
        level: result.level,
        verified: true,
        score: result.score,
        certId: result.certId
      };

      const newBadgeCount = prev.verifiedBadgeCount + 1;
      const newReadiness = Math.min(96, prev.careerReadiness + 8);

      return {
        ...prev,
        skills: [updatedSkill, ...existing],
        verifiedBadgeCount: newBadgeCount,
        careerReadiness: newReadiness,
        reputationScore: prev.reputationScore + 120
      };
    });

    // Add alert notification
    setNotifications(prev => [
      {
        id: Date.now(),
        title: `Skill Verified: ${result.skill} (${result.score}/100)`,
        desc: `Earned TalentX Verified Badge ${result.certId} (${result.level} Tier). Added to profile ledger.`,
        time: "Just now",
        read: false
      },
      ...prev
    ]);
  };

  // Called when AI Resume Parser confirms extraction
  const handleResumeSync = (extractedData) => {
    setUser(prev => {
      // Map extracted skills into profile
      const newSkills = extractedData.skills.map(s => {
        const found = prev.skills.find(ps => ps.name.toLowerCase() === s.name.toLowerCase());
        return found || {
          name: s.name,
          level: s.level,
          verified: false,
          score: 60,
          certId: null
        };
      });

      return {
        ...prev,
        skills: newSkills,
        reputationScore: prev.reputationScore + 50
      };
    });

    setNotifications(prev => [
      {
        id: Date.now(),
        title: "AI Resume Parsing Completed",
        desc: `Synchronized ${extractedData.skills.length} skills and projects from resume.`,
        time: "Just now",
        read: false
      },
      ...prev
    ]);
  };

  if (isCheckingSession) return <AuthLoading />;
  if (authError && !authUser && !capacityNotice) {
    return (
      <main className="auth-screen">
        <section className="auth-card">
          <h1>Can't reach TalentX</h1>
          <p className="auth-description">{authError}</p>
          <button className="auth-submit" onClick={() => window.location.reload()}>Try again</button>
        </section>
      </main>
    );
  }
  if (!authUser) return <AuthScreen onAuthenticated={handleAuthenticated} capacityNotice={capacityNotice} />;
  if (authUser.role === 'admin') {
    return <AdminDashboard user={authUser} onLogout={handleLogout} />;
  }
  if (authUser.role === 'recruiter' && !authUser.approved) {
    return (
      <PendingApproval
        user={authUser}
        onLogout={handleLogout}
        onRefresh={handleRefreshApproval}
        error={authError}
        isRefreshing={isRefreshingApproval}
      />
    );
  }
  if (
    ['candidate', 'recruiter'].includes(authUser.role)
    && (isEditingProfile || !profileIsComplete(authUser.profile))
  ) {
    return (
      <ProfileSetup
        user={{ name: authUser.name, role: authUser.role, profile: authUser.profile }}
        onSaved={handleProfileSaved}
        onCancel={() => setIsEditingProfile(false)}
        onLogout={handleLogout}
        isRequired={!profileIsComplete(authUser.profile)}
      />
    );
  }

  return (
    <div className="app-shell">
      {/* Top Main Navigation */}
      <Navbar
        role={authUser.role}
        authUser={authUser}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={setActiveView}
        talentTab={talentTab}
        setTalentTab={setTalentTab}
        user={user}
        unreadNotifications={unreadCount}
        setShowNotifications={setShowNotifications}
        openResumeParser={() => setIsResumeParserOpen(true)}
      />

      {/* Main Page Layout Container */}
      <main className="app-main">
        {authError && (
          <p className="auth-error" role="alert" style={{ marginBottom: '16px' }}>
            {authError}
          </p>
        )}
        {activeView === 'recruiter-profile' && authUser.role === 'recruiter' && (
          <ProfileView
            user={user}
            role="recruiter"
            onEditProfile={() => setIsEditingProfile(true)}
          />
        )}
        {/* VIEW 1: TALENT PORTAL */}
        {activeView === 'talent' && (
          <div>
            {talentTab === 'profile' && (
              <ProfileView
                user={user}
                openResumeParser={() => setIsResumeParserOpen(true)}
                openVerificationModal={handleOpenVerification}
                onNavigateToTab={setTalentTab}
                onEditProfile={() => setIsEditingProfile(true)}
              />
            )}

            {talentTab === 'career_ai' && (
              <CareerIntelligence
                user={user}
                openVerificationModal={handleOpenVerification}
                navigateToProjects={() => setTalentTab('projects')}
                navigateToOpportunities={() => setTalentTab('opportunities')}
                initialTab="intelligence"
              />
            )}

            {talentTab === 'skill_gap' && (
              <CareerIntelligence
                user={user}
                openVerificationModal={handleOpenVerification}
                navigateToProjects={() => setTalentTab('projects')}
                navigateToOpportunities={() => setTalentTab('opportunities')}
                initialTab="gap"
              />
            )}

            {talentTab === 'roadmap' && (
              <CareerIntelligence
                user={user}
                openVerificationModal={handleOpenVerification}
                navigateToProjects={() => setTalentTab('projects')}
                navigateToOpportunities={() => setTalentTab('opportunities')}
                initialTab="roadmap"
              />
            )}

            {talentTab === 'simulator' && (
              <CareerIntelligence
                user={user}
                openVerificationModal={handleOpenVerification}
                navigateToProjects={() => setTalentTab('projects')}
                navigateToOpportunities={() => setTalentTab('opportunities')}
                initialTab="simulator"
              />
            )}

            {talentTab === 'networking' && (
              <NetworkingFeed user={user} authUser={authUser} />
            )}

            {talentTab === 'projects' && (
              <ProjectHub user={user} />
            )}

            {talentTab === 'opportunities' && (
              <OpportunitiesView user={user} />
            )}
          </div>
        )}

        {/* VIEW 2: EMPLOYER PORTAL */}
        {activeView === 'employer' && (
          <EmployerPortal currentUserId={authUser.id} />
        )}

        {/* VIEW 3: UNIVERSITY INTELLIGENCE */}
        {activeView === 'university' && (
          <UniversityPortal />
        )}

        {/* VIEW 4: SKILL GRAPH & MARKET DEMAND */}
        {activeView === 'skillgraph' && (
          <SkillGraphView onNavigateToVerify={handleOpenVerification} />
        )}
      </main>

      {/* Global AI Resume Parser Modal */}
      <ResumeParserModal
        isOpen={isResumeParserOpen}
        onClose={() => setIsResumeParserOpen(false)}
        onSyncProfile={handleResumeSync}
      />

      {/* Global Skill Verification Modal */}
      <SkillVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        defaultSkill={verificationDefaultSkill}
        onSkillVerified={handleSkillVerified}
      />

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: '60px',
              right: '16px',
              width: '380px',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '16px',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem' }}>Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    background: n.read ? 'var(--surface-tint)' : '#EAF5ED',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px'
                  }}
                >
                  <div style={{ fontWeight: 650, fontSize: '0.85rem', marginBottom: '4px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
                    {n.desc}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
