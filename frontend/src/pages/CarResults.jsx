import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, formatMoney } from '../api/client.js';
import SkeletonList from '../components/Skeleton.jsx';

export default function CarResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [automaticOnly, setAutomaticOnly] = useState(false);
  const [sort, setSort] = useState('price');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setData(null);
    setError(null);
    api.searchCars(Object.fromEntries(params)).then(setData).catch((e) => setError(e.message));
  }, [params, retryKey]);

  const cars = useMemo(() => {
    if (!data) return [];
    let list = automaticOnly ? data.cars.filter((c) => c.transmission === 'Automatic') : data.cars;
    return [...list].sort(sort === 'price' ? (a, b) => a.totalPrice - b.totalPrice : (a, b) => b.rating - a.rating);
  }, [data, automaticOnly, sort]);

  if (error) {
    return (
      <div className="container results-page">
        <div className="error-banner" role="alert">
          <span>We couldn't load these cars: {error}</span>
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
          <h2>Car hire in {q.location}</h2>
          <div className="sub">{q.pickUpDate} – {q.dropOffDate} · {q.days} day{q.days > 1 ? 's' : ''}</div>
        </div>
        <div className="sub" aria-live="polite">{cars.length} of {data.count} cars</div>
      </div>

      <div className="results-layout">
        <aside className="filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <h4>Transmission</h4>
            <label>
              <input type="checkbox" checked={automaticOnly} onChange={(e) => setAutomaticOnly(e.target.checked)} />
              Automatic only
            </label>
          </div>
          <div className="filter-group">
            <h4>Sort by</h4>
            {[['price', 'Lowest price'], ['rating', 'Supplier rating']].map(([id, label]) => (
              <label key={id}>
                <input type="radio" checked={sort === id} onChange={() => setSort(id)} />
                {label}
              </label>
            ))}
          </div>
        </aside>

        <section className="result-list">
          {cars.map((c) => (
            <article className="stay-card" key={c.id}>
              <div className="stay-thumb g-sky" aria-hidden="true">🚗</div>
              <div className="stay-body">
                <h3>{c.model} <span className="stay-meta">or similar</span></h3>
                <div className="stay-meta">{c.category} · {c.seats} seats · {c.bags} bags · {c.transmission}</div>
                <div>
                  <span className="rating-pill">{c.rating}</span>
                  <span className="stay-meta">{c.supplier}</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  {c.freeCancellation && <span className="badge green">Free cancellation</span>}
                  {c.unlimitedMileage && <span className="badge grey">Unlimited mileage</span>}
                </div>
              </div>
              <div className="stay-buy">
                <div className="price-big">{formatMoney(c.totalPrice)}</div>
                <div className="price-sub">{formatMoney(c.pricePerDay)} / day · {c.days} days</div>
                <button className="select-btn" onClick={() => navigate('/book', { state: { type: 'car', item: c } })}>
                  Select →
                </button>
              </div>
            </article>
          ))}
          {!cars.length && (
            <div className="empty">
              <div className="empty-icon" aria-hidden="true">🚗</div>
              <p>No cars match your filters — every deal here is manual transmission.</p>
              <button className="select-btn" onClick={() => setAutomaticOnly(false)}>Include manual cars</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
