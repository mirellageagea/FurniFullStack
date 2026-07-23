import { useEffect, useState } from 'react';
import { AdminAPI } from '../../api/endpoints';
import { Spinner, ErrorAlert } from '../../components/UI';
import AdminLayout from './AdminLayout';

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    AdminAPI.orders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminLayout title="Daily Summary — All Orders">
      <ErrorAlert message={error} />
      {!orders && !error && <Spinner label="Loading orders…" />}
      {orders && orders.length === 0 && <p className="text-muted">No orders yet.</p>}

      {orders && orders.map((order) => (
        <div className="card stat-card mb-3" key={order.completedAt}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-muted small">{new Date(order.completedAt).toLocaleString()}</div>
                <h6 className="mb-0">{order.firstName} {order.lastName} — {order.email}</h6>
              </div>
              <strong>${order.total.toFixed(2)}</strong>
            </div>
            <table className="table table-sm mb-0">
              <thead className="table-dark"><tr><th>Product</th><th>Qty</th><th>Subtotal</th></tr></thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
