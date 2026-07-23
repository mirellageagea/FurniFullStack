import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container text-center" style={{ padding: '100px 24px' }}>
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/" className="btn btn-black">Back home</Link>
    </div>
  );
}
