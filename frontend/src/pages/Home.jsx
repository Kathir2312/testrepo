import { Link, useSearchParams } from 'react-router-dom';
import SearchWidget from '../components/SearchWidget.jsx';

const DEALS = [
  { city: 'Paris', code: 'CDG', price: 89, color: 'linear-gradient(135deg,#4568dc,#b06ab3)' },
  { city: 'New York', code: 'JFK', price: 312, color: 'linear-gradient(135deg,#0f2027,#2c5364)' },
  { city: 'Dubai', code: 'DXB', price: 268, color: 'linear-gradient(135deg,#f2994a,#f2c94c)' },
  { city: 'Singapore', code: 'SIN', price: 401, color: 'linear-gradient(135deg,#11998e,#38ef7d)' },
  { city: 'Rome', code: 'FCO', price: 74, color: 'linear-gradient(135deg,#cb2d3e,#ef473a)' },
  { city: 'Tokyo', code: 'NRT', price: 489, color: 'linear-gradient(135deg,#141e30,#243b55)' }
];

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Home() {
  const [params] = useSearchParams();
  const tab = ['flights', 'hotels', 'cars'].includes(params.get('tab')) ? params.get('tab') : 'flights';

  const headline = {
    flights: 'The best flight deals from anywhere, to everywhere',
    hotels: 'Find the perfect place to stay',
    cars: 'Car hire for every kind of trip'
  }[tab];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>{headline}</h1>
          <SearchWidget initialTab={tab} />
        </div>
      </section>

      <div className="container">
        <div className="usp-row">
          <div className="usp">
            <h3>Search everywhere</h3>
            <p>Compare hundreds of simulated airlines, hotels and car hire providers in one search.</p>
          </div>
          <div className="usp">
            <h3>Transparent prices</h3>
            <p>The price you see is the price you book. No hidden fees, ever.</p>
          </div>
          <div className="usp">
            <h3>Book with confidence</h3>
            <p>Instant confirmation with a booking reference you can look up any time.</p>
          </div>
        </div>

        <section className="deals">
          <h2>Flight deals from London</h2>
          <div className="deal-grid">
            {DEALS.map((d) => (
              <Link
                key={d.code}
                className="deal-card"
                to={`/flights?${new URLSearchParams({
                  origin: 'LHR', destination: d.code,
                  departDate: todayPlus(21), returnDate: todayPlus(28),
                  adults: 1, cabinClass: 'economy'
                })}`}
              >
                <div className="deal-banner" style={{ background: d.color }}>{d.city}</div>
                <div className="deal-body">
                  <span className="sub">Return from</span>
                  <span className="price">${d.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
