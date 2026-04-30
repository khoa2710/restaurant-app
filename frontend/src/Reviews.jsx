import { useEffect, useState } from 'react';
import { getReviews, getUsers, getRestaurants, createReview, updateReview, deleteReview } from './api';
import { useToast } from './useToast.jsx';

function StarsInput({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: n <= value ? 'var(--gold)' : 'var(--warm-gray-light)',
            transition: 'color 0.1s',
            padding: '2px 4px',
          }}
        >★</button>
      ))}
    </div>
  );
}

function ReviewModal({ mode, data, users, restaurants, onClose, onSave }) {
  const [form, setForm] = useState(
    mode === 'edit'
      ? { rating: Number(data.rating), comment: data.comment || '', review_date: data.review_date?.slice(0, 10) || '', source_platform: data.source_platform || '' }
      : { user_id: '', restaurant_id: '', rating: 5, comment: '', review_date: new Date().toISOString().slice(0, 10), source_platform: '' }
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setSaving(true); setErr('');
    try {
      const payload = {
        ...form,
        rating: Number(form.rating),
        ...(mode === 'create' ? { user_id: Number(form.user_id), restaurant_id: Number(form.restaurant_id) } : {}),
      };
      if (mode === 'edit') await updateReview(data.review_id, payload);
      else await createReview(payload);
      onSave();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'edit' ? 'Edit Review' : 'New Review'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {err && <div className="error-banner">{err}</div>}

        {mode === 'create' && (
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
        )}

        <div className="form-group">
          <label>Rating</label>
          <StarsInput value={form.rating} onChange={v => set('rating', v)} />
        </div>

        <div className="form-group">
          <label>Comment</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.comment}
            onChange={e => set('comment', e.target.value)}
            placeholder="Share your experience…"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" value={form.review_date} onChange={e => set('review_date', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Source Platform</label>
            <select className="form-control" value={form.source_platform} onChange={e => set('source_platform', e.target.value)}>
              <option value="">— None —</option>
              <option value="Yelp">Yelp</option>
              <option value="Google">Google</option>
              <option value="Direct">Direct</option>
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Post Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('');
  const { show, ToastEl } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([getReviews(), getUsers(), getRestaurants()])
      .then(([rv, u, r]) => { setReviews(rv); setUsers(u); setRestaurants(r); })
      .catch(e => show(e.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = () => { setModal(null); load(); show('Review saved!'); };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await deleteReview(id); load(); show('Deleted.'); }
    catch (e) { show(e.message, 'error'); }
  };

  const platforms = [...new Set(reviews.map(r => r.source_platform).filter(Boolean))];
  const filtered = reviews.filter(r => !filter || r.source_platform === filter);

  const starsStr = (n) => {
    const full = Math.round(Number(n));
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  };

  return (
    <div className="page-enter">
      {ToastEl}
      <div className="section-header">
        <h1 className="section-title">Reviews</h1>
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'create' })}>+ Write Review</button>
      </div>

      <div className="search-bar">
        <select className="form-control" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All platforms</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon"></div><p>No reviews yet</p></div>
          ) : filtered.map(r => (
            <div key={r.review_id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600 }}>{r.user_name}</span>
                    <span style={{ color: 'var(--warm-gray)', fontSize: 13 }}>→</span>
                    <span style={{ color: 'var(--terracotta)', fontWeight: 500 }}>{r.restaurant_name}</span>
                    {r.source_platform && <span className="tag tag-cuisine" style={{ fontSize: 11 }}>{r.source_platform}</span>}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span className="stars">{starsStr(r.rating)}</span>{' '}
                    <span className="rating-num" style={{ fontSize: 13 }}>{Number(r.rating).toFixed(1)}</span>
                    <span style={{ color: 'var(--warm-gray)', fontSize: 12, marginLeft: 10, fontFamily: 'DM Mono, monospace' }}>
                      {r.review_date?.slice(0, 10)}
                    </span>
                  </div>
                  {r.comment && <p style={{ color: 'var(--charcoal-mid)', fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal({ mode: 'edit', data: r })}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.review_id)}>✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ReviewModal
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
