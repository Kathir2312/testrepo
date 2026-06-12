import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  }

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          SkyScout
        </Link>
        <nav className="header-nav">
          <NavLink to="/" end>Flights</NavLink>
          <NavLink to="/?tab=hotels">Hotels</NavLink>
          <NavLink to="/?tab=cars">Car hire</NavLink>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
