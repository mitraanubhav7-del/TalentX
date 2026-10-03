import React, { useState } from 'react';
import { 
  Share2, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Send, 
  UserPlus, 
  Check, 
  Bookmark, 
  Search, 
  ExternalLink,
  Code,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { INITIAL_POSTS, AI_SUGGESTED_CONNECTIONS } from '../data/mockData';
import { MessagingModal } from './MessagingModal';

export function NetworkingFeed({ user }) {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [connectedIds, setConnectedIds] = useState(['conn_3']); // connected to Karthik Raja initially
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [activeCommunityFilter, setActiveCommunityFilter] = useState('All');

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: `post_${Date.now()}`,
      author: {
        name: user.name,
        title: `${user.title} | TalentX Verified`,
        avatar: user.avatar,
        verified: true
      },
      timeAgo: "Just now",
      content: newPostContent.trim(),
      tags: ["#TalentXBuild", "#BuildForBharat", "#DataScience"],
      likes: 1,
      comments: 0,
      shares: 0,
      hasLiked: true
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
          hasLiked: !p.hasLiked
        };
      }
      return p;
    }));
  };

  const handleToggleConnect = (id) => {
    setConnectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
      {/* LEFT COLUMN: FEED & POSTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* POST CREATOR */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <textarea
              placeholder="Share a project breakthrough, verify a milestone, or ask for hackathon collaborators..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              style={{
                flex: 1,
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge-pill badge-indigo" style={{ cursor: 'pointer' }}>#AgriTech</span>
              <span className="badge-pill badge-cyan" style={{ cursor: 'pointer' }}>#BuildForBharat</span>
              <span className="badge-pill badge-verified" style={{ cursor: 'pointer' }}>#TalentXVerified</span>
            </div>

            <button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim()}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.85rem', opacity: newPostContent.trim() ? 1 : 0.5 }}
            >
              <Send size={14} /> Post Update
            </button>
          </div>
        </div>

        {/* Community Channel Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['All Channels', 'AI & Machine Learning', 'Bharat 2.0 Hackathon', 'Skill-Based Hiring', 'Open Source'].map(filter => {
            const isSelected = activeCommunityFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveCommunityFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #6366F1' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#A5B4FC' : 'var(--text-secondary)'
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* FEED POSTS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(post => (
            <div key={post.id} className="glass-panel" style={{ padding: '22px' }}>
              {/* Post Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <ShieldCheck size={16} color="#10B981" title="TalentX Verified User" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {post.author.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {post.timeAgo}
                    </div>
                  </div>
                </div>

                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                  <Bookmark size={16} />
                </button>
              </div>

              {/* Post Content */}
              <p style={{
                fontSize: '0.9rem',
                color: '#E2E8F0',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                marginBottom: '14px'
              }}>
                {post.content}
              </p>

              {/* Project Card (if present) */}
              {post.projectCard && (
                <div style={{
                  background: 'var(--surface-tint)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={18} color="#38BDF8" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      {post.projectCard.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ★ {post.projectCard.stars}
                    </span>
                  </div>
                  <a
                    href={post.projectCard.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    View Repo <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {post.tags.map((tag, tIdx) => (
                  <span key={tIdx} style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <button
                  onClick={() => handleToggleLike(post.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: post.hasLiked ? '#FB7185' : 'var(--text-secondary)'
                  }}
                >
                  <Heart size={16} fill={post.hasLiked ? '#FB7185' : 'none'} />
                  <span>{post.likes}</span>
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>{post.comments} Comments</span>
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Share2 size={16} />
                  <span>{post.shares} Shares</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: AI-POWERED "PEOPLE YOU SHOULD MEET" (Slide 13) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={18} color="#38BDF8" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              People You Should Meet
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Matched on: <strong style={{ color: 'var(--primary)' }}>Skills + Career Goals + Projects + Hackathon Synergy</strong>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {AI_SUGGESTED_CONNECTIONS.map(person => {
              const isConnected = connectedIds.includes(person.id);
              return (
                <div
                  key={person.id}
                  style={{
                    background: 'var(--surface-tint)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <img
                      src={person.avatar}
                      alt={person.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                          {person.name}
                        </span>
                        <span className="badge-pill badge-verified" style={{ fontSize: '0.65rem' }}>
                          {person.compatibilityScore}% Synergy
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {person.title}
                      </div>
                    </div>
                  </div>

                  {/* Explainable AI Match Reason (Slide 13) */}
                  <div style={{
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    fontSize: '0.73rem',
                    color: 'var(--primary)',
                    lineHeight: 1.4
                  }}>
                    💡 {person.matchReason}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleConnect(person.id)}
                      className={isConnected ? "btn-secondary" : "btn-primary"}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '0.75rem' }}
                    >
                      {isConnected ? <><Check size={12} /> Connected</> : <><UserPlus size={12} /> Connect</>}
                    </button>

                    <button
                      onClick={() => setSelectedRecipient(person)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direct Messaging Modal */}
      <MessagingModal
        isOpen={!!selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        recipient={selectedRecipient}
      />
    </div>
  );
}
