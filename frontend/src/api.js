const BASE = 'http://localhost:8080/api/applications';

async function request(path = '', options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

const json = (method, body) => ({ method, body: JSON.stringify(body) });

export const api = {
  list: (search = '', status = '') =>
    request(`?search=${encodeURIComponent(search)}${status ? `&status=${status}` : ''}`),
  get: (id) => request(`/${id}`),
  create: (body) => request('', json('POST', body)),
  update: (id, body) => request(`/${id}`, json('PUT', body)),
  remove: (id) => request(`/${id}`, { method: 'DELETE' }),
  stats: () => request('/stats'),
  addInterview: (id, body) => request(`/${id}/interviews`, json('POST', body)),
  removeInterview: (id, iid) => request(`/${id}/interviews/${iid}`, { method: 'DELETE' }),
};
