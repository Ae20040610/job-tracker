export const STATUSES = [
  { key: 'APPLIED', label: 'Applied', color: '#2563eb', bg: '#e6eeff' },
  { key: 'ASSESSMENT', label: 'Assessment', color: '#b45309', bg: '#fef0cf' },
  { key: 'INTERVIEW', label: 'Interview', color: '#7c3aed', bg: '#efe8ff' },
  { key: 'SELECTED', label: 'Selected', color: '#15803d', bg: '#dcf5e4' },
  { key: 'REJECTED', label: 'Rejected', color: '#dc2626', bg: '#fde4e4' },
];

export const statusMeta = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
    : '—';

const AVATARS = ['#6366f1', '#0ea5e9', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#22c55e'];
export const avatarColor = (name = '') =>
  AVATARS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATARS.length];

export const upcoming = (job) =>
  (job.interviews || []).find((i) => new Date(i.interviewDate) > new Date());
