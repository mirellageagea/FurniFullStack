export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="text-center py-5 text-muted">
      <div className="spinner-border" role="status" style={{ width: '2rem', height: '2rem' }}></div>
      <p className="mt-3">{label}</p>
    </div>
  );
}

export function ErrorAlert({ message }) {
  if (!message) return null;
  return <div className="alert alert-danger">{message}</div>;
}

export function SuccessAlert({ message }) {
  if (!message) return null;
  return <div className="alert alert-success">{message}</div>;
}
