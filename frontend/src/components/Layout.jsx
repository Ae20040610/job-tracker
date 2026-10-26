import { useState, useCallback } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Briefcase, LayoutDashboard, ListChecks, Plus } from 'lucide-react';
import JobForm from './JobForm.jsx';
import { api } from '../api.js';

export default function Layout() {
  const [form, setForm] = useState({ open: false, job: null });
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const openForm = (job = null) => setForm({ open: true, job });
  const closeForm = () => setForm({ open: false, job: null });

  const deleteJob = async (job) => {
    if (!window.confirm(`Delete your application to ${job.company}?`)) return false;
    await api.remove(job.id);
    bump();
    return true;
  };

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><Briefcase size={16} /></span> Applytrack
          </Link>
          <nav className="nav-links">
            <NavLink to="/" end><LayoutDashboard size={16} /> Dashboard</NavLink>
            <NavLink to="/applications"><ListChecks size={16} /> Applications</NavLink>
          </nav>
          <button className="btn primary" onClick={() => openForm()}>
            <Plus size={16} /> Add application
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet context={{ openForm, deleteJob, version, bump }} />
      </main>
      {form.open && (
        <JobForm job={form.job} onClose={closeForm} onSaved={() => { closeForm(); bump(); }} />
      )}
    </div>
  );
}
