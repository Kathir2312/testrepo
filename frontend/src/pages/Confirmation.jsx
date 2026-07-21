import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatMoney } from '../api/client.js';
import Loader from '../components/Loader.jsx';

const TYPE_LABEL = { flight: 'Flight', hotel: 'Hotel stay', car: 'Car hire' };

export default function Confirmation() {
  const { reference } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getBooking(reference).then(setBooking).catch((e) => setError(e.message));
  }, [reference]);

  if (error) {
    return (
      <div className="container results-page">
        <div className="error-banner" role="alert">
          <span>We couldn't find that booking: {error}</span>
          <Link to="/">Start a new search</Link>
        </div>
      </div>
    );
  }
  if (!booking) return <div className="container results-page"><Loader text="Loading your booking…" /></div>;

  const item = booking.item;

  return (
    <div className="container">
      <div className="confirm-hero">
        <div className="confirm-check" aria-hidden="true">✓</div>
        <h1>You're booked, {booking.contact.firstName}!</h1>
        <p className="confirm-ref">
          Booking reference
          <strong>{booking.reference}</strong>
        </p>
      </div>

      <div className="panel confirm-details">
        <h3>{TYPE_LABEL[booking.type] || 'Booking'} details</h3>
        {booking.type === 'flight' && item.outbound && (
          <>
            <div className="summary-row">
              <span>Outbound</span>
              <span>{item.outbound.origin} → {item.outbound.destination} · {item.outbound.carrier?.name}</span>
            </div>
            {item.inbound && (
              <div className="summary-row">
                <span>Return</span>
                <span>{item.inbound.origin} → {item.inbound.destination} · {item.inbound.carrier?.name}</span>
              </div>
            )}
          </>
        )}
        {booking.type === 'hotel' && (
          <div className="summary-row"><span>Stay</span><span>{item.name}, {item.city}</span></div>
        )}
        {booking.type === 'car' && (
          <div className="summary-row"><span>Car</span><span>{item.model} · {item.supplier}</span></div>
        )}
        <div className="summary-row">
          <span>Booked by</span>
          <span>{booking.contact.firstName} {booking.contact.lastName}</span>
        </div>
        <div className="summary-row total">
          <span>Total paid</span>
          <span>{formatMoney(item.totalPrice)}</span>
        </div>

        <div className="confirm-steps">
          <div><span aria-hidden="true">📧</span> A confirmation email is on its way to {booking.contact.email}.</div>
          <div><span aria-hidden="true">🔎</span> Keep your reference handy — you can look this booking up any time.</div>
          <div><span aria-hidden="true">🧳</span> All set. <Link to="/">Search for your next trip →</Link></div>
        </div>
      </div>
    </div>
  );
}
