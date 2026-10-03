import React, { useState } from 'react';
import { BriefcaseBusiness, LoaderCircle, Sparkles, UserRound } from 'lucide-react';
import { authApi } from '../services/auth';

export function AuthScreen({ onAuthenticated, capacityNotice }) {
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegistering = mode === 'register';

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = isRegistering
        ? await authApi.register({ name, email, password, role })
        : await authApi.login({ email, password });
      onAuthenticated(result.user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = nextMode => {
    setMode(nextMode);
    setError('');
  };

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-heading">
        <div className="auth-brand-mark" aria-hidden="true">tX</div>
        <p className="auth-eyebrow"><Sparkles size={14} /> TALENTX NETWORK</p>
        <h1 id="auth-heading">{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-description">
          Sign in to continue to your personalized talent workspace.
        </p>
        {capacityNotice && <p className="auth-note auth-capacity-notice" role="status">{capacityNotice}</p>}

        <div className="auth-mode-switch" role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegistering}
            className={!isRegistering ? 'selected' : ''}
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegistering}
            className={isRegistering ? 'selected' : ''}
            onClick={() => switchMode('register')}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <fieldset className="auth-role-options">
                <legend>Choose your account type</legend>
                <button
                  type="button"
                  className={role === 'candidate' ? 'auth-role selected' : 'auth-role'}
                  aria-pressed={role === 'candidate'}
                  onClick={() => setRole('candidate')}
                >
                  <UserRound size={18} />
                  <span><strong>Candidate</strong><small>Build your career profile</small></span>
                </button>
                <button
                  type="button"
                  className={role === 'recruiter' ? 'auth-role selected' : 'auth-role'}
                  aria-pressed={role === 'recruiter'}
                  onClick={() => setRole('recruiter')}
                >
                  <BriefcaseBusiness size={18} />
                  <span><strong>Recruiter</strong><small>Find and hire talent</small></span>
                </button>
              </fieldset>
              {role === 'recruiter' && (
                <p className="auth-note">Recruiter access is enabled after an administrator approves your account.</p>
              )}
              <label>
                Full name
                <input
                  autoComplete="name"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>
            </>
          )}
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              maxLength={254}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              value={password}
              onChange={event => setPassword(event.target.value)}
              minLength={isRegistering ? 10 : undefined}
              maxLength={128}
              required
            />
            {isRegistering && <small>Use at least 10 characters.</small>}
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting && <LoaderCircle size={17} className="auth-spinner" />}
            {isSubmitting ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch-copy">
          {isRegistering ? 'Already have an account?' : 'New to TalentX?'}{' '}
          <button type="button" onClick={() => switchMode(isRegistering ? 'login' : 'register')}>
            {isRegistering ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </main>
  );
}

export function PendingApproval({ user, onLogout, onRefresh, error, isRefreshing }) {
  const isRejected = user.recruiterStatus === 'rejected';
  return (
    <main className="auth-screen">
      <section className="auth-card auth-status-card">
        <div className="auth-brand-mark" aria-hidden="true">tX</div>
        <div className="auth-status-icon"><BriefcaseBusiness size={25} /></div>
        <h1>{isRejected ? 'Recruiter request declined' : 'Recruiter approval pending'}</h1>
        <p className="auth-description">
          {isRejected
            ? `Thanks for applying, ${user.name}. An administrator declined this recruiter request. Contact the TalentX administrator if you believe this was a mistake.`
            : `Thanks, ${user.name}. Your recruiter account is registered, but hiring tools will be available after an administrator approves it.`}
        </p>
        <p className="auth-account-email">{user.email}</p>
        {error && <p className="auth-error" role="alert" style={{ marginBottom: '12px' }}>{error}</p>}
        {!isRejected && (
          <button type="button" className="auth-submit" onClick={onRefresh} disabled={isRefreshing}>
            {isRefreshing && <LoaderCircle size={17} className="auth-spinner" />}
            {isRefreshing ? 'Checking…' : 'Check approval status'}
          </button>
        )}
        <button
          type="button"
          className="auth-switch-copy"
          onClick={onLogout}
          style={{ display: 'block', width: '100%', border: 0, background: 'none', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </section>
    </main>
  );
}

export function AuthLoading() {
  return (
    <main className="auth-screen">
      <p className="auth-loading"><LoaderCircle size={20} className="auth-spinner" /> Checking your session…</p>
    </main>
  );
}
