import { useEffect, useState } from 'react';
import { AdminAPI } from '../../api/endpoints';
import { Spinner, ErrorAlert } from '../../components/UI';
import AdminLayout from './AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    AdminAPI.dashboard().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <ErrorAlert message={error} />
      {!stats && !error && <Spinner label="Loading stats…" />}

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <StatCol label="Total Orders" value={stats.totalOrders} icon="bi-receipt" color="#0d6efd" />
            <StatCol label="Total Users" value={stats.totalUsers} icon="bi-people" color="#198754" />
            <StatCol label="Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="bi-currency-dollar" color="#e94560" />
            <StatCol label="Products" value={stats.totalProducts} icon="bi-box-seam" color="#6f42c1" />
            <StatCol label="Coupons" value={stats.totalCoupons} icon="bi-tag" color="#fd7e14" />
          </div>

          <div className="card stat-card">
            <div className="card-body">
              <h6 className="mb-3">Last 7 days</h6>
              <table className="table table-hover">
                <thead className="table-dark">
                  <tr><th>Date</th><th>Orders</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                  {stats.dailySummary.length === 0 && (
                    <tr><td colSpan={3} className="text-muted">No orders in the last 7 days.</td></tr>
                  )}
                  {stats.dailySummary.map((d) => (
                    <tr key={d.date}>
                      <td>{new Date(d.date).toLocaleDateString()}</td>
                      <td>{d.orders}</td>
                      <td>${d.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

function StatCol({ label, value, icon, color }) {
  return (
    <div className="col-6 col-md-4 col-lg">
      <div className="card stat-card">
        <div className="card-body d-flex align-items-center justify-content-between">
          <div>
            <div className="text-muted small">{label}</div>
            <div className="h4 mb-0">{value}</div>
          </div>
          <i className={`bi ${icon} stat-icon`} style={{ color }}></i>
        </div>
      </div>
    </div>
  );
}
