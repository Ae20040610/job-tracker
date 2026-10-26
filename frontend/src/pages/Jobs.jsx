import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Search, LayoutGrid, Table2, Columns3, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { api } from '../api.js';
import JobCard from '../components/JobCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Avatar from '../components/Avatar.jsx';
import { STATUSES, fmtDate } from '../constants.js';

const VIEWS = [
  { key: 'board', label: 'Board', icon: Columns3 },
  { key: 'cards', label: 'Cards', icon: LayoutGrid },
  { key: 'table', label: 'Table', icon: Table2 },
];

export default function Jobs() {
  const { openForm, deleteJob, version } = useOutletContext();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [view, setView] = useState('board');
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.list(q, status).then((d) => { setJobs(d); setError(''); })
        .catch(() => setError('Cannot reach the API. Is the Spring Boot server running on port 8080?'));
    }, 250);
    return () => clearTimeout(t);
  }, [q, status, version]);

  return (
    <>
      <div className="page-head">
        <div><h1>Applications</h1><p>Keep track of every job you applied to in one place.</p></div>
      </div>

      <div className="toolbar">
        <div className="search"><Search size={16} />
          <input placeholder="Search company or job title" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="pills">
          <button className={!status ? 'pill on' : 'pill'} onClick={() => setStatus('')}>All</button>
          {STATUSES.map((s) => (
            <button key={s.key} className={status === s.key ? 'pill on' : 'pill'} onClick={() => setStatus(s.key)}>{s.label}</button>
          ))}
        </div>
        <div className="seg">
          {VIEWS.map(({ key, label, icon: Icon }) => (
            <button key={key} className={view === key ? 'on' : ''} onClick={() => setView(key)}><Icon size={15} /> {label}</button>
          ))}
        </div>
      </div>

      {error && <div className="error big">{error}</div>}
      {!error && jobs === null && <div className="empty">Loading…</div>}
      {jobs && jobs.length === 0 && (
        <div className="card empty-card">
          <h3>No applications found</h3>
          <p>{q || status ? 'Try a different search or filter.' : 'Add your first application to get started.'}</p>
          <button className="btn primary" onClick={() => openForm()}>Add application</button>
        </div>
      )}

      {jobs && jobs.length > 0 && view === 'board' && (
        <div className="board">
          {STATUSES.map((s) => {
            const col = jobs.filter((j) => j.status === s.key);
            return (
              <div className="column" key={s.key}>
                <div className="column-head"><i style={{ background: s.color }} />{s.label}<span className="count">{col.length}</span></div>
                <div className="column-body">
                  {col.map((j) => <JobCard key={j.id} job={j} compact />)}
                  {col.length === 0 && <div className="col-empty">No applications</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {jobs && jobs.length > 0 && view === 'cards' && (
        <div className="grid3">
          {jobs.map((j) => <JobCard key={j.id} job={j} onEdit={openForm} onDelete={deleteJob} />)}
        </div>
      )}

      {jobs && jobs.length > 0 && view === 'table' && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Role</th><th>Location</th><th>Applied</th><th>Status</th><th /></tr></thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td><div className="cell-co"><Avatar name={j.company} size={30} /><Link to={`/applications/${j.id}`}>{j.company}</Link></div></td>
                  <td>{j.jobTitle}</td>
                  <td>{j.location || '—'}</td>
                  <td>{fmtDate(j.applicationDate)}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td className="row-actions">
                    {j.jobUrl && <a className="icon-btn" href={j.jobUrl} target="_blank" rel="noreferrer" aria-label="Open posting"><ExternalLink size={15} /></a>}
                    <button className="icon-btn" aria-label="Edit" onClick={() => openForm(j)}><Pencil size={15} /></button>
                    <button className="icon-btn danger" aria-label="Delete" onClick={() => deleteJob(j)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
