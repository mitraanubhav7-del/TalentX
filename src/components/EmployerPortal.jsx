import React, { useMemo, useState } from 'react';
import {
  BriefcaseBusiness, Users, ClipboardList, Plus, Trash2, Camera, Mic,
  MonitorUp, CircleHelp, LayoutDashboard, Send, ContactRound,
} from 'lucide-react';
import { CANDIDATES_POOL } from '../data/mockData';
import { ConnectionsInbox } from './ConnectionsInbox';

const cardStyle = { padding: 22 };
const fieldStyle = {
  width: '100%', background: 'var(--surface-tint)', border: '1px solid var(--border-medium)',
  borderRadius: 'var(--radius-md)', padding: '11px 13px', color: 'var(--text-primary)', fontSize: '.92rem',
};

export function EmployerPortal({ currentUserId }) {
  const [section, setSection] = useState('overview');
  const [jobs, setJobs] = useState([]);
  const [exams, setExams] = useState([]);
  const [job, setJob] = useState({ title: '', location: '', type: 'Full-time', description: '' });
  const [exam, setExam] = useState({ title: '', role: '', duration: 45, camera: true, microphone: false, screen: true });
  const [questions, setQuestions] = useState([{ prompt: '', options: ['', '', '', ''], answer: 0, points: 1 }]);
  const [notice, setNotice] = useState('');
  const applicants = CANDIDATES_POOL.slice(0, 6);
  const sections = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Recruitments', icon: BriefcaseBusiness },
    { id: 'exams', label: 'Exams & questions', icon: ClipboardList },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'network', label: 'Connections & messages', icon: ContactRound },
  ];
  const examQuestionCount = useMemo(() => questions.filter(question => question.prompt.trim()).length, [questions]);

  const publishJob = event => {
    event.preventDefault();
    if (!job.title.trim() || !job.description.trim()) return;
    setJobs(current => [{ ...job, id: Date.now(), createdAt: new Date().toLocaleDateString() }, ...current]);
    setJob({ title: '', location: '', type: 'Full-time', description: '' });
    setNotice('Recruitment published.');
  };

  const publishExam = event => {
    event.preventDefault();
    if (!exam.title.trim() || !exam.role.trim() || !examQuestionCount) return;
    setExams(current => [{ ...exam, id: Date.now(), questions: questions.filter(item => item.prompt.trim()) }, ...current]);
    setExam({ title: '', role: '', duration: 45, camera: true, microphone: false, screen: true });
    setQuestions([{ prompt: '', options: ['', '', '', ''], answer: 0, points: 1 }]);
    setNotice('Exam created. Candidates will see the monitoring requirements and must grant browser permissions themselves.');
  };

  const updateQuestion = (index, change) => setQuestions(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...change } : item));
  const removeQuestion = index => setQuestions(current => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '230px minmax(0, 1fr)', gap: 22, alignItems: 'start' }}>
      <aside className="glass-panel" style={{ padding: 14, position: 'sticky', top: 90 }}>
        <div style={{ padding: '10px 12px 18px' }}>
          <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.05rem' }}>Recruiter workspace</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '.78rem', marginTop: 4 }}>Hiring, on your terms</div>
        </div>
        <nav aria-label="Recruiter workspace" style={{ display: 'grid', gap: 5 }}>
          {sections.map(item => {
            const Icon = item.icon;
            const selected = section === item.id;
            return <button key={item.id} onClick={() => { setSection(item.id); setNotice(''); }} aria-current={selected ? 'page' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', padding: '11px 12px', borderRadius: 10, color: selected ? 'var(--primary)' : 'var(--text-secondary)', background: selected ? 'rgba(34,128,74,.12)' : 'transparent', fontWeight: selected ? 700 : 500 }}>
              <Icon size={18} />{item.label}
            </button>;
          })}
        </nav>
        <div style={{ margin: '20px 8px 6px', padding: 12, borderRadius: 12, background: 'var(--surface-tint)', color: 'var(--text-secondary)', fontSize: '.76rem', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)' }}>People-first assessments</strong><br />Candidates review exam rules and grant device permissions before an attempt starts.
        </div>
      </aside>

      <section style={{ display: 'grid', gap: 18, minWidth: 0 }}>
        <header className="glass-panel" style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', background: 'linear-gradient(120deg, rgba(34,128,74,.14), rgba(34,160,107,.04))' }}>
          <div>
            <div style={{ color: 'var(--primary)', fontSize: '.76rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>TalentX for employers</div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.65rem', margin: '6px 0' }}>{section === 'overview' ? 'Your hiring dashboard' : sections.find(item => item.id === section)?.label}</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '.9rem' }}>Create roles, build your own selection exams, and review applicants.</p>
          </div>
          <button className="btn-primary" onClick={() => setSection('jobs')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}><Plus size={17} /> Post a role</button>
        </header>

        {notice && <div role="status" style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,.12)', color: 'var(--text-primary)' }}>{notice}</div>}

        {section === 'overview' && <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
            {[
              ['Open roles', jobs.length, BriefcaseBusiness],
              ['Exams created', exams.length, ClipboardList],
              ['Candidates to review', applicants.length, Users],
            ].map(([label, value, Icon]) => <div key={label} className="glass-panel" style={cardStyle}><Icon size={19} color="var(--primary)" /><div style={{ color: 'var(--text-muted)', fontSize: '.8rem', marginTop: 12 }}>{label}</div><div style={{ color: 'var(--text-primary)', fontSize: '1.7rem', fontWeight: 800 }}>{value}</div></div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            <button className="glass-panel" onClick={() => setSection('jobs')} style={{ ...cardStyle, textAlign: 'left', cursor: 'pointer' }}><BriefcaseBusiness color="var(--primary)" /><h2 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', margin: '12px 0 5px' }}>Create a recruitment</h2><p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '.84rem' }}>Describe the role, location, and employment type.</p></button>
            <button className="glass-panel" onClick={() => setSection('exams')} style={{ ...cardStyle, textAlign: 'left', cursor: 'pointer' }}><ClipboardList color="var(--primary)" /><h2 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', margin: '12px 0 5px' }}>Build a selection exam</h2><p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '.84rem' }}>Write and score your own questions. No AI-generated questions or AI proctoring.</p></button>
          </div>
          <div className="glass-panel" style={cardStyle}><h2 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginTop: 0 }}>Recent candidates</h2><CandidateList candidates={applicants.slice(0, 3)} /></div>
        </>}

        {section === 'jobs' && <div style={{ display: 'grid', gap: 16 }}>
          <form className="glass-panel" onSubmit={publishJob} style={{ ...cardStyle, display: 'grid', gap: 14 }}>
            <div><h2 style={{ color: 'var(--text-primary)', fontSize: '1.12rem', margin: '0 0 5px' }}>Post a recruitment</h2><p style={{ color: 'var(--text-secondary)', fontSize: '.84rem', margin: 0 }}>Enter the role details that candidates will see.</p></div>
            <label style={labelStyle}>Job title<input required value={job.title} onChange={event => setJob({ ...job, title: event.target.value })} placeholder="e.g. Product Designer" style={fieldStyle} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
              <label style={labelStyle}>Location<input value={job.location} onChange={event => setJob({ ...job, location: event.target.value })} placeholder="City or remote" style={fieldStyle} /></label>
              <label style={labelStyle}>Employment type<select value={job.type} onChange={event => setJob({ ...job, type: event.target.value })} style={fieldStyle}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></label>
            </div>
            <label style={labelStyle}>Role description<textarea required rows={5} value={job.description} onChange={event => setJob({ ...job, description: event.target.value })} placeholder="Responsibilities, qualifications, and what the role offers" style={{ ...fieldStyle, resize: 'vertical' }} /></label>
            <div><button className="btn-primary" type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}><Send size={16} /> Publish role</button></div>
          </form>
          <div className="glass-panel" style={cardStyle}><h2 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginTop: 0 }}>Your recruitments</h2>{jobs.length ? jobs.map(item => <div key={item.id} style={listRow}><div><strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong><div style={muted}>{[item.location, item.type, item.createdAt].filter(Boolean).join(' · ')}</div></div><span className="badge-pill badge-verified">Open</span></div>) : <p style={muted}>No roles posted yet. Create your first recruitment above.</p>}</div>
        </div>}

        {section === 'exams' && <div style={{ display: 'grid', gap: 16 }}>
          <form className="glass-panel" onSubmit={publishExam} style={{ ...cardStyle, display: 'grid', gap: 16 }}>
            <div><h2 style={{ color: 'var(--text-primary)', fontSize: '1.12rem', margin: '0 0 5px' }}>Create your selection exam</h2><p style={{ color: 'var(--text-secondary)', fontSize: '.84rem', margin: 0 }}>Write each question and answer key yourself. Candidates see the requirements before they choose to start.</p></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
              <label style={labelStyle}>Exam name<input required value={exam.title} onChange={event => setExam({ ...exam, title: event.target.value })} placeholder="e.g. Frontend fundamentals" style={fieldStyle} /></label>
              <label style={labelStyle}>For role<input required value={exam.role} onChange={event => setExam({ ...exam, role: event.target.value })} placeholder="e.g. Frontend Engineer" style={fieldStyle} /></label>
              <label style={labelStyle}>Time limit (minutes)<input type="number" min="1" max="240" value={exam.duration} onChange={event => setExam({ ...exam, duration: Number(event.target.value) })} style={fieldStyle} /></label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}><h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}>Questions ({examQuestionCount})</h3><button type="button" onClick={() => setQuestions(current => [...current, { prompt: '', options: ['', '', '', ''], answer: 0, points: 1 }])} style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: 'var(--primary)', fontWeight: 700 }}><Plus size={16} /> Add question</button></div>
            {questions.map((question, index) => <div key={index} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><strong style={{ color: 'var(--text-primary)' }}>Question {index + 1}</strong><button type="button" aria-label={`Remove question ${index + 1}`} onClick={() => removeQuestion(index)} style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button></div>
              <textarea required rows={2} value={question.prompt} onChange={event => updateQuestion(index, { prompt: event.target.value })} placeholder="Write the question" style={{ ...fieldStyle, resize: 'vertical' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 9 }}>{question.options.map((option, optionIndex) => <label key={optionIndex} style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}><input type="radio" name={`answer-${index}`} checked={question.answer === optionIndex} onChange={() => updateQuestion(index, { answer: optionIndex })} aria-label={`Mark option ${optionIndex + 1} correct`} /><input required value={option} onChange={event => updateQuestion(index, { options: question.options.map((value, i) => i === optionIndex ? event.target.value : value) })} placeholder={`Option ${optionIndex + 1}`} style={fieldStyle} /></label>)}</div>
              <label style={{ ...labelStyle, maxWidth: 180 }}>Points<input type="number" min="1" max="100" value={question.points} onChange={event => updateQuestion(index, { points: Number(event.target.value) })} style={fieldStyle} /></label>
            </div>)}
            <div style={{ padding: 16, borderRadius: 12, background: 'var(--surface-tint)' }}>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '.95rem', margin: '0 0 6px' }}>Candidate permissions and monitoring</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '.8rem', margin: '0 0 12px', lineHeight: 1.5 }}>These requests are shown before the exam. The candidate can review them and grant browser access when starting. No permission is requested from this employer screen.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <PermissionToggle icon={Camera} label="Camera" checked={exam.camera} onChange={camera => setExam({ ...exam, camera })} />
                <PermissionToggle icon={Mic} label="Microphone" checked={exam.microphone} onChange={microphone => setExam({ ...exam, microphone })} />
                <PermissionToggle icon={MonitorUp} label="Screen sharing" checked={exam.screen} onChange={screen => setExam({ ...exam, screen })} />
              </div>
              <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '.75rem', display: 'flex', gap: 7, alignItems: 'flex-start' }}><CircleHelp size={15} />Browser permissions alone do not deliver a live stream to recruiters. Candidate consent, a secure exam session, and an authorized monitoring connection are required.</div>
            </div>
            <div><button className="btn-primary" type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}><ClipboardList size={16} /> Create exam</button></div>
          </form>
          <div className="glass-panel" style={cardStyle}><h2 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginTop: 0 }}>Your exams</h2>{exams.length ? exams.map(item => <div key={item.id} style={listRow}><div><strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong><div style={muted}>{item.role} · {item.questions.length} questions · {item.duration} min</div><div style={{ display: 'flex', gap: 6, marginTop: 8 }}>{item.camera && <Camera size={14} title="Camera requested" />}{item.microphone && <Mic size={14} title="Microphone requested" />}{item.screen && <MonitorUp size={14} title="Screen sharing requested" />}</div></div><span className="badge-pill badge-verified">Draft ready</span></div>) : <p style={muted}>No exams yet. Add your questions above to create one.</p>}</div>
        </div>}

        {section === 'candidates' && <div className="glass-panel" style={cardStyle}><div style={{ marginBottom: 14 }}><h2 style={{ color: 'var(--text-primary)', fontSize: '1.08rem', margin: '0 0 5px' }}>Candidate pipeline</h2><p style={{ color: 'var(--text-secondary)', fontSize: '.83rem', margin: 0 }}>Review applicant profiles and their current hiring stage.</p></div><CandidateList candidates={applicants} /></div>}
        {section === 'network' && <ConnectionsInbox currentUserId={currentUserId} />}
      </section>
    </div>
  );
}

const labelStyle = { display: 'grid', gap: 7, color: 'var(--text-secondary)', fontSize: '.83rem', fontWeight: 650 };
const muted = { color: 'var(--text-muted)', fontSize: '.82rem', margin: '5px 0 0' };
const listRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderTop: '1px solid var(--border-subtle)' };

function PermissionToggle({ icon: Icon, label, checked, onChange }) {
  return <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px solid var(--border-subtle)', borderRadius: 9, color: 'var(--text-secondary)', fontSize: '.82rem', cursor: 'pointer' }}><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} /><Icon size={16} />{label}</label>;
}

function CandidateList({ candidates }) {
  return <div>{candidates.map(candidate => <div key={candidate.id} style={listRow}>
    <div style={{ display: 'flex', gap: 11, alignItems: 'center', minWidth: 0 }}><img src={candidate.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} /><div><strong style={{ color: 'var(--text-primary)', fontSize: '.9rem' }}>{candidate.name}</strong><div style={muted}>{candidate.university} · {candidate.gradYear}</div></div></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}><span style={{ color: 'var(--text-secondary)', fontSize: '.8rem' }}>{candidate.status}</span><span className="badge-pill badge-verified">{candidate.overallMatch}% match</span></div>
  </div>)}</div>;
}
