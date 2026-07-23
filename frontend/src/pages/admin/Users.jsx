import { useEffect, useState } from 'react';
import { AdminAPI } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { Spinner, ErrorAlert } from '../../components/UI';
import AdminLayout from './AdminLayout';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => AdminAPI.users().then(setUsers).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const withBusy = async (id, fn) => {
    setBusyId(id);
    setError('');
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout title="Users">
      <ErrorAlert message={error} />
      <div className="card stat-card">
        <div className="card-body">
          {!users && <Spinner label="Loading users…" />}
          {users && (
            <table className="table table-hover">
              <thead className="table-dark"><tr><th>Email</th><th>Roles</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.roles.map((r) => <span key={r} className="badge bg-secondary me-1">{r}</span>)}</td>
                    <td>
                      {u.roles.includes('Admin') ? (
                        <button className="btn btn-outline-secondary btn-sm me-1" disabled={busyId === u.id} onClick={() => withBusy(u.id, () => AdminAPI.demote(u.id))}>
                          Demote to User
                        </button>
                      ) : (
                        <button className="btn btn-success btn-sm me-1" disabled={busyId === u.id} onClick={() => withBusy(u.id, () => AdminAPI.promote(u.id))}>
                          Promote to Admin
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={busyId === u.id || u.id === currentUser.userId}
                        onClick={() => { if (confirm('Delete this user?')) withBusy(u.id, () => AdminAPI.deleteUser(u.id)); }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
