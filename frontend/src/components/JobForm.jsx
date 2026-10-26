import { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../api.js';
import { STATUSES } from '../constants.js';

const today = () => new Date().toISOString().slice(0, 10);

export default function JobForm({ job, onClose, onSaved }) {
  const [f, setF] = useState({
    company: job?.company || '',
    jobTitle: job?.jobTitle || '',
    location: job?.location || '',
    applicationDate: job?.applicationDate || today(),
    jobUrl: job?.jobUrl || '',
    status: job?.status || 'APPLIED',
    notes: job?.notes || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!f.company.trim() || !f.jobTitle.trim()) return setError('Company and job title are required.');
    setSaving(true);
    try {
      job ? await api.update(job.id, f) : await api.create(f);
      onSaved();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <form className="modal" onMouseDown={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{job ? 'Edit application' : 'Add application'}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="grid2">
          <label>Company *<input value={f.company} onChange={set('company')} placeholder="e.g. Razorpay" autoFocus /></label>
          <label>Job title *<input value={f.jobTitle} onChange={set('jobTitle')} placeholder="e.g. Full Stack Developer" /></label>
          <label>Location<input value={f.location} onChange={set('location')} placeholder="Bengaluru / Remote" /></label>
          <label>Application date<input type="date" value={f.applicationDate} onChange={set('applicationDate')} /></label>
          <label>Status
            <select value={f.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          <label>Job URL<input type="url" value={f.jobUrl} onChange={set('jobUrl')} placeholder="https://…" /></label>
        </div>
        <label>Notes<textarea rows={4} value={f.notes} onChange={set('notes')} placeholder="Referral, salary range, contacts…" /></label>
        {error && <div className="error">{error}</div>}
        <div className="modal-foot">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : job ? 'Save changes' : 'Add application'}</button>
        </div>
      </form>
    </div>
  );
}
