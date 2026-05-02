import { useEffect, useState } from 'react';
import {
  getReservations, getUsers, getRestaurants,
  createReservation, updateReservation, cancelReservation, deleteReservation
} from './api';
import { useToast } from './useToast.jsx';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function statusTag(s) {
  return <span className={`tag tag-status-${s}`}>{s}</span>;
}

function ReservationModal({ mode, data, users, restaurants, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit'
      ? {
          ...data,
          reservation_date: data.reservation_date?.slice(0, 10) || '',
          reservation_time: data.reservation_time?.slice(0, 5) || '',
        }
      : { user_id: '', restaurant_id: '', reservation_date: '', reservation_time: '', party_size: 1, status: 'pending' }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSaving(true); setErr('');
    try {
      const payload = {
        ...form,
        user_id: Number(form.user_id),
        restaurant_id: Number(form.restaurant_id),
        party_size: Number(form.party_size),
      };
      if (mode === 'edit') {
        await updateReservation(data.reservation_id, payload);
      } else {
        await createReservation(payload);
      }
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'edit' ? 'Edit Reservation' : 'New Reservation'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {err && <div className="error-banner">{err}</div>}
        <div className="form-row">
          <div className="form-group">
            <label>User</label>
            <select className="form-control" value={form.user_id} onChange={e => set('user_id', e.target.value)}>
              <option value="">Select user</option>
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Restaurant</label>
            <select className="form-control" value={form.restaurant_id} onChange={e => set('restaurant_id', e.target.value)}>
              <option value="">Select restaurant</option>
              {restaurants.map(r => <option key={r.restaurant_id} value={r.restaurant_id}>{r.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" value={form.reservation_date} onChange={e => set('reservation_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" className="form-control" value={form.reservation_time} onChange={e => set('reservation_time', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Party Size</label>
            <input type="number" className="form-control" min={1} value={form.party_size} onChange={e => set('party_size', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); 
  const [filter, setFilter] = useState('');
  const { show, ToastEl } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([getReservations(), getUsers(), getRestaurants()])
      .then(([res, u, r]) => { setReservations(res); setUsers(u); setRestaurants(r); })
      .catch(e => show(e.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = () => { setModal(null); load(); show('Reservation saved!'); };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this reservation?')) return;
    try { await cancelReservation(id); load(); show('Reservation cancelled.'); }
    catch (e) { show(e.message, 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this reservation permanently?')) return;
    try { await deleteReservation(id); load(); show('Deleted.'); }
    catch (e) { show(e.message, 'error'); }
  };

  const filtered = reservations.filter(r =>
    !filter || r.status === filter
  );

  return (
    <div className="page-enter">
      {ToastEl}
      <div className="section-header">
        <h1 className="section-title">Reservations</h1>
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>+ New Reservation</button>
      </div>

      <div className="search-bar" style={{ marginBottom: 20 }}>
        <select className="form-control" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Guest</th>
                  <th>Restaurant</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Party</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--warm-gray)', padding: 40 }}>No reservations found</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.reservation_id}>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--warm-gray)' }}>#{r.reservation_id}</td>
                    <td style={{ fontWeight: 500 }}>{r.user_name}</td>
                    <td>{r.restaurant_name}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{r.reservation_date?.slice(0, 10)}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{r.reservation_time?.slice(0, 5)}</td>
                    <td>{r.party_size} pax</td>
                    <td>{statusTag(r.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal({ mode: 'edit', data: r })}>Edit</button>
                        {r.status !== 'cancelled' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleCancel(r.reservation_id)}>Cancel</button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.reservation_id)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <ReservationModal
          mode={modal.mode}
          data={modal.data}
          users={users}
          restaurants={restaurants}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
