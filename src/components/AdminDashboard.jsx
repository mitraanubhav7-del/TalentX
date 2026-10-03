import React, { useCallback, useEffect, useState } from 'react';
import { Check, Clock3, LogOut, RefreshCw, ShieldCheck, UserRound, X } from 'lucide-react';

const filters = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All requests' },
];

async function adminRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error || 'Unable to complete the admin request.');
    error.status = response.status;
    throw error;
  }
  return result;
}

export function AdminDashboard({ user, onLogout }) {
  const [status, setStatus] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState('');

  const loadRequests = useCallback(async () => {
    try {
      const [filtered, pending] = await Promise.all([
        adminRequest(`/api/admin/recruiters?status=${status}`),
        status === 'pending'
          ? Promise.resolve(null)
          : adminRequest('/api/admin/recruiters?status=pending'),
      ]);
      setRequests(filtered.recruiters);
      setPendingCount(pending?.recruiters.length ?? filtered.recruiters.length);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => { Promise.resolve().then(loadRequests); }, [loadRequests]);

  const decideRequest = async (recruiter, decision) => {
    setWorkingId(recruiter.id);
    setError('');
    try {
      await adminRequest(`/api/admin/recruiters/${recruiter.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: decision }),
      });
      await loadRequests();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div className="admin-header-brand">
          <div className="auth-brand-mark" aria-hidden="true">tX</div>
          <div>
            <span className="admin-eyebrow">TALENTX ADMINISTRATION</span>
            <h1>Recruiter approvals</h1>
          </div>
        </div>
        <div className="admin-account">
          <span className="admin-account-email">{user.email}</span>
          <button className="btn-secondary" onClick={onLogout}><LogOut size={15} /> Sign out</button>
        </div>
      </header>

      <section className="admin-summary">
        <div className="admin-summary-icon"><Clock3 size={21} /></div>
        <div>
          <strong>{pendingCount}</strong>
          <span>Recruiter requests awaiting your review</span>
        </div>
        <button className="btn-secondary" onClick={() => { setIsLoading(true); setError(''); loadRequests(); }} disabled={isLoading}>
          <RefreshCw size={15} className={isLoading ? 'auth-spinner' : ''} /> Refresh
        </button>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Recruiter accounts</h2>
            <p>Review each request and grant or decline access to the Hiring portal.</p>
          </div>
          <ShieldCheck size={24} color="var(--primary)" />
        </div>

        <div className="admin-filters" role="tablist" aria-label="Filter recruiter requests">
          {filters.map(filter => (
            <button
              key={filter.id}
              role="tab"
              aria-selected={status === filter.id}
              className={status === filter.id ? 'selected' : ''}
              onClick={() => { setIsLoading(true); setStatus(filter.id); }}
            >
              {filter.label}
              {filter.id === 'pending' && <span>{pendingCount}</span>}
            </button>
          ))}
        </div>

        {error && <p className="auth-error admin-error" role="alert">{error}</p>}

        {isLoading ? (
          <p className="admin-empty"><RefreshCw size={18} className="auth-spinner" /> Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className="admin-empty"><UserRound size={20} /> No {status === 'all' ? '' : `${status} `}recruiter requests.</p>
        ) : (
          <div className="admin-request-list">
            {requests.map(recruiter => (
              <article className="admin-request" key={recruiter.id}>
                <div className="admin-request-avatar"><UserRound size={20} /></div>
                <div className="admin-request-details">
                  <strong>{recruiter.name}</strong>
                  <span>{recruiter.email}</span>
                  <small>Requested {new Date(recruiter.createdAt).toLocaleString()}</small>
                </div>
                <span className={`admin-status status-${recruiter.status}`}>{recruiter.status}</span>
                {recruiter.status === 'pending' && (
                  <div className="admin-request-actions">
                    <button
                      className="admin-approve"
                      disabled={workingId === recruiter.id}
                      onClick={() => decideRequest(recruiter, 'approved')}
                    >
                      <Check size={15} /> Approve
                    </button>
                    <button
                      className="admin-reject"
                      disabled={workingId === recruiter.id}
                      onClick={() => decideRequest(recruiter, 'rejected')}
                    >
                      <X size={15} /> Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
