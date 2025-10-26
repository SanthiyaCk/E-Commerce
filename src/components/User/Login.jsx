// src/components/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Login.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaGoogle,
  FaArrowLeft
} from "react-icons/fa";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login with email/password
        await login(formData.email, formData.password);
        console.log('✅ Login successful for:', formData.email);
        navigate("/");
      } else {
        // Signup with email/password
        await signup(formData.email, formData.password, formData.displayName);
        console.log('✅ Signup successful for:', formData.email);
        navigate("/");
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Import Google auth function dynamically to avoid conflicts
      const { signInWithGoogle } = await import("../../utils/Auth");
      await signInWithGoogle();
      console.log('✅ Google login successful');
      navigate("/products");
    } catch (error) {
      console.error('❌ Google login error:', error);
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <button 
                  className="btn btn-outline-secondary btn-sm position-absolute start-0 top-0 m-3"
                  onClick={() => navigate("/")}
                >
                  <FaArrowLeft className="me-1" />
                  Back
                </button>
                
                <h2 className="card-title fw-bold text-primary mb-2">
                  {isLogin ? "Welcome Back 👋" : "Join Us Today 🎉"}
                </h2>
                <p className="text-muted">
                  {isLogin 
                    ? "Sign in to access your account and continue shopping" 
                    : "Create your account to start your shopping journey"
                  }
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <FaEnvelope className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              {/* Google Login Button */}
              <div className="mb-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="btn btn-outline-primary w-100 py-2 d-flex align-items-center justify-content-center"
                  style={{
                    border: "2px solid #4285F4",
                    backgroundColor: "white",
                    color: "#4285F4",
                    fontSize: "16px",
                    fontWeight: "500"
                  }}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <FaGoogle className="me-3" size={18} />
                  )}
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="position-relative text-center mb-4">
                <hr />
                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                  or
                </span>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailPasswordSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label fw-semibold">
                      <FaUser className="me-2 text-muted" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="displayName"
                      name="displayName"
                      placeholder="Enter your full name"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <FaEnvelope className="me-2 text-muted" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <FaLock className="me-2 text-muted" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {!isLogin && (
                    <div className="form-text">
                      🔒 Password must be at least 6 characters long
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 py-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </button>
              </form>

              {/* Toggle between Login and Signup */}
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-2 fw-bold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setFormData({
                        email: "",
                        password: "",
                        displayName: ""
                      });
                    }}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {/* Additional Links */}
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                </small>
              </div>

              {/* Quick Navigation */}
              <div className="text-center mt-3">
                <Link to="/" className="text-muted text-decoration-none small">
                  ← Continue shopping without account
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="row mt-4 text-center">
            <div className="col-md-4 mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body py-3">
                  <div className="text-primary mb-2">🚚</div>
                  <h6 className="card-title mb-1">Fast Delivery</h6>
                  <small className="text-muted">Free shipping on orders over $50</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body py-3">
                  <div className="text-primary mb-2">🔒</div>
                  <h6 className="card-title mb-1">Secure Payment</h6>
                  <small className="text-muted">Your data is always protected</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body py-3">
                  <div className="text-primary mb-2">⭐</div>
                  <h6 className="card-title mb-1">Easy Returns</h6>
                  <small className="text-muted">30-day return policy</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;