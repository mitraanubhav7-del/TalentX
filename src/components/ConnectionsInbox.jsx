import React, { useCallback, useEffect, useState } from 'react';
import { Check, MessageSquare, UserPlus } from 'lucide-react';
import { socialApi } from '../services/social';
import { MessagingModal } from './MessagingModal';

export function ConnectionsInbox({ currentUserId }) {
  const [members, setMembers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try { setMembers((await socialApi.members()).members); setError(''); }
    catch (loadError) { setError(loadError.message); }
  }, []);
  useEffect(() => {
    load();
    const intervalId = setInterval(load, 10_000);
    return () => clearInterval(intervalId);
  }, [load]);

  const respond = async (person, status) => {
    try { await socialApi.respond(person.connectionId, status); await load(); }
    catch (requestError) { setError(requestError.message); }
  };
  const incoming = members.filter(person => person.connectionStatus === 'pending' && person.requesterId !== currentUserId);
  const accepted = members.filter(person => person.connectionStatus === 'accepted');

  return <div className="glass-panel" style={{ padding: 24 }}>
    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', margin: '0 0 6px' }}>Connections & messages</h2>
    <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', margin: '0 0 18px' }}>Accept a request to open a private conversation. This list refreshes automatically.</p>
    {error && <p role="alert" style={{ color: '#FB7185', fontSize: '.82rem' }}>{error}</p>}
    <h3 style={{ color: 'var(--text-primary)', fontSize: '.95rem' }}>Requests ({incoming.length})</h3>
    {incoming.length === 0 && <p style={muted}>No pending requests.</p>}
    {incoming.map(person => <PersonRow key={person.id} person={person}>
      <button className="btn-primary" onClick={() => respond(person, 'accepted')} style={buttonStyle}><Check size={14} /> Accept</button>
      <button className="btn-secondary" onClick={() => respond(person, 'declined')} style={buttonStyle}>Decline</button>
    </PersonRow>)}
    <h3 style={{ color: 'var(--text-primary)', fontSize: '.95rem', marginTop: 24 }}>Connected ({accepted.length})</h3>
    {accepted.length === 0 && <p style={muted}>Accepted connections will appear here.</p>}
    {accepted.map(person => <PersonRow key={person.id} person={person}>
      <button className="btn-primary" onClick={() => setSelectedRecipient(person)} style={buttonStyle}><MessageSquare size={14} /> Message</button>
    </PersonRow>)}
    <h3 style={{ color: 'var(--text-primary)', fontSize: '.95rem', marginTop: 24 }}>Sent requests</h3>
    {members.filter(person => person.connectionStatus === 'pending' && person.requesterId === currentUserId).map(person => <PersonRow key={person.id} person={person}><span style={muted}>Waiting for response</span></PersonRow>)}
    <MessagingModal isOpen={!!selectedRecipient} onClose={() => setSelectedRecipient(null)} recipient={selectedRecipient} currentUserId={currentUserId} />
  </div>;
}

function PersonRow({ person, children }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-subtle)', padding: '12px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      {person.avatar ? <img src={person.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} /> : <UserPlus size={26} color="var(--primary)" />}
      <div><strong style={{ color: 'var(--text-primary)', fontSize: '.88rem' }}>{person.name}</strong><div style={muted}>{person.title}{person.role === 'recruiter' ? ' · Recruiter' : ''}</div></div>
    </div>
    <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>{children}</div>
  </div>;
}

const muted = { color: 'var(--text-muted)', fontSize: '.78rem', margin: '4px 0 0' };
const buttonStyle = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 10px', fontSize: '.75rem' };
