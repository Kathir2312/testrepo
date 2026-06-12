import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" />
          SkyScout
        </Link>
        <nav className="header-nav">
          <NavLink to="/" end>Flights</NavLink>
          <NavLink to="/?tab=hotels">Hotels</NavLink>
          <NavLink to="/?tab=cars">Car hire</NavLink>
        </nav>
      </div>
    </header>
  );
}
