import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from './api';

function StarsDisplay({ rating }) {
  if (!rating) return <span style={{ color: 'var(--warm-gray)', fontSize: 13 }}>No reviews yet</span>;
  const full = Math.round(Number(rating));
  return (
    <span>
      <span className="stars">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>{' '}
      <span className="rating-num">{Number(rating).toFixed(1)}</span>
    </span>
  );
}

export default function Restaurants() {
  const [all, setAll] = useState([]);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRestaurants()
      .then(setAll)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cuisines = [...new Set(all.map(r => r.cuisine_type).filter(Boolean))].sort();

  const filtered = all.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
    const matchCuisine = !cuisine || r.cuisine_type === cuisine;
    return matchSearch && matchCuisine;
  });

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-enter">
      <div className="section-header">
        <h1 className="section-title">Restaurants</h1>
        <span style={{ color: 'var(--warm-gray)', fontSize: 14 }}>{filtered.length} found</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="form-control"
            placeholder="Search by name or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-control"
          style={{ width: 200 }}
          value={cuisine}
          onChange={e => setCuisine(e.target.value)}
        >
          <option value="">All cuisines</option>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No restaurants found</p>
        </div>
      ) : (
        <div className="restaurant-grid">
          {filtered.map(r => (
            <Link to={`/restaurants/${r.restaurant_id}`} key={r.restaurant_id} className="restaurant-card">
              <div className="restaurant-card-header">
                <div className="restaurant-initial">{r.name[0]}</div>
                <div className="restaurant-tags">
                  {r.cuisine_type && <span className="tag tag-cuisine">{r.cuisine_type}</span>}
                  {r.price_range && <span className="tag tag-price">{r.price_range}</span>}
                </div>
              </div>
              <div className="restaurant-card-body">
                <h3 className="restaurant-name">{r.name}</h3>
                <p className="restaurant-city">📍 {r.city}</p>
                {r.hours && <p className="restaurant-hours"> {r.hours}</p>}
                <div className="restaurant-rating">
                  <StarsDisplay rating={r.average_rating} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
