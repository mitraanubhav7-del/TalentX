import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileView } from './components/ProfileView';
import { SkillVerificationModal } from './components/SkillVerificationModal';
import { ResumeParserModal } from './components/ResumeParserModal';
import { CareerIntelligence } from './components/CareerIntelligence';
import { NetworkingFeed } from './components/NetworkingFeed';
import { ProjectHub } from './components/ProjectHub';
import { OpportunitiesView } from './components/OpportunitiesView';
import { EmployerPortal } from './components/EmployerPortal';
import { UniversityPortal } from './components/UniversityPortal';
import { SkillGraphView } from './components/SkillGraphView';
import { PitchDeckViewer } from './components/PitchDeckViewer';
import { INITIAL_USER } from './data/mockData';
import { 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Presentation 
} from 'lucide-react';

export function App() {
  const [user, setUser] = useState(INITIAL_USER);
  const [activeView, setActiveView] = useState('talent'); // 'talent' | 'employer' | 'university' | 'skillgraph' | 'presentation'
  const [talentTab, setTalentTab] = useState('profile');

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

  // Navigation dispatcher for Slide Deck live feature buttons
  const handleFeatureNavigate = (action) => {
    if (action === 'openResumeParser') {
      setActiveView('talent');
      setTalentTab('profile');
      setIsResumeParserOpen(true);
    } else if (action === 'openSkillVerification') {
      setActiveView('talent');
      setTalentTab('verification');
      handleOpenVerification("Machine Learning");
    } else if (action === 'openCareerIntelligence') {
      setActiveView('talent');
      setTalentTab('career_ai');
    } else if (action === 'openSkillGap') {
      setActiveView('talent');
      setTalentTab('career_ai');
    } else if (action === 'openRoadmap') {
      setActiveView('talent');
      setTalentTab('roadmap');
    } else if (action === 'openSimulator') {
      setActiveView('talent');
      setTalentTab('simulator');
    } else if (action === 'openNetwork') {
      setActiveView('talent');
      setTalentTab('networking');
    } else if (action === 'openProjects') {
      setActiveView('talent');
      setTalentTab('projects');
    } else if (action === 'openOpportunities') {
      setActiveView('talent');
      setTalentTab('opportunities');
    } else if (action === 'openEmployer') {
      setActiveView('employer');
    } else if (action === 'openWorkforce') {
      setActiveView('employer');
    } else if (action === 'openUniversity') {
      setActiveView('university');
    } else if (action === 'openSkillGraph') {
      setActiveView('skillgraph');
    } else if (action === 'openMarketAnalytics') {
      setActiveView('skillgraph');
    } else {
      setActiveView('talent');
      setTalentTab('profile');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Main Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        talentTab={talentTab}
        setTalentTab={setTalentTab}
        user={user}
        unreadNotifications={unreadCount}
        setShowNotifications={setShowNotifications}
        openResumeParser={() => setIsResumeParserOpen(true)}
        openVerificationModal={() => handleOpenVerification("Machine Learning")}
      />

      {/* Main Page Layout Container */}
      <main style={{
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        padding: '24px 24px 60px',
        flex: 1
      }}>
        {/* VIEW 1: TALENT PORTAL */}
        {activeView === 'talent' && (
          <div>
            {talentTab === 'profile' && (
              <ProfileView
                user={user}
                openResumeParser={() => setIsResumeParserOpen(true)}
                openVerificationModal={handleOpenVerification}
                onNavigateToTab={setTalentTab}
              />
            )}

            {talentTab === 'verification' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                  <ShieldCheck size={48} color="#10B981" style={{ margin: '0 auto 12px' }} />
                  <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '6px' }}>
                    Skill Verification Testing Center (Slide 8)
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 20px' }}>
                    "Don't Just Claim a Skill. Prove It." — Select an unverified skill below to take the timed scenario challenge and unlock your verified badge.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {['Machine Learning', 'Python', 'SQL'].map(sk => (
                      <button
                        key={sk}
                        onClick={() => handleOpenVerification(sk)}
                        className="btn-verified"
                        style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                      >
                        Launch {sk} Verification Test
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show profile skills table */}
                <ProfileView
                  user={user}
                  openResumeParser={() => setIsResumeParserOpen(true)}
                  openVerificationModal={handleOpenVerification}
                  onNavigateToTab={setTalentTab}
                />
              </div>
            )}

            {(talentTab === 'career_ai' || talentTab === 'roadmap' || talentTab === 'simulator') && (
              <CareerIntelligence
                user={user}
                openVerificationModal={handleOpenVerification}
                navigateToProjects={() => setTalentTab('projects')}
                navigateToOpportunities={() => setTalentTab('opportunities')}
              />
            )}

            {talentTab === 'networking' && (
              <NetworkingFeed user={user} />
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
          <EmployerPortal />
        )}

        {/* VIEW 3: UNIVERSITY INTELLIGENCE */}
        {activeView === 'university' && (
          <UniversityPortal />
        )}

        {/* VIEW 4: SKILL GRAPH & MARKET DEMAND */}
        {activeView === 'skillgraph' && (
          <SkillGraphView onNavigateToVerify={handleOpenVerification} />
        )}

        {/* VIEW 5: INTERACTIVE 30-SLIDE PITCH DECK */}
        {activeView === 'presentation' && (
          <PitchDeckViewer onNavigateToFeature={handleFeatureNavigate} />
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
              top: '70px',
              right: '24px',
              width: '380px',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '20px',
              background: 'var(--bg-glass-heavy)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} color="#818CF8" />
                <h3 style={{ fontSize: '1rem', color: '#fff' }}>Notifications</h3>
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
                    background: n.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', marginBottom: '4px' }}>
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

      {/* Modern Footer with Bharat 2.0 attribution */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 18, 0.95)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <strong style={{ color: '#fff' }}>TalentX</strong>
          <span>•</span>
          <span>AI-Powered Talent Intelligence & Professional Network</span>
          <span>•</span>
          <span style={{ color: '#38BDF8' }}>Build for Bharat 2.0</span>
          <span>•</span>
          <button 
            onClick={() => setActiveView('presentation')}
            style={{ background: 'none', border: 'none', color: '#818CF8', fontWeight: 600, textDecoration: 'underline' }}
          >
            30-Slide Pitch Deck Presentation
          </button>
        </div>
        <div>
          Tagline: <span style={{ color: '#34D399' }}>Learn → Build → Verify → Connect → Discover → Get Hired → Grow</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
