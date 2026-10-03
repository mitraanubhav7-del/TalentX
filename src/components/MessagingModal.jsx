import React, { useState } from 'react';
import { X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';

export function MessagingModal({ isOpen, onClose, recipient }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: `Hi Priya! I saw your TalentX verified score in Python (88%) and your AgriVision AI project. Impressive work on the Indic speech interface! How can I help with your Data Science / MLOps journey?`,
      time: '10:42 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen || !recipient) return null;

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // AI automated reply simulation from mentor/collaborator
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        sender: 'them',
        text: `Thanks for reaching out! Let's connect over a 15-minute sync or collaborate on the upcoming Build for Bharat hackathon track. Have you started containerizing the inference server with Docker yet?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'var(--bg-glass-heavy)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(15, 23, 42, 0.9)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={recipient.avatar}
              alt={recipient.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{recipient.name}</span>
                <span className="badge-pill badge-verified" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                  {recipient.connectionType || 'Verified'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{recipient.title}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--track)',
              border: 'none',
              color: 'var(--text-secondary)',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* AI Compatibility Banner */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          padding: '8px 16px',
          fontSize: '0.75rem',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} color="#38BDF8" />
          <span>TalentX AI Match: {recipient.matchReason}</span>
        </div>

        {/* Messages Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div style={{
                background: m.sender === 'me' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: m.sender === 'me' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '0.85rem',
                lineHeight: 1.45,
                border: m.sender === 'me' ? 'none' : '1px solid var(--border-subtle)'
              }}>
                {m.text}
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                marginTop: '4px',
                textAlign: m.sender === 'me' ? 'right' : 'left'
              }}>
                {m.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div style={{
          padding: '14px 16px',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '10px'
        }}>
          <input
            type="text"
            placeholder="Type a message or collaboration question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flex: 1,
              background: 'var(--surface-tint)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary"
            style={{ padding: '0 16px', borderRadius: 'var(--radius-md)' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
