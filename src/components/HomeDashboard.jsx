import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import './HomeDashboard.css';

export function HomeDashboard({ user, onNavigateToProfile, onNavigateToCareerAI, openVerificationModal }) {
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const verifiedCount = skills.filter(skill => skill.verified).length;
  const unverifiedSkills = skills.filter(skill => !skill.verified);
  const careerReadiness = Number.isFinite(user.careerReadiness)
    ? Math.min(100, Math.max(0, user.careerReadiness))
    : 0;

  return (
    <div className="home-dashboard">
      <section className="home-welcome">
        <div>
          <span className="home-eyebrow"><Sparkles size={15} /> YOUR TALENTX HOME</span>
          <h1>Welcome back, {user.name?.split(' ')[0] || 'there'}!</h1>
          <p>Keep building momentum toward your next opportunity.</p>
        </div>
        <button className="btn-secondary" onClick={onNavigateToProfile}>
          View profile <ArrowRight size={16} />
        </button>
      </section>

      <section className="home-overview-grid" aria-label="Career progress and skill status">
        <article className="glass-panel home-progress-card">
          <div className="home-card-heading">
            <span className="home-icon-well"><Target size={19} /></span>
            <span className="home-card-label">CAREER READINESS</span>
          </div>
          <div className="home-progress-value">{careerReadiness}%</div>
          <p className="home-card-copy">
            Your profile is progressing toward {user.targetRole || 'your next role'}.
          </p>
          <div
            className="home-progress-track"
            role="progressbar"
            aria-label="Career readiness"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={careerReadiness}
          >
            <div className="home-progress-fill" style={{ width: `${careerReadiness}%` }} />
          </div>
          <div className="home-progress-caption">
            <span>Career readiness</span>
            <span>{careerReadiness}%</span>
          </div>
          <button className="home-text-action" onClick={onNavigateToCareerAI}>
            Explore career insights <ArrowRight size={15} />
          </button>
        </article>

        <article className="glass-panel home-skills-card">
          <div className="home-skills-heading">
            <div>
              <div className="home-card-heading">
                <span className="home-icon-well"><ShieldCheck size={19} /></span>
                <span className="home-card-label">SKILL STATUS</span>
              </div>
              <p className="home-card-copy">
                {verifiedCount} of {skills.length} skills verified
              </p>
            </div>
            <button className="home-text-action" onClick={onNavigateToProfile}>
              View all <ArrowRight size={15} />
            </button>
          </div>

          {skills.length > 0 ? (
            <ul className="home-skill-list">
              {skills.slice(0, 5).map((skill, index) => {
                const score = Number.isFinite(skill.score)
                  ? Math.min(100, Math.max(0, skill.score))
                  : 0;

                return (
                  <li className="home-skill-row" key={`${skill.name}-${index}`}>
                    <span className={`home-skill-status${skill.verified ? ' is-verified' : ''}`}>
                      {skill.verified ? <CheckCircle2 size={17} /> : <Circle size={17} />}
                    </span>
                    <div className="home-skill-info">
                      <span className="home-skill-name">{skill.name}</span>
                      <span className={`home-skill-badge${skill.verified ? ' is-verified' : ''}`}>
                        {skill.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <span className="home-skill-score">{score}%</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="home-empty-skills">Add skills to your profile to track verification status.</p>
          )}

          {unverifiedSkills.length > 0 && (
            <button
              className="home-verify-action"
              onClick={() => openVerificationModal(unverifiedSkills[0].name)}
            >
              <ShieldCheck size={15} />
              Verify {unverifiedSkills[0].name}
              <ArrowRight size={15} />
            </button>
          )}
        </article>
      </section>
    </div>
  );
}
