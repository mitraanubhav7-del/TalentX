import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  TrendingUp, 
  FileText, 
  Download,
  School,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { UNIVERSITY_CURRICULUM_DATA } from '../data/mockData';

export function UniversityPortal() {
  const [curriculumData, setCurriculumData] = useState(UNIVERSITY_CURRICULUM_DATA);
  const [selectedDepartment, setSelectedDepartment] = useState('Computer Science & Engineering');
  const [reportExported, setReportExported] = useState(false);

  const alignedCount = curriculumData.filter(c => c.status === 'Aligned').length;
  const criticalGapCount = curriculumData.filter(c => c.status.includes('Gap') || c.status.includes('Missing')).length;
  const alignmentScore = Math.round((alignedCount / curriculumData.length) * 100);

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.35)',
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
            <GraduationCap size={22} color="#06B6D4" />
            <span className="badge-pill badge-cyan">Slide 20 — University Intelligence</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Connect Education With Industry: Curriculum Gap Telemetry
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '700px' }}>
            Compare academic curriculum coverage against real-time industry employer demands. Empower Deans and Academic Councils to upgrade syllabi with high-employability micro-modules.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          <Download size={15} />
          {reportExported ? 'Curriculum PDF Generated ✓' : 'Export AI Curriculum Report'}
        </button>
      </div>

      {/* INSTITUTION STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CURRICULUM ALIGNMENT</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FBBF24' }}>{alignmentScore}% Aligned</div>
          <div style={{ fontSize: '0.75rem', color: '#FBBF24', marginTop: '4px' }}>3 Core subjects meet 2026 standards</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CRITICAL CURRICULUM GAPS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FB7185' }}>{criticalGapCount} Subjects</div>
          <div style={{ fontSize: '0.75rem', color: '#FB7185', marginTop: '4px' }}>Cloud Architecture, MLOps, GenAI</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GRADUATE EMPLOYABILITY INDEX</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>62 / 100</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Projected to reach 89 with recommended labs</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TALENTX VERIFIED STUDENTS</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>412 Students</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>Active in hackathons & internships</div>
        </div>
      </div>

      {/* CURRICULUM VS INDUSTRY MATRIX (Slide 20 Architecture) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
              University Curriculum vs Industry Skill Demand Matrix
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Benchmarking 4-Year B.Tech Computer Science Syllabus against Top 500 Tech Employers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge-pill badge-verified">Aligned: {alignedCount}</span>
            <span className="badge-pill badge-danger">Gaps: {criticalGapCount}</span>
          </div>
        </div>

        {/* Matrix Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {curriculumData.map((row, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--surface-tint)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                display: 'grid',
                gridTemplateColumns: '240px 1fr 1fr 160px',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{row.subject}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Department of CS & IT</div>
              </div>

              {/* Coverage Comparison */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Curriculum Coverage:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.curriculumCoverage}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--track)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.curriculumCoverage}%`, height: '100%', background: '#6366F1' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Industry Demand:</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{row.industryDemand}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--track)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.industryDemand}%`, height: '100%', background: '#38BDF8' }} />
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <span className={`badge-pill badge-${row.status === 'Aligned' ? 'verified' : row.status === 'Critical Gap' ? 'warning' : 'danger'}`}>
                  {row.status === 'Aligned' ? '✓ Aligned' : row.status === 'Critical Gap' ? '⚠ Critical Gap' : '❌ Outdated'}
                </span>
              </div>

              {/* Recommendation row full width */}
              <div style={{
                gridColumn: '1 / -1',
                background: 'var(--surface-tint)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                borderLeft: row.status === 'Aligned' ? '3px solid #10B981' : '3px solid #F59E0B'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Recommended Action: </strong>
                {row.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
