import { useEffect, useState } from 'react';
import { CartAPI } from '../api/endpoints';
import { Spinner, ErrorAlert } from '../components/UI';

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    CartAPI.myOrders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5"><div className="intro-excerpt"><h1>My Orders</h1></div></div>
          </div>
        </div>
      </div>

      <div className="untree_co-section before-footer-section">
        <div className="container">
          <ErrorAlert message={error} />
          {!orders && !error && <Spinner label="Loading orders…" />}
          {orders && orders.length === 0 && <p className="text-center">No orders yet.</p>}

          {orders && orders.map((order) => (
            <div className="p-3 p-lg-4 border bg-white mb-4" key={order.completedAt}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-muted small">{new Date(order.completedAt).toLocaleString()}</div>
                  <h3 className="h5 text-black mb-0">Order total: ${order.total.toFixed(2)}</h3>
                </div>
                {order.couponCode && <span className="badge bg-dark">Coupon: {order.couponCode}</span>}
              </div>
              <table className="table table-bordered mb-0">
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
          ))}
        </div>
      </div>
    </>
  );
}
