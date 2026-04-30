import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurant, getRestaurantReviews } from './api';

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

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getRestaurant(id), getRestaurantReviews(id)])
      .then(([r, rv]) => { setRestaurant(r); setReviews(rv); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (error) return <div className="error-banner">{error}</div>;
  if (!restaurant) return null;

  return (
    <div className="page-enter">
      <Link to="/restaurants" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
        ← Back to Restaurants
      </Link>

      <div className="detail-hero card" style={{ marginBottom: 28, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {restaurant.cuisine_type && <span className="tag tag-cuisine">{restaurant.cuisine_type}</span>}
              {restaurant.price_range && <span className="tag tag-price">{restaurant.price_range}</span>}
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, marginBottom: 8 }}>{restaurant.name}</h1>
            <p style={{ color: 'var(--warm-gray)', fontSize: 15 }}>📍 {restaurant.address}, {restaurant.city}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}><StarsDisplay rating={restaurant.average_rating} /></div>
            <div style={{ color: 'var(--warm-gray)', fontSize: 13 }}>{restaurant.review_count} review{restaurant.review_count !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="detail-info-row">
          {restaurant.phone && (
            <div className="detail-info-item">
              <span className="detail-info-label">Phone</span>
              <span>{restaurant.phone}</span>
            </div>
          )}
          {restaurant.hours && (
            <div className="detail-info-item">
              <span className="detail-info-label">Hours</span>
              <span>{restaurant.hours}</span>
            </div>
          )}
        </div>
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 20 }}>
        Reviews <span style={{ color: 'var(--warm-gray)', fontStyle: 'italic', fontSize: 16 }}>({reviews.length})</span>
      </h2>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">★</div>
          <p>No reviews yet — be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(rv => (
            <div key={rv.review_id} className="card review-card">
              <div className="review-header">
                <div>
                  <div className="review-author">{rv.user_name}</div>
                  <div className="review-meta">{rv.source_platform} · {rv.review_date?.slice(0, 10)}</div>
                </div>
                <div style={{ fontSize: 18 }}><StarsDisplay rating={rv.rating} /></div>
              </div>
              {rv.comment && <p className="review-comment">{rv.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .detail-info-row {
          display: flex;
          gap: 32px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--cream-dark);
          flex-wrap: wrap;
        }
        .detail-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-info-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--warm-gray);
          font-weight: 500;
        }
        .review-card {
          padding: 20px 24px;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .review-author {
          font-weight: 600;
          margin-bottom: 3px;
        }
        .review-meta {
          font-size: 12px;
          color: var(--warm-gray);
        }
        .review-comment {
          color: var(--charcoal-mid);
          font-size: 14px;
          line-height: 1.7;
          padding-top: 12px;
          border-top: 1px solid var(--cream-dark);
        }
      `}</style>
    </div>
  );
}
