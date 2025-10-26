import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-5 col-md-6 mb-4">
            <div className="footer-brand">
              <h5 className="fw-bold mb-3">Sandy's Store</h5>
              <p className="text-light opacity-75 mb-3 small">
                Your trusted shopping destination for quality products and exceptional customer service. 
                We're committed to bringing you the best shopping experience.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3 small">Quick Links</h6>
            <div className="d-flex flex-column">
              <Link to="/" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                🏠 Home
              </Link>
              <Link to="/products" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                🛍️ Products
              </Link>
              <Link to="/about" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                ℹ️ About
              </Link>
              <Link to="/contact" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                📞 Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="fw-bold mb-3 small">Support</h6>
            <div className="d-flex flex-column">
              <Link to="/shipping" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                🚚 Shipping Info
              </Link>
              <Link to="/returns" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                ↩️ Returns & Refunds
              </Link>
              <Link to="/privacy" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                🔒 Privacy Policy
              </Link>
              <Link to="/terms" className="text-light opacity-75 text-decoration-none small mb-2 py-1">
                📄 Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-secondary" />

        {/* Bottom Section */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0 text-muted small">
              © {currentYear} <span className="text-primary fw-semibold">Sandy's Store</span>. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="text-muted small">
              Crafted with <span className="text-danger">❤️</span> for shoppers worldwide
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;