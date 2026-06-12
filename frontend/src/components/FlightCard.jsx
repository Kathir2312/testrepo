import { useNavigate } from 'react-router-dom';
import { formatMoney, formatTime, formatDate, formatDuration } from '../api/client.js';

function Leg({ leg }) {
  return (
    <div className="leg">
      <div className="airline">
        <span className="airline-dot" style={{ background: leg.carrier.color }}>{leg.carrier.code}</span>
        <span>{leg.carrier.name}<br />{leg.flightNumber}</span>
      </div>
      <div className="leg-times">
        <div>
          <div className="time">{formatTime(leg.departure)}</div>
          <div className="place">{leg.origin} · {formatDate(leg.departure)}</div>
        </div>
        <div className="leg-path">
          <div className="duration">{formatDuration(leg.durationMins)}</div>
          <div className="line" />
          <div className={`stops ${leg.stops === 0 ? 'stops-0' : 'stops-n'}`}>
            {leg.stops === 0 ? 'Direct' : `${leg.stops} stop${leg.stops > 1 ? 's' : ''} ${leg.stopAirports.join(', ')}`}
          </div>
        </div>
        <div>
          <div className="time">{formatTime(leg.arrival)}</div>
          <div className="place">{leg.destination} · {formatDate(leg.arrival)}</div>
        </div>
      </div>
    </div>
  );
}

export default function FlightCard({ itinerary }) {
  const navigate = useNavigate();
  return (
    <article className="flight-card">
      <div className="flight-legs">
        <Leg leg={itinerary.outbound} />
        {itinerary.inbound && <Leg leg={itinerary.inbound} />}
      </div>
      <div className="flight-buy">
        <div className="price-big">{formatMoney(itinerary.totalPrice, itinerary.currency)}</div>
        <div className="price-sub">
          {itinerary.adults > 1 ? `${formatMoney(itinerary.pricePerAdult)} per adult · ` : ''}
          {itinerary.cabinClass.replace('_', ' ')}
        </div>
        <button
          className="select-btn"
          onClick={() => navigate('/book', { state: { type: 'flight', item: itinerary } })}
        >
          Select →
        </button>
      </div>
    </article>
  );
}
