import { Link } from 'react-router-dom';
import { Calendar, MapPin, Pencil, Trash2, Video } from 'lucide-react';
import Avatar from './Avatar.jsx';
import StatusBadge from './StatusBadge.jsx';
import { fmtDate, fmtDateTime, upcoming } from '../constants.js';

/** compact=true is the Kanban-board variant (no status badge / buttons). */
export default function JobCard({ job, onEdit, onDelete, compact = false }) {
  const next = upcoming(job);
  return (
    <article className={`card job-card ${compact ? 'compact' : ''}`}>
      <div className="job-top">
        <Avatar name={job.company} />
        <div className="job-head">
          <Link to={`/applications/${job.id}`} className="job-company">{job.company}</Link>
          <div className="job-title">{job.jobTitle}</div>
        </div>
        {!compact && <StatusBadge status={job.status} />}
      </div>
      <div className="meta">
        {job.location && <span><MapPin size={13} /> {job.location}</span>}
        <span><Calendar size={13} /> Applied {fmtDate(job.applicationDate)}</span>
      </div>
      {next && (
        <div className="chip-interview"><Video size={13} /> {next.roundType || 'Interview'} · {fmtDateTime(next.interviewDate)}</div>
      )}
      {job.notes && !compact && <p className="job-notes">{job.notes}</p>}
      {!compact && (
        <div className="card-actions">
          <button className="btn ghost sm grow" onClick={() => onEdit(job)}><Pencil size={14} /> Edit</button>
          <button className="btn danger sm" aria-label="Delete" onClick={() => onDelete(job)}><Trash2 size={14} /></button>
        </div>
      )}
    </article>
  );
}
