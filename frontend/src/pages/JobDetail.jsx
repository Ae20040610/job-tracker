import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, MapPin, Pencil, Plus, Trash2, Video } from 'lucide-react';
import { api } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fmtDate, fmtDateTime } from '../constants.js';

const blank = { interviewDate: '', roundType: '', prepNotes: '' };

export default function JobDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { openForm, deleteJob, version } = useOutletContext();
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [iv, setIv] = useState(blank);
  const [ivError, setIvError] = useState('');

  useEffect(() => {
    api.get(id).then((j) => { setJob(j); setError(''); }).catch((e) => setError(e.message));
  }, [id, version]);

  if (error) return <div className="error big">{error} <Link to="/applications" className="link">Back to applications</Link></div>;
  if (!job) return <div className="empty">Loading…</div>;

  const addInterview = async (e) => {
    e.preventDefault();
    if (!iv.interviewDate) return setIvError('Pick a date and time.');
    try { setJob(await api.addInterview(id, iv)); setIv(blank); setIvError(''); }
    catch (err) { setIvError(err.message); }
  };
  const removeInterview = async (iid) => setJob(await api.removeInterview(id, iid));
  const remove = async () => { if (await deleteJob(job)) nav('/applications'); };

  return (
    <>
      <Link to="/applications" className="back"><ArrowLeft size={15} /> All applications</Link>

      <div className="card detail-head">
        <Avatar name={job.company} size={56} />
        <div className="grow">
          <h1>{job.jobTitle}</h1>
          <div className="meta big">
            <strong>{job.company}</strong>
            {job.location && <span><MapPin size={14} /> {job.location}</span>}
            <span><Calendar size={14} /> Applied {fmtDate(job.applicationDate)}</span>
            {job.jobUrl && <a className="link" href={job.jobUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Job posting</a>}
          </div>
        </div>
        <StatusBadge status={job.status} />
        <button className="btn ghost" onClick={() => openForm(job)}><Pencil size={15} /> Edit</button>
        <button className="btn danger" onClick={remove}><Trash2 size={15} /> Delete</button>
      </div>

      <div className="split detail-grid">
        <div className="card panel">
          <h3>Notes</h3>
          <p className={job.notes ? 'pre' : 'muted'}>{job.notes || 'No notes yet. Use Edit to add referral details, salary range, or contacts.'}</p>
        </div>

        <div className="card panel">
          <h3>Interviews <span className="count">{job.interviews.length}</span></h3>
          {job.interviews.length === 0 && <p className="muted">No interviews recorded.</p>}
          <ul className="timeline">
            {job.interviews.map((i) => (
              <li key={i.id}>
                <span className="dot"><Video size={13} /></span>
                <div className="grow">
                  <strong>{i.roundType || 'Interview'}</strong>
                  <small>{fmtDateTime(i.interviewDate)}</small>
                  {i.prepNotes && <p className="pre">{i.prepNotes}</p>}
                </div>
                <button className="icon-btn danger" aria-label="Delete interview" onClick={() => removeInterview(i.id)}><Trash2 size={14} /></button>
              </li>
            ))}
          </ul>

          <form className="iv-form" onSubmit={addInterview}>
            <h4>Add interview</h4>
            <div className="grid2">
              <label>Date and time<input type="datetime-local" value={iv.interviewDate} onChange={(e) => setIv({ ...iv, interviewDate: e.target.value })} /></label>
              <label>Round<input placeholder="Technical, HR…" value={iv.roundType} onChange={(e) => setIv({ ...iv, roundType: e.target.value })} /></label>
            </div>
            <label>Preparation notes<textarea rows={3} value={iv.prepNotes} onChange={(e) => setIv({ ...iv, prepNotes: e.target.value })} placeholder="Topics to revise, questions to ask…" /></label>
            {ivError && <div className="error">{ivError}</div>}
            <button className="btn primary"><Plus size={15} /> Add interview</button>
          </form>
        </div>
      </div>
    </>
  );
}
