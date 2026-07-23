import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../api/endpoints";
import { ErrorAlert, SuccessAlert } from "../components/UI";
import GoogleSignInButton from "../components/GoogleSignInButton";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await AuthAPI.sendVerificationCode(email);
      setInfo(
        `We sent a 6-digit code to ${email}. Enter it below along with a password to finish creating your account.`,
      );
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setInfo("");
    try {
      await AuthAPI.sendVerificationCode(email);
      setInfo(`A new code was sent to ${email}.`);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(email, password, code);
      navigate("/");
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
        navigate("/");
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
                <h1>Create an Account</h1>
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
                <SuccessAlert message={info} />

                {step === 1 && (
                  <>
                    <div className="mb-4">
                      <GoogleSignInButton
                        onToken={handleGoogleToken}
                        onError={setError}
                      />
                    </div>

                    <div className="d-flex align-items-center mb-4">
                      <hr className="flex-grow-1" />
                      <span className="mx-3 text-muted small">
                        or sign up with email
                      </span>
                      <hr className="flex-grow-1" />
                    </div>

                    <form onSubmit={handleSendCode}>
                      <div className="form-group mb-4">
                        <label className="text-black" htmlFor="reg-email">
                          Email address
                        </label>
                        <input
                          required
                          type="email"
                          className="form-control"
                          id="reg-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn btn-mint btn-lg py-3 btn-block w-100"
                        disabled={loading}
                      >
                        {loading ? "Sending code…" : "Send Verification Code"}
                      </button>
                    </form>
                  </>
                )}

                {step === 2 && (
                  <form onSubmit={handleCreateAccount}>
                    <div className="form-group mb-3">
                      <label className="text-black" htmlFor="reg-code">
                        Verification code
                      </label>
                      <input
                        required
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        className="form-control"
                        id="reg-code"
                        placeholder="6-digit code"
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-mint btn-sm"
                        onClick={handleResendCode}
                      >
                        Didn't get a code? Resend
                      </button>
                    </div>
                    <div className="form-group mb-4">
                      <label className="text-black" htmlFor="reg-password">
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        className="form-control"
                        id="reg-password"
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <small className="text-muted">
                        At least 6 characters, with an uppercase letter, a
                        number, and a symbol.
                      </small>
                    </div>
                    <button
                      className="btn btn-mint btn-lg py-3 btn-block w-100"
                      disabled={loading}
                    >
                      {loading ? "Creating account…" : "Create Account"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-mint btn-sm mt-2"
                      onClick={() => setStep(1)}
                    >
                      &larr; Use a different email
                    </button>
                  </form>
                )}

                <p className="mt-3 mb-0">
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
