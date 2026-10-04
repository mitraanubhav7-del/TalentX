import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Users, 
  TrendingUp, 
  FileText, 
  Award, 
  Filter, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import { CANDIDATES_POOL } from '../data/mockData';

export function EmployerPortal() {
  const [activeSubTab, setActiveSubTab] = useState('candidates'); // 'candidates' | 'post_job' | 'criteria' | 'pipeline'
  const [candidates, setCandidates] = useState(CANDIDATES_POOL);

  // Configurable Criteria (Slide 17)
  const [criteria, setCriteria] = useState({
    minPython: 75,
    minSql: 70,
    minAptitude: 60,
    minCoding: 70,
    minGradYear: 2025
  });

  // Create Job Post state (Slide 16)
  const [jobTitle, setJobTitle] = useState('Data Scientist - AI Platform');
  const [jobDesc, setJobDesc] = useState('Looking for a Data Scientist to build scalable predictive algorithms and machine learning pipelines for our high-throughput payment platform.');
  const [extractedJobSkills, setExtractedJobSkills] = useState(['Python', 'SQL', 'Machine Learning', 'Pandas', 'Statistics']);
  const [jobPublished, setJobPublished] = useState(false);

  // Advance candidate stage
  const advanceCandidate = (id, nextStage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: nextStage } : c));
  };

  const stages = ["Applied", "Assessed", "Shortlisted", "Interview Scheduled", "Offer Extended"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 128, 74, 0.2) 0%, rgba(34, 160, 107, 0.15) 100%)',
        border: '1px solid rgba(34, 128, 74, 0.4)',
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
            <Briefcase size={22} color="#35A36A" />
            <span className="badge-pill badge-indigo">Intelligent Recruitment Portal</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Enterprise Talent Portal: Skill-Based Hiring
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
            From resume keyword screening to objective, explainable capability evaluation. Configure custom company assessment cutoffs and review transparent candidate scorecards.
          </p>
        </div>

        {/* Sub-nav switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-tint)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          gap: '4px'
        }}>
          {[
            { id: 'candidates', label: 'Candidate Matcher' },
            { id: 'criteria', label: 'Assessment Criteria' },
            { id: 'post_job', label: 'Create Job Post' },
            { id: 'pipeline', label: 'Hiring Pipeline' }
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isActive ? 'var(--grad-primary)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RECRUITER STATS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OPEN REQUISITIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>4 Positions</div>
          <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>Active TalentX Matching</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VERIFIED CANDIDATES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>248 Evaluated</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across Tier 1/2 Institutes</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCREENING TIME SAVED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>68% Faster</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>Zero resume fraud detected</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACTIVE SHORTLIST</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24' }}>{candidates.filter(c => c.status !== 'Applied').length} Candidates</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Meeting configured bar</div>
        </div>
      </div>

      {/* VIEW 1: EXPLAINABLE CANDIDATE MATCHING (Slide 18) */}
      {activeSubTab === 'candidates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            background: 'rgba(34, 128, 74, 0.08)',
            border: '1px solid rgba(34, 128, 74, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#35B879" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                Explainable Candidate Matching — Not Just "87% Match"
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Filtering by: Python ≥ {criteria.minPython}%, SQL ≥ {criteria.minSql}%, Coding ≥ {criteria.minCoding}%
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {candidates.map(candidate => {
              const meetsBar = candidate.assessmentScores.python >= criteria.minPython &&
                               candidate.assessmentScores.sql >= criteria.minSql &&
                               candidate.assessmentScores.coding >= criteria.minCoding;

              return (
                <div
                  key={candidate.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderLeft: meetsBar ? '5px solid #10B981' : '5px solid #F59E0B',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  {/* Top Candidate Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        style={{ width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{candidate.name}</h3>
                          <span className="badge-pill badge-verified" style={{ fontSize: '0.7rem' }}>
                            {candidate.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {candidate.university} • Class of {candidate.gradYear}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OVERALL FIT</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: candidate.overallMatch > 80 ? '#34D399' : '#FBBF24' }}>
                        {candidate.overallMatch}%
                      </div>
                    </div>
                  </div>

                  {/* Assessment Scorecard (Slide 18) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '10px',
                    background: 'var(--surface-tint)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Python Verified</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: candidate.assessmentScores.python >= criteria.minPython ? '#34D399' : '#FB7185' }}>
                        {candidate.assessmentScores.python}% {candidate.assessmentScores.python >= criteria.minPython ? '✓' : '✗'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SQL Score</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: candidate.assessmentScores.sql >= criteria.minSql ? '#34D399' : '#FB7185' }}>
                        {candidate.assessmentScores.sql}% {candidate.assessmentScores.sql >= criteria.minSql ? '✓' : '✗'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aptitude Test</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: candidate.assessmentScores.aptitude >= criteria.minAptitude ? '#34D399' : '#FB7185' }}>
                        {candidate.assessmentScores.aptitude}% {candidate.assessmentScores.aptitude >= criteria.minAptitude ? '✓' : '✗'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Coding Challenge</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: candidate.assessmentScores.coding >= criteria.minCoding ? '#34D399' : '#FB7185' }}>
                        {candidate.assessmentScores.coding}% {candidate.assessmentScores.coding >= criteria.minCoding ? '✓' : '✗'}
                      </div>
                    </div>
                  </div>

                  {/* Matched Skills vs Gaps Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', marginBottom: '6px' }}>
                        MATCHED SKILLS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {candidate.matchedSkills.map((sk, sIdx) => (
                          <span key={sIdx} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#047857', fontWeight: 600 }}>
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', marginBottom: '6px' }}>
                        SKILL GAPS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {candidate.skillGaps.map((gap, gIdx) => (
                          <span key={gIdx} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: '#FFFBEB', color: '#B45309', fontWeight: 600 }}>
                            ⚠ {gap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Explainable AI Hiring Recommendation Summary (Slide 18) */}
                  <div style={{
                    background: 'rgba(21, 128, 61, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    borderLeft: '3px solid var(--primary)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
                      TRANSPARENT MATCHING REASONING:
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '6px', fontWeight: 500 }}>
                      {candidate.explainabilitySummary}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Recommendation: {candidate.hiringRecommendation}
                    </div>
                  </div>

                  {/* Recruiter Action Pipeline */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Current Stage: <strong style={{ color: 'var(--text-primary)' }}>{candidate.status}</strong>
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {candidate.status === 'Applied' && (
                        <button onClick={() => advanceCandidate(candidate.id, 'Assessed')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          Send Assessment Test
                        </button>
                      )}
                      {candidate.status === 'Assessed' && (
                        <button onClick={() => advanceCandidate(candidate.id, 'Shortlisted')} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          Shortlist Candidate
                        </button>
                      )}
                      {candidate.status === 'Shortlisted' && (
                        <button onClick={() => advanceCandidate(candidate.id, 'Interview Scheduled')} className="btn-verified" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          Schedule Interview
                        </button>
                      )}
                      {candidate.status === 'Interview Scheduled' && (
                        <button onClick={() => advanceCandidate(candidate.id, 'Offer Extended')} className="btn-verified" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>
                          Extend Offer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: COMPANY-SPECIFIC ASSESSMENT CONFIG (Slide 17) */}
      {activeSubTab === 'criteria' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sliders size={20} color="#35A36A" />
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
              Company-Specific Assessment Standards
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '650px' }}>
            Configure your organization's exact capability thresholds. TalentX evaluates candidates against these cutoffs and automatically flags those meeting your criteria.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {/* Criteria 1: Python Minimum */}
            <div style={{ background: 'var(--surface-tint)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Python Proficiency Cutoff</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>≥ {criteria.minPython}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={criteria.minPython}
                onChange={(e) => setCriteria({ ...criteria, minPython: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#21804A' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Requires Intermediate or Advanced verified test badge.
              </div>
            </div>

            {/* Criteria 2: SQL Minimum */}
            <div style={{ background: 'var(--surface-tint)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>SQL Benchmark Cutoff</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>≥ {criteria.minSql}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={criteria.minSql}
                onChange={(e) => setCriteria({ ...criteria, minSql: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#22A06B' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Tests relational queries, window functions, and indexing.
              </div>
            </div>

            {/* Criteria 3: Aptitude Minimum */}
            <div style={{ background: 'var(--surface-tint)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Aptitude & Problem Solving</span>
                <span style={{ fontWeight: 800, color: '#FBBF24' }}>≥ {criteria.minAptitude}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={criteria.minAptitude}
                onChange={(e) => setCriteria({ ...criteria, minAptitude: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#F59E0B' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Quantitative reasoning and algorithmic logic.
              </div>
            </div>

            {/* Criteria 4: Coding Test */}
            <div style={{ background: 'var(--surface-tint)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Coding Challenge Score</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>≥ {criteria.minCoding}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={criteria.minCoding}
                onChange={(e) => setCriteria({ ...criteria, minCoding: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#10B981' }}
              />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Hands-on scenario code debugging and algorithmic execution.
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#34D399" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                Current criteria matches <strong>{candidates.filter(c => c.assessmentScores.python >= criteria.minPython && c.assessmentScores.sql >= criteria.minSql && c.assessmentScores.coding >= criteria.minCoding).length} of {candidates.length}</strong> available candidates.
              </span>
            </div>

            <button
              onClick={() => setActiveSubTab('candidates')}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.82rem' }}
            >
              Apply Criteria to Pool
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: JOB POST CREATOR WITH AI EXTRACTION (Slide 16) */}
      {activeSubTab === 'post_job' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="#35A36A" />
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)' }}>
              Create Job with AI Skill Extraction
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Paste any job description — TalentX NLP parses competencies, maps them into our skill taxonomy, and instantly matches candidates.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Role Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--surface-tint)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Job Description
              </label>
              <textarea
                rows={4}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--surface-tint)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* AI Extracted Skills preview */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={14} /> AI-Extracted Core Competencies:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {extractedJobSkills.map((sk, idx) => (
                  <span key={idx} className="badge-pill badge-indigo" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => {
                setJobPublished(true);
                setTimeout(() => setJobPublished(false), 3000);
              }}
              className="btn-primary"
              style={{ padding: '10px 24px' }}
            >
              {jobPublished ? 'Published to TalentX Network ✓' : 'Publish Job & Match Candidates'}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: HIRING PIPELINE KANBAN */}
      {activeSubTab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', overflowX: 'auto' }}>
          {["Applied", "Assessed", "Shortlisted", "Interview Scheduled"].map(col => {
            const colCandidates = candidates.filter(c => c.status === col);
            return (
              <div
                key={col}
                className="glass-panel"
                style={{ padding: '16px', minWidth: '240px', background: 'rgba(15, 23, 42, 0.5)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{col}</span>
                  <span className="badge-pill badge-indigo" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                    {colCandidates.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {colCandidates.map(cand => (
                    <div
                      key={cand.id}
                      style={{
                        background: 'var(--surface-tint)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <img src={cand.avatar} alt={cand.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{cand.name}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cand.university}</div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>
                        Match: {cand.overallMatch}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
