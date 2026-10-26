import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Layers, Send, ClipboardCheck, Video, Trophy, XCircle, Calendar } from 'lucide-react';
import { api } from '../api.js';
import JobCard from '../components/JobCard.jsx';
import Avatar from '../components/Avatar.jsx';
import { STATUSES, fmtDateTime } from '../constants.js';

const TILES = [
  { key: 'total', label: 'Total applications', icon: Layers, color: '#4f46e5' },
  { key: 'APPLIED', label: 'Applied', icon: Send, color: '#2563eb' },
  { key: 'ASSESSMENT', label: 'Assessments', icon: ClipboardCheck, color: '#b45309' },
  { key: 'INTERVIEW', label: 'Interviews', icon: Video, color: '#7c3aed' },
  { key: 'SELECTED', label: 'Selected', icon: Trophy, color: '#15803d' },
  { key: 'REJECTED', label: 'Rejected', icon: XCircle, color: '#dc2626' },
];

export default function Dashboard() {
  const { openForm, deleteJob, version } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.stats(), api.list()])
      .then(([s, j]) => { setStats(s); setJobs(j); setError(''); })
      .catch(() => setError('Cannot reach the API. Is the Spring Boot server running on port 8080?'));
  }, [version]);

  if (error) return <div className="error big">{error}</div>;
  if (!stats) return <div className="empty">Loading…</div>;

  const interviews = jobs
    .flatMap((j) => (j.interviews || []).map((i) => ({ ...i, job: j })))
    .filter((i) => new Date(i.interviewDate) > new Date())
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5);

  return (
    <>
      <div className="page-head">
        <div><h1>Dashboard</h1><p>Your job search at a glance.</p></div>
      </div>

      <section className="stats">
        {TILES.map(({ key, label, icon: Icon, color }) => (
          <div className="card stat" key={key}>
            <span className="stat-icon" style={{ color, background: color + '18' }}><Icon size={18} /></span>
            <strong>{stats[key]}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="split">
        <div className="card panel">
          <h3>Pipeline</h3>
          {stats.total === 0 ? <p className="muted">No applications yet.</p> : (
            <>
              <div className="bar">
                {STATUSES.map((s) => stats[s.key] > 0 && (
                  <span key={s.key} title={`${s.label}: ${stats[s.key]}`} style={{ flex: stats[s.key], background: s.color }} />
                ))}
              </div>
              <ul className="legend">
                {STATUSES.map((s) => (
                  <li key={s.key}><i style={{ background: s.color }} />{s.label}<b>{stats[s.key]}</b></li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="card panel">
          <h3>Upcoming interviews <span className="count">{stats.upcomingInterviews}</span></h3>
          {interviews.length === 0 ? <p className="muted">Nothing scheduled. Open an application to add an interview.</p> : (
            <ul className="upcoming">
              {interviews.map((i) => (
                <li key={i.id}>
                  <Avatar name={i.job.company} size={32} />
                  <div>
                    <Link to={`/applications/${i.job.id}`}>{i.job.company}</Link>
                    <small>{i.roundType || 'Interview'} · {i.job.jobTitle}</small>
                  </div>
                  <span className="when"><Calendar size={13} /> {fmtDateTime(i.interviewDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="section-head">
        <h2>Recent applications</h2>
        <Link to="/applications" className="link">View all</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="card empty-card">
          <h3>Track your first application</h3>
          <p>Add a job you applied to and follow it from Applied to Selected.</p>
          <button className="btn primary" onClick={() => openForm()}>Add application</button>
        </div>
      ) : (
        <div className="grid3">
          {jobs.slice(0, 6).map((j) => <JobCard key={j.id} job={j} onEdit={openForm} onDelete={deleteJob} />)}
        </div>
      )}
    </>
  );
}
