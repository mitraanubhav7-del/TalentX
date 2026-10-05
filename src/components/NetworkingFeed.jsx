import React, { useCallback, useEffect, useState } from 'react';
import { 
  Share2, 
  Heart, 
  MessageSquare, 
  Send, 
  UserPlus, 
  Check, 
  Bookmark, 
  ExternalLink,
  Code,
  ShieldCheck,
} from 'lucide-react';
import { MessagingModal } from './MessagingModal';
import { socialApi } from '../services/social';

export function NetworkingFeed({ user, authUser }) {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [members, setMembers] = useState([]);
  const [networkError, setNetworkError] = useState('');
  const [networkLoading, setNetworkLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [activeCommunityFilter, setActiveCommunityFilter] = useState('All');

  const loadMembers = useCallback(async () => {
    try {
      const { members: currentMembers } = await socialApi.members();
      setMembers(currentMembers);
      setNetworkError('');
    } catch (error) {
      setNetworkError(error.message);
    } finally {
      setNetworkLoading(false);
    }
  }, []);

  const loadFeed = useCallback(async () => {
    try {
      const { posts: currentPosts } = await socialApi.posts();
      setPosts(currentPosts);
      setNetworkError('');
    } catch (error) {
      setNetworkError(error.message);
    } finally {
      setFeedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
    loadFeed();
    const memberIntervalId = setInterval(loadMembers, 10_000);
    const feedIntervalId = setInterval(loadFeed, 8_000);
    return () => { clearInterval(memberIntervalId); clearInterval(feedIntervalId); };
  }, [loadMembers, loadFeed]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      await socialApi.createPost(newPostContent);
      setNewPostContent('');
      await loadFeed();
    } catch (error) { setNetworkError(error.message); }
  };

  const handleToggleLike = async postId => {
    try {
      await socialApi.toggleLike(postId);
      await loadFeed();
    } catch (error) { setNetworkError(error.message); }
  };

  const handleConnect = async member => {
    try {
      await socialApi.connect(member.id);
      await loadMembers();
    } catch (error) {
      setNetworkError(error.message);
    }
  };

  const handleConnectionResponse = async (member, status) => {
    try {
      await socialApi.respond(member.connectionId, status);
      await loadMembers();
    } catch (error) {
      setNetworkError(error.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
      {/* LEFT COLUMN: FEED & POSTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {networkError && <p role="alert" className="auth-error">{networkError}</p>}
        {/* POST CREATOR */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
                  <textarea
              maxLength={2000}
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
                  background: isSelected ? 'rgba(34, 128, 74, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #21804A' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#A7E2C1' : 'var(--text-secondary)'
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* FEED POSTS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {feedLoading && <div className="glass-panel" style={{ padding: 22, color: 'var(--text-muted)' }}>Loading the shared feed…</div>}
          {!feedLoading && posts.length === 0 && <div className="glass-panel" style={{ padding: 22, color: 'var(--text-muted)' }}>No posts yet. Share the first update with the TalentX community.</div>}
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
                      {formatPostTime(post.createdAt)}
                    </div>
                  </div>
                </div>

                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                  <Bookmark size={16} />
                </button>
              </div>

              {/* Post Content */}
              <p style={{
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
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
                    <Code size={18} color="#35B879" />
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

      {/* RIGHT COLUMN: REAL MEMBER DIRECTORY AND CONNECTION REQUESTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <UserPlus size={18} color="#35B879" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              TalentX members
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Connect with candidates and approved recruiters. Messaging opens after a connection is accepted.
          </p>
          {networkError && <p role="alert" style={{ color: '#FB7185', fontSize: '.8rem' }}>{networkError}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {networkLoading && <p style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>Loading members…</p>}
            {!networkLoading && members.length === 0 && !networkError && <p style={{ color: 'var(--text-muted)', fontSize: '.82rem' }}>No other member profiles are available yet.</p>}
            {members.map(person => {
              const incoming = person.connectionStatus === 'pending' && person.requesterId !== authUser.id;
              const outgoing = person.connectionStatus === 'pending' && person.requesterId === authUser.id;
              const connected = person.connectionStatus === 'accepted';
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
                    {person.avatar ? <img src={person.avatar} alt="" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--surface-tint)', display: 'grid', placeItems: 'center', color: 'var(--primary)', fontWeight: 800 }}>{person.name.slice(0, 1).toUpperCase()}</div>}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{person.name}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{person.title}{person.role === 'recruiter' ? ' · Recruiter' : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {incoming ? <>
                      <button onClick={() => handleConnectionResponse(person, 'accepted')} className="btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '.75rem' }}><Check size={12} /> Accept</button>
                      <button onClick={() => handleConnectionResponse(person, 'declined')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '.75rem' }}>Decline</button>
                    </> : outgoing ? <button disabled className="btn-secondary" style={{ flex: 1, padding: '6px 10px', fontSize: '.75rem' }}>Request sent</button>
                      : connected ? <>
                        <button disabled className="btn-secondary" style={{ flex: 1, padding: '6px 10px', fontSize: '.75rem' }}><Check size={12} /> Connected</button>
                        <button onClick={() => setSelectedRecipient(person)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '.75rem' }}>Message</button>
                      </> : <button onClick={() => handleConnect(person)} className="btn-primary" style={{ flex: 1, padding: '6px 10px', fontSize: '.75rem' }}><UserPlus size={12} /> Connect</button>}
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
        currentUserId={authUser.id}
      />
    </div>
  );
}

function formatPostTime(timestamp) {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 1) return 'Just now';
  if (elapsedMinutes < 60) return `${elapsedMinutes} min ago`;
  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(timestamp).toLocaleDateString();
}
