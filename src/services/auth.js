async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (networkError) {
    const error = new Error('Could not connect to backend server. Make sure the server is running.');
    error.status = 503;
    throw error;
  }

  if (response.status === 204) return null;

  let result = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      result = await response.json();
    } catch {
      result = null;
    }
  }

  if (!response.ok) {
    const message = result?.error || (response.status === 401 ? 'Authentication required.' : `Request failed with status ${response.status}`);
    const error = new Error(message);
    error.status = response.status;
    error.code = result?.code;
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
