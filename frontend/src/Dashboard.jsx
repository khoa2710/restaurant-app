import { useEffect, useState } from 'react';
import { getDashboardStats, getRestaurants } from './api';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function StatCard({ label, value, icon, accent }) {
  return (
    <div className="stat-card" style={{ '--accent': accent }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StarsDisplay({ rating }) {
  if (!rating) return <span style={{ color: 'var(--warm-gray)', fontSize: 13 }}>No reviews</span>;
  const full = Math.round(Number(rating));
  return (
    <span>
      <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>{' '}
      <span className="rating-num">{Number(rating).toFixed(1)}</span>
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRestaurants()])
      .then(([s, r]) => { setStats(s); setRestaurants(r.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-enter">
      <div className="dash-hero">
        <div className="dash-hero-text">
          <p className="dash-eyebrow">Welcome back</p>
          <h1 className="dash-title">Restaurant Platform</h1>
          <p className="dash-subtitle">Manage bookings, reviews & more</p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Users" value={stats?.total_users} icon="" accent="var(--terracotta)" />
        <StatCard label="Restaurants" value={stats?.total_restaurants} icon="" accent="var(--gold)" />
        <StatCard label="Reservations" value={stats?.total_reservations} icon="" accent="#5A8FA8" />
        <StatCard label="Reviews" value={stats?.total_reviews} icon="" accent="var(--success)" />
        <StatCard label="Avg Rating" value={stats?.average_rating ? `${stats.average_rating}/5` : null} icon="" accent="var(--gold)" />
        <StatCard label="Confirmed" value={stats?.confirmed_reservations} icon="" accent="var(--success)" />
        <StatCard label="Cancelled" value={stats?.cancelled_reservations} icon="" accent="var(--danger)" />
      </div>

      <div className="dash-bottom">
        <div className="dash-section">
          <div className="section-header">
            <h2 className="section-title" style={{ fontSize: 22 }}>Top Restaurants</h2>
            <Link to="/restaurants" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Cuisine</th>
                    <th>Price</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map(r => (
                    <tr key={r.restaurant_id}>
                      <td>
                        <Link to={`/restaurants/${r.restaurant_id}`} style={{ color: 'var(--terracotta)', fontWeight: 500 }}>
                          {r.name}
                        </Link>
                      </td>
                      <td>{r.city}</td>
                      <td><span className="tag tag-cuisine">{r.cuisine_type || '—'}</span></td>
                      <td><span className="tag tag-price">{r.price_range || '—'}</span></td>
                      <td><StarsDisplay rating={r.average_rating} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
