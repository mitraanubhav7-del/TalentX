async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(body?.error || 'The request failed.');
    error.status = response.status;
    throw error;
  }
  return body;
}

export const socialApi = {
  posts: () => request('/api/social/posts'),
  createPost: content => request('/api/social/posts', { method: 'POST', body: JSON.stringify({ content }) }),
  toggleLike: postId => request(`/api/social/posts/${postId}/like`, { method: 'POST', body: '{}' }),
  members: () => request('/api/social/members'),
  connect: memberId => request(`/api/social/connections/${memberId}`, { method: 'POST', body: '{}' }),
  respond: (connectionId, status) => request(`/api/social/connections/${connectionId}`, {
    method: 'PATCH', body: JSON.stringify({ status }),
  }),
  messages: memberId => request(`/api/social/messages/${memberId}`),
  sendMessage: (memberId, text) => request(`/api/social/messages/${memberId}`, {
    method: 'POST', body: JSON.stringify({ text }),
  }),
};
