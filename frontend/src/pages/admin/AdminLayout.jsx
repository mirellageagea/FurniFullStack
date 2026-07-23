import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sidebarStyle = { minHeight: '100vh', backgroundColor: '#1a1a2e', padding: 0 };
const brandStyle = { padding: '20px', backgroundColor: '#16213e', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', display: 'block' };
const navLinkBaseStyle = { color: '#a8a8b3', padding: '12px 20px', borderRadius: 0, transition: 'all 0.3s', textDecoration: 'none', display: 'block' };
const topNavbarStyle = { backgroundColor: 'white', padding: '15px 30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/admin/products', icon: 'bi-box-seam', label: 'Products' },
  { to: '/admin/coupons', icon: 'bi-tag', label: 'Coupons' },
  { to: '/admin/users', icon: 'bi-people', label: 'Users' },
  { to: '/admin/orders', icon: 'bi-receipt', label: 'Daily Summary' }
];

export default function AdminLayout({ title, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 p-0" style={sidebarStyle}>
          <NavLink to="/admin/dashboard" style={brandStyle}>Furni<span style={{ color: '#e94560' }}>.</span> Admin</NavLink>
          <nav className="nav flex-column mt-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => isActive ? 'admin-active' : ''}
                style={navLinkBaseStyle}
              >
                <i className={`bi ${item.icon}`}></i> {item.label}
              </NavLink>
            ))}
            <hr style={{ borderColor: '#a8a8b3', margin: '10px 20px' }} />
            <NavLink to="/" style={navLinkBaseStyle}>
              <i className="bi bi-arrow-left-circle"></i> Back to Website
            </NavLink>
            <button
              type="button"
              className="nav-link btn btn-link text-start w-100"
              style={{ ...navLinkBaseStyle, color: '#a8a8b3', border: 'none', background: 'none' }}
              onClick={() => { logout(); navigate('/'); }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </nav>
        </div>

        <div className="col-md-10 p-0">
          <div className="d-flex justify-content-between align-items-center" style={topNavbarStyle}>
            <h5 className="mb-0">{title}</h5>
          </div>
          <div style={{ padding: 30 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}
