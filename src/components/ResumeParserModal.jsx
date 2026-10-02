import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award,
  Loader2
} from 'lucide-react';

export function ResumeParserModal({ isOpen, onClose, onSyncProfile }) {
  const [parsingStep, setParsingStep] = useState('upload'); // 'upload' | 'scanning' | 'review'
  const [fileName, setFileName] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isOpen) return null;

  const simulateAiParsing = (preset) => {
    setFileName(preset === 'priya' ? 'Priya_Sharma_Resume_2026.pdf' : 'Devendra_Verma_AI_Resume.pdf');
    setParsingStep('scanning');

    setTimeout(() => {
      if (preset === 'priya') {
        setExtractedData({
          name: "Priya Sharma",
          email: "priya.sharma@nitk.edu.in",
          phone: "+91 98765 43210",
          education: [
            {
              degree: "B.Tech in Computer Science and Engineering",
              institution: "National Institute of Technology Karnataka (NITK)",
              period: "2022 - 2026",
              cgpa: "8.9 / 10.0"
            }
          ],
          skills: [
            { name: "Python", category: "Core Languages", level: "Advanced" },
            { name: "SQL", category: "Databases", level: "Intermediate" },
            { name: "Statistics", category: "Mathematics", level: "Intermediate" },
            { name: "Pandas & NumPy", category: "Data Science", level: "Advanced" },
            { name: "Machine Learning", category: "AI", level: "Beginner" },
            { name: "FastAPI", category: "Frameworks", level: "Intermediate" },
            { name: "Git & GitHub", category: "Tools", level: "Intermediate" },
            { name: "AWS S3 & Cloud", category: "Cloud", level: "Beginner" }
          ],
          experience: [
            {
              role: "Data Science Intern",
              company: "BharatAnalytics Labs",
              period: "May 2025 - Jul 2025",
              summary: "Built automated data pipelines processing 2M+ records. Trained churn prediction models with 84% accuracy."
            }
          ],
          projects: [
            {
              title: "AgriVision AI - Vernacular Crop Health Diagnostics",
              techStack: ["Python", "PyTorch", "FastAPI", "React Native"],
              summary: "Built edge AI diagnostic mobile app for smallholder farmers with Hindi voice assistant."
            },
            {
              title: "FinPulse - Real-time UPI Fraud Pattern Detection",
              techStack: ["Python", "SQL", "Kafka", "Pandas"],
              summary: "Stream analytics engine flagging anomalous multi-hop UPI micro-transactions."
            }
          ],
          certifications: [
            "DeepLearning.AI: Data Science & ML Specialization",
            "AWS Certified Cloud Practitioner"
          ]
        });
      } else {
        setExtractedData({
          name: "Devendra Verma",
          email: "devendra@iitr.ac.in",
          phone: "+91 91234 56789",
          education: [
            {
              degree: "B.Tech & M.Tech Dual Degree in Computer Science",
              institution: "Indian Institute of Technology Roorkee (IITR)",
              period: "2020 - 2025",
              cgpa: "9.2 / 10.0"
            }
          ],
          skills: [
            { name: "Python", category: "Core Languages", level: "Advanced" },
            { name: "PyTorch & Transformers", category: "AI", level: "Advanced" },
            { name: "Machine Learning", category: "AI", level: "Advanced" },
            { name: "Docker & Kubernetes", category: "DevOps", level: "Intermediate" },
            { name: "C++", category: "Core Languages", level: "Intermediate" },
            { name: "Vector Databases", category: "AI Infrastructure", level: "Intermediate" }
          ],
          experience: [
            {
              role: "AI Research Fellow",
              company: "IITR AI Center of Excellence",
              period: "Aug 2024 - Present",
              summary: "Implemented distributed training algorithms on GPU clusters for large vision-language models."
            }
          ],
          projects: [
            {
              title: "TritonTensor - High-Throughput Inference Engine",
              techStack: ["C++", "CUDA", "PyTorch", "Python"],
              summary: "Custom GPU kernels achieving 2.1x lower inference latency on quantized LLMs."
            }
          ],
          certifications: [
            "NVIDIA Deep Learning Institute: Fundamentals of Accelerated Computing",
            "Google Cloud Professional Data Engineer"
          ]
        });
      }
      setParsingStep('review');
    }, 1800);
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setExtractedData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkillInput.trim(), category: "Custom", level: "Intermediate" }]
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillIndex) => {
    setExtractedData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== skillIndex)
    }));
  };

  const handleConfirmSync = () => {
    onSyncProfile(extractedData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        padding: '28px',
        background: 'var(--bg-glass-heavy)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
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

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#fff' }}>
              AI Resume Parser <span className="badge-pill badge-indigo">Slide 6</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Upload any PDF/DOCX resume — our NLP model automatically classifies Skills, Experience, Projects, and Education.
            </p>
          </div>
        </div>

        {/* STEP 1: UPLOAD STATE */}
        {parsingStep === 'upload' && (
          <div>
            <div 
              onClick={() => simulateAiParsing('priya')}
              style={{
                border: '2px dashed rgba(99, 102, 241, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 24px',
                textAlign: 'center',
                background: 'rgba(99, 102, 241, 0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '20px'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <UploadCloud size={30} color="#818CF8" />
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>
                Drop your resume here or click to browse
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Supports PDF, DOCX, TXT (Maximum file size: 15MB)
              </p>
              <button className="btn-primary" style={{ pointerEvents: 'none' }}>
                <FileText size={16} /> Select Resume File
              </button>
            </div>

            {/* Quick Demo Pre-sets */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Try 1-Click Sample Resumes (Build for Bharat Candidates):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => simulateAiParsing('priya')}
                  className="glass-panel"
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    background: 'rgba(15, 23, 42, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8',
                    fontWeight: 700
                  }}>
                    PS
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>Priya Sharma</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NITK • Final Year • AI/Data Aspirant</div>
                  </div>
                </button>

                <button
                  onClick={() => simulateAiParsing('devendra')}
                  className="glass-panel"
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    background: 'rgba(15, 23, 42, 0.6)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#06B6D4',
                    fontWeight: 700
                  }}>
                    DV
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>Devendra Verma</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IIT Roorkee • ML Systems Engineer</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {parsingStep === 'scanning' && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 2s linear infinite'
            }}>
              <Loader2 size={38} color="#38BDF8" className="animate-spin" />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
              Parsing <span style={{ color: '#38BDF8' }}>{fileName}</span>...
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
              Extracting entities via TalentX NLP Parser: Normalizing skills, indexing project repositories, and validating chronological milestones.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge-pill badge-indigo">Extracting Skills</span>
              <span className="badge-pill badge-cyan">Classifying Tech Stacks</span>
              <span className="badge-pill badge-verified">Validating Education</span>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {parsingStep === 'review' && extractedData && (
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#34D399" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34D399' }}>
                  Successfully extracted from {fileName}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Please review before synchronizing to your living profile
              </span>
            </div>

            {/* Extracted Skills Section */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code size={16} color="#818CF8" /> Extracted Skills ({extractedData.skills.length})
                </h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Add missing skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-medium)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      width: '180px'
                    }}
                  />
                  <button onClick={handleAddSkill} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                {extractedData.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: 'var(--radius-full)',
                      padding: '5px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ fontSize: '0.7rem', color: '#A5B4FC' }}>({skill.level})</span>
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      style={{ background: 'none', border: 'none', color: '#FB7185', display: 'flex', alignItems: 'center' }}
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Projects */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Code size={16} color="#06B6D4" /> Extracted Projects ({extractedData.projects.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {extractedData.projects.map((proj, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{proj.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{proj.summary}</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {proj.techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="badge-pill badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Experience & Education Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Briefcase size={14} color="#818CF8" /> EXPERIENCE
                </div>
                {extractedData.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{exp.role}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{exp.company} • {exp.period}</div>
                  </div>
                ))}
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GraduationCap size={14} color="#06B6D4" /> EDUCATION
                </div>
                {extractedData.education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>{edu.degree}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{edu.institution} ({edu.cgpa})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setParsingStep('upload')} className="btn-secondary">
                Upload Different File
              </button>
              <button onClick={handleConfirmSync} className="btn-primary" style={{ padding: '10px 24px' }}>
                <CheckCircle2 size={16} /> Confirm & Sync to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
