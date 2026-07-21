import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, formatMoney, formatDuration } from '../api/client.js';
import FlightCard from '../components/FlightCard.jsx';
import SkeletonList from '../components/Skeleton.jsx';

function totalDuration(it) {
  return it.outbound.durationMins + (it.inbound ? it.inbound.durationMins : 0);
}
function maxStops(it) {
  return Math.max(it.outbound.stops, it.inbound ? it.inbound.stops : 0);
}

const SORTS = {
  best: (a, b) => (a.totalPrice + totalDuration(a) * 0.5) - (b.totalPrice + totalDuration(b) * 0.5),
  cheapest: (a, b) => a.totalPrice - b.totalPrice,
  fastest: (a, b) => totalDuration(a) - totalDuration(b)
};

export default function FlightResults() {
  const [params] = useSearchParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('best');
  const [stopFilter, setStopFilter] = useState(new Set());
  const [airlineFilter, setAirlineFilter] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const query = Object.fromEntries(params);

  function clearFilters() {
    setStopFilter(new Set());
    setAirlineFilter(new Set());
    setMaxPrice(null);
  }

  useEffect(() => {
    setData(null);
    setError(null);
    clearFilters();
    api.searchFlights(query)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [params, retryKey]);

  const priceBounds = useMemo(() => {
    if (!data) return [0, 0];
    const prices = data.itineraries.map((i) => i.totalPrice);
    return [Math.min(...prices), Math.max(...prices)];
  }, [data]);

  const airlines = useMemo(() => {
    if (!data) return [];
    const map = new Map();
    for (const it of data.itineraries) {
      for (const leg of [it.outbound, it.inbound].filter(Boolean)) {
        map.set(leg.carrier.code, leg.carrier.name);
      }
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.itineraries;
    if (stopFilter.size) {
      list = list.filter((it) => stopFilter.has(Math.min(2, maxStops(it))));
    }
    if (airlineFilter.size) {
      list = list.filter((it) =>
        [it.outbound, it.inbound].filter(Boolean).every((leg) => airlineFilter.has(leg.carrier.code))
      );
    }
    if (maxPrice != null) {
      list = list.filter((it) => it.totalPrice <= maxPrice);
    }
    return [...list].sort(SORTS[sort]);
  }, [data, sort, stopFilter, airlineFilter, maxPrice]);

  const cheapest = useMemo(() => (filtered.length ? Math.min(...filtered.map((i) => i.totalPrice)) : 0), [filtered]);
  const fastest = useMemo(() => (filtered.length ? Math.min(...filtered.map(totalDuration)) : 0), [filtered]);

  function toggle(set, value, setter) {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  }

  if (error) {
    return (
      <div className="container results-page">
        <div className="error-banner" role="alert">
          <span>We couldn't load these flights: {error}</span>
          <button className="retry-btn" onClick={() => setRetryKey((k) => k + 1)}>Try again</button>
        </div>
      </div>
    );
  }
  if (!data) return <div className="container results-page"><SkeletonList count={6} /></div>;

  const q = data.query;

  // Tag the standout itineraries (uxui-promax: guide the eye to the answer).
  const cheapestId = filtered.length ? [...filtered].sort(SORTS.cheapest)[0].id : null;
  const fastestId = filtered.length ? [...filtered].sort(SORTS.fastest)[0].id : null;
  const bestId = filtered.length ? [...filtered].sort(SORTS.best)[0].id : null;
  const tagFor = (it) => {
    if (it.id === cheapestId) return 'cheapest';
    if (it.id === fastestId) return 'fastest';
    if (it.id === bestId && bestId !== cheapestId && bestId !== fastestId) return 'best';
    return null;
  };

  return (
    <div className="container results-page">
      <div className="results-summary">
        <div>
          <h2>{q.origin.city} ({q.origin.code}) → {q.destination.city} ({q.destination.code})</h2>
          <div className="sub">
            {q.departDate}{q.returnDate ? ` – ${q.returnDate}` : ' · one way'} · {q.adults} adult{q.adults > 1 ? 's' : ''} · {q.cabinClass.replace('_', ' ')}
          </div>
        </div>
        <div className="sub" aria-live="polite">{filtered.length} of {data.count} results</div>
      </div>

      <div className="results-layout">
        <aside className="filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <h4>Stops</h4>
            {[[0, 'Direct'], [1, '1 stop'], [2, '2+ stops']].map(([value, label]) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={stopFilter.has(value)}
                  onChange={() => toggle(stopFilter, value, setStopFilter)}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h4>Max price {maxPrice != null && `· ${formatMoney(maxPrice)}`}</h4>
            <input
              type="range"
              min={priceBounds[0]}
              max={priceBounds[1]}
              value={maxPrice ?? priceBounds[1]}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            {maxPrice != null && (
              <button className="filter-clear" onClick={() => setMaxPrice(null)}>Reset</button>
            )}
          </div>
          <div className="filter-group">
            <h4>Airlines</h4>
            {airlines.map(([code, name]) => (
              <label key={code}>
                <input
                  type="checkbox"
                  checked={airlineFilter.has(code)}
                  onChange={() => toggle(airlineFilter, code, setAirlineFilter)}
                />
                {name}
              </label>
            ))}
          </div>
        </aside>

        <section>
          <div className="sort-tabs">
            {[
              ['best', 'Best'],
              ['cheapest', 'Cheapest', cheapest ? formatMoney(cheapest) : '—'],
              ['fastest', 'Fastest', fastest ? formatDuration(fastest) : '—']
            ].map(([id, label, value]) => (
              <button key={id} className={sort === id ? 'active' : ''} onClick={() => setSort(id)}>
                <span className="label">{label}</span>
                {value && <span className="value">{value}</span>}
              </button>
            ))}
          </div>

          <div className="result-list">
            {filtered.map((it) => <FlightCard key={it.id} itinerary={it} tag={tagFor(it)} />)}
            {!filtered.length && (
              <div className="empty">
                <div className="empty-icon" aria-hidden="true">🛫</div>
                <p>No flights match your filters — every itinerary on this route is currently hidden.</p>
                <button className="select-btn" onClick={clearFilters}>Clear all filters</button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
