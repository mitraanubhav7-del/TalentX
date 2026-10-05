import React, { useCallback, useEffect, useState } from 'react';
import { X, Send, User, ShieldCheck } from 'lucide-react';
import { socialApi } from '../services/social';

export function MessagingModal({ isOpen, onClose, recipient, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!recipient?.id) return;
    try {
      const { messages: latest } = await socialApi.messages(recipient.id);
      setMessages(latest);
      setError('');
    } catch (loadError) { setError(loadError.message); }
  }, [recipient?.id]);

  useEffect(() => {
    if (!isOpen || !recipient?.id) return undefined;
    loadMessages();
    const intervalId = setInterval(loadMessages, 3_000);
    return () => clearInterval(intervalId);
  }, [isOpen, recipient?.id, loadMessages]);

  const handleSendMessage = async event => {
    event?.preventDefault();
    const text = inputMessage.trim();
    if (!text || isSending) return;
    setIsSending(true);
    try {
      await socialApi.sendMessage(recipient.id, text);
      setInputMessage('');
      await loadMessages();
    } catch (sendError) { setError(sendError.message); }
    finally { setIsSending(false); }
  };

  if (!isOpen || !recipient) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <section className="glass-panel" role="dialog" aria-modal="true" aria-label={`Conversation with ${recipient.name}`} style={{ width: '100%', maxWidth: 560, height: 620, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--bg-glass-heavy)', border: '1px solid rgba(34, 128, 74, 0.4)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <header style={{ padding: '16px 20px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {recipient.avatar ? <img src={recipient.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} /> : <User size={28} color="var(--primary)" />}
            <div><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{recipient.name}</span><ShieldCheck size={15} color="#10B981" /></div><div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{recipient.title}</div></div>
          </div>
          <button onClick={onClose} aria-label="Close conversation" style={{ background: 'var(--track)', color: 'var(--text-secondary)', width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center' }}><X size={16} /></button>
        </header>

        <div aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <p role="alert" style={{ color: '#FB7185', fontSize: '.8rem' }}>{error}</p>}
          {!messages.length && !error && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '.85rem', marginTop: 28 }}>You’re connected. Start the conversation.</p>}
          {messages.map(message => {
            const mine = message.senderId === currentUserId;
            return <div key={message.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
              <div style={{ background: mine ? 'var(--grad-primary)' : 'rgba(255,255,255,.06)', color: 'var(--text-primary)', padding: '10px 14px', borderRadius: mine ? '16px 16px 2px 16px' : '16px 16px 16px 2px', fontSize: '.85rem', lineHeight: 1.45, border: mine ? 'none' : '1px solid var(--border-subtle)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message.text}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--text-muted)', marginTop: 4, textAlign: mine ? 'right' : 'left' }}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>;
          })}
        </div>

        <form onSubmit={handleSendMessage} style={{ padding: '14px 16px', background: 'rgba(15, 23, 42, 0.95)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 10 }}>
          <input maxLength={4000} value={inputMessage} onChange={event => setInputMessage(event.target.value)} aria-label="Message" placeholder="Write a message…" style={{ flex: 1, background: 'var(--surface-tint)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '.85rem' }} />
          <button type="submit" disabled={!inputMessage.trim() || isSending} aria-label="Send message" className="btn-primary" style={{ padding: '0 16px', borderRadius: 'var(--radius-md)' }}><Send size={16} /></button>
        </form>
      </section>
    </div>
  );
}
