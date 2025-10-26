import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8 mx-auto about-content">
            {/* Header Section */}
            <div className="text-center mb-5 about-section">
              <h1 className="fw-bold about-text-primary mb-3">About Sandy's Store</h1>
              <p className="lead about-text-muted">
                Your trusted shopping partner since 2020
              </p>
            </div>

            {/* Main Content */}
            <div className="about-card mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3 about-text-primary">Our Story</h4>
                <p className="about-text-muted mb-3">
                  Sandy's Store was founded with a simple mission: to make online shopping 
                  easy, reliable, and enjoyable for everyone. We carefully select each product 
                  to ensure quality and value for our customers.
                </p>
                <p className="about-text-muted mb-3">
                  From our humble beginnings, we've grown into a trusted platform serving 
                  thousands of happy customers. We believe in building lasting relationships 
                  through exceptional service and quality products.
                </p>
                <p className="about-text-muted">
                  Thank you for choosing Sandy's Store for your shopping needs. We're committed 
                  to making your experience the best it can be.
                </p>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="about-card mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-4 about-text-primary">Why Choose Us?</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="feature-item">
                      <span className="about-text-primary">✓</span>
                      <strong>Quality Products</strong>
                      <p className="about-text-muted mb-0 small">Carefully curated for excellence</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="feature-item">
                      <span className="about-text-primary">✓</span>
                      <strong>Fast Delivery</strong>
                      <p className="about-text-muted mb-0 small">Quick and reliable shipping</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="feature-item">
                      <span className="about-text-primary">✓</span>
                      <strong>Great Prices</strong>
                      <p className="about-text-muted mb-0 small">Competitive pricing always</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="feature-item">
                      <span className="about-text-primary">✓</span>
                      <strong>24/7 Support</strong>
                      <p className="about-text-muted mb-0 small">Always here to help you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="about-card mb-4">
              <div className="card-body">
                <h4 className="fw-bold mb-3 about-text-primary">Get In Touch</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="contact-info">
                      <strong>📧 Email</strong>
                      <p className="about-text-muted mb-0">support@sandysstore.com</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="contact-info">
                      <strong>📞 Phone</strong>
                      <p className="about-text-muted mb-0">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="contact-info">
                      <strong>🕒 Hours</strong>
                      <p className="about-text-muted mb-0">Mon-Sun: 24/7 Support</p>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="contact-info">
                      <strong>🌍 Location</strong>
                      <p className="about-text-muted mb-0">Serving customers worldwide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center about-section">
              <Link to="/products" className="about-btn about-btn-primary me-3">
                Shop Now
              </Link>
              <Link to="/contact" className="about-btn about-btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;