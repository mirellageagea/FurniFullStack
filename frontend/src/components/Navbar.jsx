import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" aria-label="Furni navigation bar">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Furni<span>.</span></NavLink>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni"
                aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsFurni">
          <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/about">About us</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/services">Services</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/blog">Blog</NavLink>
            </li>
            <li>
              <NavLink className="nav-link" to="/contact">Contact us</NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink className="nav-link" to="/admin/dashboard">Admin</NavLink>
              </li>
            )}
          </ul>

          <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
            {user ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white" href="#" id="userDropdown" role="button"
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="/images/user.svg" alt="" /> {user.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li><NavLink className="dropdown-item" to="/orders">My Orders</NavLink></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => { logout(); navigate('/'); }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li><NavLink className="nav-link text-white" to="/register">Register</NavLink></li>
                <li><NavLink className="nav-link text-white" to="/login"><img src="/images/user.svg" alt="" /> Login</NavLink></li>
              </>
            )}
            <li>
              <NavLink className="nav-link" to="/cart" style={{ position: 'relative' }}>
                <img src="/images/cart.svg" alt="Cart" />
                {itemCount > 0 && (
                  <span
                    className="cart-count-badge"
                    style={{
                      position: 'absolute', top: '-5px', right: '-8px',
                      background: 'red', color: 'white', borderRadius: '50%',
                      width: 18, height: 18, fontSize: 11,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
