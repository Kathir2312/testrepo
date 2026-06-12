import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

const TABS = [
  { id: 'flights', label: 'Flights' },
  { id: 'hotels', label: 'Hotels' },
  { id: 'cars', label: 'Car hire' }
];

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function SearchWidget({ initialTab = 'flights' }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const [airports, setAirports] = useState([]);

  useEffect(() => setTab(initialTab), [initialTab]);
  useEffect(() => {
    api.airports().then((d) => setAirports(d.airports)).catch(() => {});
  }, []);

  // Flights state
  const [roundTrip, setRoundTrip] = useState(true);
  const [flight, setFlight] = useState({
    origin: 'LHR', destination: 'JFK',
    departDate: todayPlus(14), returnDate: todayPlus(21),
    adults: 1, cabinClass: 'economy'
  });

  // Hotels state
  const [hotel, setHotel] = useState({ city: 'Paris', checkIn: todayPlus(14), checkOut: todayPlus(17), guests: 2, rooms: 1 });

  // Cars state
  const [car, setCar] = useState({ location: 'Madrid', pickUpDate: todayPlus(14), dropOffDate: todayPlus(18) });

  function submit(e) {
    e.preventDefault();
    if (tab === 'flights') {
      const params = { ...flight };
      if (!roundTrip) delete params.returnDate;
      navigate(`/flights?${new URLSearchParams(params)}`);
    } else if (tab === 'hotels') {
      navigate(`/hotels?${new URLSearchParams(hotel)}`);
    } else {
      navigate(`/cars?${new URLSearchParams(car)}`);
    }
  }

  const airportOptions = (
    <datalist id="airport-list">
      {airports.map((a) => (
        <option key={a.code} value={a.code}>{`${a.city} (${a.code}) — ${a.name}`}</option>
      ))}
    </datalist>
  );

  return (
    <div className="search-widget">
      <div className="search-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'flights' && (
        <form className="search-form-wrap" onSubmit={submit}>
          <div className="trip-toggle">
            <label><input type="radio" checked={roundTrip} onChange={() => setRoundTrip(true)} /> Return</label>
            <label><input type="radio" checked={!roundTrip} onChange={() => setRoundTrip(false)} /> One way</label>
          </div>
          <div className="search-form">
            {airportOptions}
            <div className="field">
              <label>From</label>
              <input list="airport-list" required value={flight.origin}
                onChange={(e) => setFlight({ ...flight, origin: e.target.value.toUpperCase() })} placeholder="Airport code" />
              <button
                type="button"
                className="swap-btn"
                aria-label="Swap origin and destination"
                title="Swap origin and destination"
                onClick={() => setFlight({ ...flight, origin: flight.destination, destination: flight.origin })}
              >
                ⇄
              </button>
            </div>
            <div className="field">
              <label>To</label>
              <input list="airport-list" required value={flight.destination}
                onChange={(e) => setFlight({ ...flight, destination: e.target.value.toUpperCase() })} placeholder="Airport code" />
            </div>
            <div className="field">
              <label>Depart</label>
              <input type="date" required value={flight.departDate}
                onChange={(e) => setFlight({ ...flight, departDate: e.target.value })} />
            </div>
            {roundTrip && (
              <div className="field">
                <label>Return</label>
                <input type="date" required value={flight.returnDate}
                  onChange={(e) => setFlight({ ...flight, returnDate: e.target.value })} />
              </div>
            )}
            <div className="field">
              <label>Travellers</label>
              <select value={flight.adults} onChange={(e) => setFlight({ ...flight, adults: e.target.value })}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n} adult{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Cabin class</label>
              <select value={flight.cabinClass} onChange={(e) => setFlight({ ...flight, cabinClass: e.target.value })}>
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>
            <button className="search-submit" type="submit">Search flights</button>
          </div>
        </form>
      )}

      {tab === 'hotels' && (
        <form onSubmit={submit}>
          <div className="search-form">
            <div className="field">
              <label>Destination</label>
              <input required value={hotel.city} onChange={(e) => setHotel({ ...hotel, city: e.target.value })} placeholder="City" />
            </div>
            <div className="field">
              <label>Check-in</label>
              <input type="date" required value={hotel.checkIn} onChange={(e) => setHotel({ ...hotel, checkIn: e.target.value })} />
            </div>
            <div className="field">
              <label>Check-out</label>
              <input type="date" required value={hotel.checkOut} onChange={(e) => setHotel({ ...hotel, checkOut: e.target.value })} />
            </div>
            <div className="field">
              <label>Guests</label>
              <select value={hotel.guests} onChange={(e) => setHotel({ ...hotel, guests: e.target.value })}>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Rooms</label>
              <select value={hotel.rooms} onChange={(e) => setHotel({ ...hotel, rooms: e.target.value })}>
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} room{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button className="search-submit" type="submit">Search hotels</button>
          </div>
        </form>
      )}

      {tab === 'cars' && (
        <form onSubmit={submit}>
          <div className="search-form">
            <div className="field">
              <label>Pick-up location</label>
              <input required value={car.location} onChange={(e) => setCar({ ...car, location: e.target.value })} placeholder="City or airport" />
            </div>
            <div className="field">
              <label>Pick-up date</label>
              <input type="date" required value={car.pickUpDate} onChange={(e) => setCar({ ...car, pickUpDate: e.target.value })} />
            </div>
            <div className="field">
              <label>Drop-off date</label>
              <input type="date" required value={car.dropOffDate} onChange={(e) => setCar({ ...car, dropOffDate: e.target.value })} />
            </div>
            <button className="search-submit" type="submit">Search cars</button>
          </div>
        </form>
      )}
    </div>
  );
}
