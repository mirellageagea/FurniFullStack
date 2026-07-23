import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ErrorAlert } from "../components/UI";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const { refresh } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const goAfterLogin = async () => {
    await refresh();
    navigate(location.state?.from?.pathname || "/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      await goAfterLogin();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleToken = useCallback(
    async (idToken) => {
      setError("");
      try {
        await googleLogin(idToken);
        await goAfterLogin();
      } catch (e) {
        setError(e.message);
      }
    },
    [googleLogin],
  );

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Sign In</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="untree_co-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="p-3 p-lg-5 border bg-white">
                <ErrorAlert message={error} />

                <div className="mb-4">
                  <GoogleSignInButton
                    onToken={handleGoogleToken}
                    onError={setError}
                  />
                </div>

                <div className="d-flex align-items-center mb-4">
                  <hr className="flex-grow-1" />
                  <span className="mx-3 text-muted small">
                    or sign in with email
                  </span>
                  <hr className="flex-grow-1" />
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="text-black" htmlFor="login-email">
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      className="form-control"
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="text-black" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      required
                      type="password"
                      className="form-control"
                      id="login-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-black btn-lg py-3 btn-block w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in…" : "Sign in"}
                  </button>
                </form>
                <p className="mt-3 mb-0">
                  New here? <Link to="/register">Create an account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
