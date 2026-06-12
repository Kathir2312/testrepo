import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, formatMoney, formatTime, formatDuration } from '../api/client.js';

function FlightSummary({ item }) {
  return (
    <>
      {[item.outbound, item.inbound].filter(Boolean).map((leg, i) => (
        <div className="summary-row" key={i}>
          <span>{i === 0 ? 'Outbound' : 'Return'}: {leg.origin} → {leg.destination}</span>
          <span>{formatTime(leg.departure)} · {formatDuration(leg.durationMins)}</span>
        </div>
      ))}
      <div className="summary-row">
        <span>Cabin</span>
        <span style={{ textTransform: 'capitalize' }}>{item.cabinClass.replace('_', ' ')}</span>
      </div>
      <div className="summary-row">
        <span>Travellers</span>
        <span>{item.adults} adult{item.adults > 1 ? 's' : ''}</span>
      </div>
    </>
  );
}

function HotelSummary({ item }) {
  return (
    <>
      <div className="summary-row"><span>{item.name}</span><span>{'★'.repeat(item.stars)}</span></div>
      <div className="summary-row"><span>{item.city} · {item.area}</span><span>{item.nights} night{item.nights > 1 ? 's' : ''}</span></div>
    </>
  );
}

function CarSummary({ item }) {
  return (
    <>
      <div className="summary-row"><span>{item.model}</span><span>{item.category}</span></div>
      <div className="summary-row"><span>{item.supplier}</span><span>{item.days} day{item.days > 1 ? 's' : ''}</span></div>
    </>
  );
}

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!state?.item) {
    return (
      <div className="container results-page">
        <div className="empty">
          Nothing selected yet. <Link to="/">Start a new search</Link> and pick a flight, hotel or car.
        </div>
      </div>
    );
  }

  const { type, item } = state;

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const booking = await api.createBooking({ type, item, contact });
      navigate(`/confirmation/${booking.reference}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="container booking-layout">
      <form className="panel" onSubmit={submit}>
        <h2>Traveller details</h2>
        {error && <div className="error-banner">{error}</div>}
        <div className="form-grid">
          <div className="form-field">
            <label>First name</label>
            <input required value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Last name</label>
            <input required value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />
          </div>
          <div className="form-field full">
            <label>Email</label>
            <input type="email" required value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
          </div>
          <div className="form-field full">
            <label>Phone (optional)</label>
            <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
          </div>
        </div>
        <button className="search-submit" type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Confirming…' : `Confirm and book · ${formatMoney(item.totalPrice)}`}
        </button>
      </form>

      <aside className="panel">
        <h3>Your {type}</h3>
        {type === 'flight' && <FlightSummary item={item} />}
        {type === 'hotel' && <HotelSummary item={item} />}
        {type === 'car' && <CarSummary item={item} />}
        <div className="summary-row total">
          <span>Total</span>
          <span>{formatMoney(item.totalPrice)}</span>
        </div>
      </aside>
    </div>
  );
}
