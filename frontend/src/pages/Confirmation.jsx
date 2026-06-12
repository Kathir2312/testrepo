import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatMoney } from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function Confirmation() {
  const { reference } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getBooking(reference).then(setBooking).catch((e) => setError(e.message));
  }, [reference]);

  if (error) return <div className="container results-page"><div className="error-banner">{error}</div></div>;
  if (!booking) return <div className="container results-page"><Loader text="Loading your booking…" /></div>;

  return (
    <div className="container">
      <div className="confirm-hero">
        <div className="confirm-check">✓</div>
        <h1>You're booked, {booking.contact.firstName}!</h1>
        <p className="confirm-ref">
          Booking reference
          <strong>{booking.reference}</strong>
        </p>
        <p>
          A confirmation has been sent to <b>{booking.contact.email}</b>.
          Your {booking.type} booking total was <b>{formatMoney(booking.item.totalPrice)}</b>.
        </p>
        <p><Link to="/">Search for your next trip →</Link></p>
      </div>
    </div>
  );
}
