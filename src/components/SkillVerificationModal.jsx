import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Award, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VERIFICATION_TESTS } from '../data/mockData';

export function SkillVerificationModal({ isOpen, onClose, defaultSkill = "Machine Learning", onSkillVerified }) {
  const [selectedSkill, setSelectedSkill] = useState(defaultSkill);
  const [testState, setTestState] = useState('intro'); // 'intro' | 'testing' | 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [scoreResult, setScoreResult] = useState(null);

  useEffect(() => {
    if (defaultSkill && VERIFICATION_TESTS[defaultSkill]) {
      setSelectedSkill(defaultSkill);
    }
  }, [defaultSkill]);

  useEffect(() => {
    let timer;
    if (testState === 'testing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (testState === 'testing' && timeLeft === 0) {
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  if (!isOpen) return null;

  const activeTest = VERIFICATION_TESTS[selectedSkill] || VERIFICATION_TESTS["Python"];

  const handleStartTest = (skillName) => {
    setSelectedSkill(skillName);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(activeTest.durationMinutes * 60);
    setTestState('testing');
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleFinishTest = () => {
    let correctCount = 0;
    activeTest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / activeTest.questions.length) * 100);
    const passed = calculatedScore >= activeTest.passingScore;
    
    let level = "Beginner";
    if (calculatedScore >= 85) level = "Advanced";
    else if (calculatedScore >= 70) level = "Intermediate";

    const certId = `TX-VER-${selectedSkill.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const result = {
      skill: selectedSkill,
      score: calculatedScore,
      correctCount,
      totalQuestions: activeTest.questions.length,
      passed,
      level,
      certId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setScoreResult(result);
    setTestState('result');

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fallback if confetti canvas fails
      }
      onSkillVerified(result);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '740px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '28px',
        background: 'var(--bg-glass-heavy)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-emerald-glow)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--track)',
            border: 'none',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* INTRO SCREEN */}
        {testState === 'intro' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--grad-verified)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={26} color="#042f1a" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                  Skill Verification Engine <span className="badge-pill badge-verified">Slide 8</span>
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  "Don't Just Claim a Skill. Prove It." — Earn an evidence-backed verified badge on TalentX.
                </p>
              </div>
            </div>

            {/* Select Skill to Verify */}
            <div style={{
              background: 'var(--surface-tint)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
                Select Skill to Verify:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {Object.keys(VERIFICATION_TESTS).map(skillName => (
                  <button
                    key={skillName}
                    onClick={() => setSelectedSkill(skillName)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: selectedSkill === skillName ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedSkill === skillName ? '1px solid #10B981' : '1px solid var(--border-subtle)',
                      color: selectedSkill === skillName ? '#34D399' : 'var(--text-primary)',
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: '0.9rem'
                    }}
                  >
                    {skillName}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Details Card */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
                {selectedSkill} Verification Standard
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                <div style={{ background: 'var(--surface-tint)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Questions</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{activeTest.questions.length} Scenario MCQs</div>
                </div>
                <div style={{ background: 'var(--surface-tint)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{activeTest.durationMinutes} Minutes</div>
                </div>
                <div style={{ background: 'var(--surface-tint)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passing Score</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{activeTest.passingScore}% (Score ≥ 70)</div>
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} color="#F59E0B" />
                Once started, the timer will begin. High-scoring results immediately update your TalentX Verified Badge.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleStartTest(selectedSkill)} className="btn-verified" style={{ padding: '10px 24px' }}>
                <Sparkles size={16} /> Start {selectedSkill} Assessment
              </button>
            </div>
          </div>
        )}

        {/* TESTING SCREEN */}
        {testState === 'testing' && (
          <div>
            {/* Test Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <span className="badge-pill badge-verified" style={{ marginBottom: '4px' }}>
                  {selectedSkill} Verification in Progress
                </span>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                </h3>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: timeLeft < 60 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                border: timeLeft < 60 ? '1px solid #F43F5E' : '1px solid rgba(99, 102, 241, 0.4)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                color: timeLeft < 60 ? '#FB7185' : '#818CF8',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}>
                <Clock size={16} />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Question Card */}
            {(() => {
              const q = activeTest.questions[currentQuestionIndex];
              return (
                <div>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                    background: 'var(--surface-tint)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {q.question}
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          style={{
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-md)',
                            background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #6366F1' : '2px solid var(--text-muted)',
                            background: isSelected ? '#6366F1' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            flexShrink: 0
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="btn-secondary"
                      style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
                    >
                      Previous
                    </button>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {activeTest.questions.map((_, dotIdx) => (
                        <div
                          key={dotIdx}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: dotIdx === currentQuestionIndex 
                              ? '#6366F1' 
                              : selectedAnswers[activeTest.questions[dotIdx].id] !== undefined 
                                ? '#10B981' 
                                : 'rgba(255, 255, 255, 0.15)'
                          }}
                        />
                      ))}
                    </div>

                    {currentQuestionIndex < activeTest.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="btn-primary"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishTest}
                        className="btn-verified"
                        style={{ padding: '10px 20px' }}
                      >
                        <CheckCircle2 size={16} /> Submit Assessment
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* RESULT SCREEN */}
        {testState === 'result' && scoreResult && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            {scoreResult.passed ? (
              <div>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'var(--grad-verified)',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-emerald-glow)'
                }}>
                  <Award size={42} color="#042f1a" />
                </div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Skill Verified: {scoreResult.skill}
                </h2>
                <div className="badge-pill badge-verified" style={{ fontSize: '0.85rem', padding: '4px 14px', marginBottom: '16px' }}>
                  Level: {scoreResult.level} • Score: {scoreResult.score}/100
                </div>

                {/* Cryptographic Badge Card */}
                <div style={{
                  maxWidth: '460px',
                  margin: '0 auto 24px',
                  background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  textAlign: 'left',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={20} color="#10B981" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                        TalentX Verified Credential
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{scoreResult.date}</span>
                  </div>

                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {scoreResult.skill} — {scoreResult.level}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Verified via TalentX Adaptive Scenario Assessment. Scored {scoreResult.score}/100 ({scoreResult.correctCount}/{scoreResult.totalQuestions} items correct).
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.75rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      ID: {scoreResult.certId}
                    </span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Tamper-Proof Ledger ✓</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button onClick={onClose} className="btn-primary" style={{ padding: '10px 28px' }}>
                    Done & Return to Profile
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid #F43F5E',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertCircle size={40} color="#FB7185" />
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Verification Unsuccessful
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
                  You scored {scoreResult.score}/100. The verification cutoff for {scoreResult.skill} is {activeTest.passingScore}%.
                </p>
                <div style={{
                  background: 'var(--surface-tint)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  maxWidth: '460px',
                  margin: '0 auto 24px',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Recommended Next Steps:
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6 }}>
                    <li>Review core conceptual fundamentals and memory benchmarks.</li>
                    <li>Practice real-world scenario implementations on the Projects Hub.</li>
                    <li>Retake the verification assessment anytime after 24 hours.</li>
                  </ul>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button onClick={onClose} className="btn-secondary">Close</button>
                  <button onClick={() => setTestState('intro')} className="btn-primary">
                    <RotateCcw size={15} /> Try Another Skill
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
