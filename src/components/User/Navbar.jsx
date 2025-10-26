import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Logo from "../../assets/Logo.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { signOutUser } from "../../utils/Auth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  // Check for locally stored user (email/password login)
  useEffect(() => {
    const storedUser = localStorage.getItem("registeredUser");
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("registeredUser");
      }
    }
  }, [user]); // Re-run when Firebase user changes

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Clear both Firebase and local authentication
      if (user) {
        await logout(); // AuthContext logout
        await signOutUser(); // Firebase sign out
      }
      
      // Clear local storage
      localStorage.removeItem("registeredUser");
      localStorage.removeItem("isAuthenticated");
      setLocalUser(null);
      
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/");
      setMenuOpen(false);
    }
  };

  // Determine which user to display (Firebase user or local user)
  const currentUser = user || localUser;
  
  // Get display name and first letter for avatar
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Guest";
  const firstName = displayName.split(" ")[0];
  const firstLetter = firstName.charAt(0).toUpperCase();
  const photoURL = currentUser?.photoURL;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={() => setMenuOpen(false)}>
          <img 
            src={Logo} 
            alt="ShopCart Logo" 
            className="me-2 rounded-circle" 
            style={{ 
              height: "40px", 
              width: "40px", 
              objectFit: "cover" 
            }} 
          />
          <span className="fw-bold text-primary fs-4">ShopCart</span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {[
              { path: "/", label: "Home" },
              { path: "/products", label: "Products" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" }
            ].map((item, index) => (
              <li className="nav-item" key={index}>
                <Link 
                  className={`nav-link ${location.pathname === item.path ? "active fw-bold" : ""}`} 
                  to={item.path} 
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {currentUser ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link text-decoration-none d-flex align-items-center"
                  id="accountDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  My Account
                </button>
                <ul className="dropdown-menu" aria-labelledby="accountDropdown">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/dashboard" 
                      onClick={() => setMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button 
                      type="button" 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : null}
          </ul>

          <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3">
            {currentUser ? (
              <div className="d-flex align-items-center">
                <span className="me-3 fw-semibold text-secondary">
                  Hello, {firstName}
                </span>
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt="Profile" 
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      borderRadius: "50%", 
                      objectFit: "cover",
                      border: "2px solid #007bff"
                    }} 
                  />
                ) : (
                  <div 
                    className="d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{ 
                      width: "40px", 
                      height: "40px",
                      borderRadius: "50%", 
                      backgroundColor: "#007bff",
                      fontSize: "18px",
                      border: "2px solid #0056b3"
                    }}
                    title={displayName}
                  >
                    {firstLetter}
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <span className="me-3 fw-semibold text-muted">
                  Welcome! 
                </span>
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Login / Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}