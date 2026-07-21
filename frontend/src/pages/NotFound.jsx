import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container results-page">
      <div className="empty">
        <div className="empty-icon" aria-hidden="true">🧭</div>
        <h2>Page not found</h2>
        <p>This route doesn't exist — maybe the link was mistyped or the page has moved.</p>
        <button className="select-btn" onClick={() => navigate('/')}>Back to search</button>
        <p className="stay-meta">
          Or jump straight to <Link to="/?tab=hotels">hotels</Link> or <Link to="/?tab=cars">car hire</Link>.
        </p>
      </div>
    </div>
  );
}
