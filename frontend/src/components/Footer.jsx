import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div>
            <h4>SkyScout</h4>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Compare flights, hotels and car hire in one search.
              A Skyscanner-style travel search demo — not affiliated with Skyscanner Ltd.
              All prices and inventory are simulated.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/">Flights</Link></li>
              <li><Link to="/?tab=hotels">Hotels</Link></li>
              <li><Link to="/?tab=cars">Car hire</Link></li>
            </ul>
          </div>
          <div>
            <h4>Popular routes</h4>
            <ul>
              <li><Link to="/flights?origin=LHR&destination=JFK&departDate=2026-07-10&adults=1&cabinClass=economy">London → New York</Link></li>
              <li><Link to="/flights?origin=LHR&destination=DXB&departDate=2026-07-10&adults=1&cabinClass=economy">London → Dubai</Link></li>
              <li><Link to="/flights?origin=MAA&destination=SIN&departDate=2026-07-10&adults=1&cabinClass=economy">Chennai → Singapore</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><a href="/api/health" target="_blank" rel="noreferrer">Service status</a></li>
              <li><a href="https://github.com" target="_blank" rel="noreferrer">Source code</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SkyScout demo</span>
          <span>Made with a deterministic mock inventory — same search, same results.</span>
        </div>
      </div>
    </footer>
  );
}
