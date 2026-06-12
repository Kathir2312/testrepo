import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container results-page">
      <div className="empty">
        <h2>Page not found</h2>
        <p>This route doesn't exist. <Link to="/">Back to search</Link>.</p>
      </div>
    </div>
  );
}
