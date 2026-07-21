import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, formatMoney } from '../api/client.js';
import SkeletonList from '../components/Skeleton.jsx';

const THUMB_CLASSES = ['g1', 'g2', 'g4', 'g3', 'g5', 'g6'];

export default function HotelResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [minStars, setMinStars] = useState(0);
  const [sort, setSort] = useState('recommended');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setData(null);
    setError(null);
    api.searchHotels(Object.fromEntries(params)).then(setData).catch((e) => setError(e.message));
  }, [params, retryKey]);

  const hotels = useMemo(() => {
    if (!data) return [];
    let list = data.hotels.filter((h) => h.stars >= minStars);
    if (sort === 'price') list = [...list].sort((a, b) => a.totalPrice - b.totalPrice);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [data, minStars, sort]);

  if (error) {
    return (
      <div className="container results-page">
        <div className="error-banner" role="alert">
          <span>We couldn't load these stays: {error}</span>
          <button className="retry-btn" onClick={() => setRetryKey((k) => k + 1)}>Try again</button>
        </div>
      </div>
    );
  }
  if (!data) return <div className="container results-page"><SkeletonList count={5} /></div>;

  const q = data.query;

  return (
    <div className="container results-page">
      <div className="results-summary">
        <div>
          <h2>Hotels in {q.city}</h2>
          <div className="sub">{q.checkIn} – {q.checkOut} · {q.nights} night{q.nights > 1 ? 's' : ''} · {q.guests} guest{q.guests > 1 ? 's' : ''} · {q.rooms} room{q.rooms > 1 ? 's' : ''}</div>
        </div>
        <div className="sub" aria-live="polite">{hotels.length} of {data.count} stays</div>
      </div>

      <div className="results-layout">
        <aside className="filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <h4>Star rating</h4>
            {[0, 3, 4, 5].map((s) => (
              <label key={s}>
                <input type="radio" checked={minStars === s} onChange={() => setMinStars(s)} />
                {s === 0 ? 'Any' : `${s}+ stars`}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Sort by</h4>
            {[['recommended', 'Recommended'], ['price', 'Lowest price'], ['rating', 'Guest rating']].map(([id, label]) => (
              <label key={id}>
                <input type="radio" checked={sort === id} onChange={() => setSort(id)} />
                {label}
              </label>
            ))}
          </div>
        </aside>

        <section className="result-list">
          {hotels.map((h, i) => (
            <article className="stay-card" key={h.id}>
              <div className={`stay-thumb ${THUMB_CLASSES[i % THUMB_CLASSES.length]}`} aria-hidden="true">
                {h.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div className="stay-body">
                <h3>{h.name}</h3>
                <span className="stars">{'★'.repeat(h.stars)}</span>
                <div className="stay-meta">{h.area} · {h.distanceKm} km from centre</div>
                <div>
                  <span className="rating-pill">{h.rating}</span>
                  <span className="stay-meta">{h.reviews.toLocaleString()} reviews</span>
                </div>
                <div className="amenities">
                  {h.amenities.map((a) => <span key={a}>{a}</span>)}
                </div>
              </div>
              <div className="stay-buy">
                <div className="price-big">{formatMoney(h.totalPrice)}</div>
                <div className="price-sub">{formatMoney(h.pricePerNight)} / night · {h.nights} nights</div>
                <button className="select-btn" onClick={() => navigate('/book', { state: { type: 'hotel', item: h } })}>
                  Select →
                </button>
              </div>
            </article>
          ))}
          {!hotels.length && (
            <div className="empty">
              <div className="empty-icon" aria-hidden="true">🏨</div>
              <p>No hotels match your filters — the star rating is hiding every stay in {q.city}.</p>
              <button className="select-btn" onClick={() => setMinStars(0)}>Show all stays</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
