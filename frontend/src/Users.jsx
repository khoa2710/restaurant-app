import { useEffect, useState } from 'react';
import { getUsers, createUser } from './api';
import { useToast } from './useToast.jsx';

function UserModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSaving(true); setErr('');
    try {
      await createUser(form);
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">New User</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {err && <div className="error-banner">{err}</div>}
        <div className="form-group">
          <label>Full Name</label>
          <input className="form-control" placeholder="Jane Doe" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" placeholder="jane@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone (optional)</label>
          <input className="form-control" placeholder="4801234567" value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creating…' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const { show, ToastEl } = useToast();

  const load = () => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .catch(e => show(e.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = () => { setShowModal(false); load(); show('User created!'); };

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      {ToastEl}
      <div className="section-header">
        <h1 className="section-title">Users</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="form-control"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--warm-gray)', padding: 40 }}>No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.user_id}>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--warm-gray)' }}>#{u.user_id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--terracotta)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, flexShrink: 0
                        }}>
                          {(u.name?.[0] || '?').toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--warm-gray)' }}>{u.email}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{u.phone || '—'}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--warm-gray)' }}>
                      {u.created_at?.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <UserModal onClose={() => setShowModal(false)} onSave={handleSave} />}
    </div>
  );
}
