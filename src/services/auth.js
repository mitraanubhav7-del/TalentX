async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error || 'The request failed.');
    error.status = response.status;
    error.code = result.code;
    throw error;
  }
  return result;
}

export const authApi = {
  currentUser: () => request('/api/auth/me'),
  updateProfile: profile => request('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ profile }),
  }),
  activity: () => request('/api/auth/activity', { method: 'POST' }),
  register: details => request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  verifyRegistration: details => request('/api/auth/register/verify', {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  requestPasswordReset: details => request('/api/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  resetPassword: details => request('/api/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify(details),
  }),
  login: credentials => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
};
