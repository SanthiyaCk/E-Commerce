// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: "$99.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: "$199.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Running Shoes",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      category: "Fashion"
    },
    {
      id: 4,
      name: "Designer Backpack",
      price: "$79.99",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      category: "Fashion"
    }
  ];

  const features = [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "Free delivery on orders over $50"
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "100% secure payment processing"
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day money back guarantee"
    },
    {
      icon: "⭐",
      title: "Best Quality",
      description: "Curated quality products"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 fade-in-up">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Sandy's Store 🛍️
              </h1>
              <p className="lead mb-4 opacity-90">
                Discover amazing products at unbeatable prices. From electronics to fashion, 
                we have everything you need to upgrade your lifestyle.
              </p>
            </div>
            <div className="col-lg-6 text-center fade-in-up">
              <img 
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=600&h=400&fit=crop"
                alt="Shopping Experience"
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: "400px" }}
              />
            </div>
            <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="btn btn-primary-gradient">
                  Shop Now 🛒
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-4 fade-in-up">
                <div className="feature-card text-center">
                  <span className="feature-icon">{feature.icon}</span>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted mb-0 small">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5 fade-in-up">
            <h2 className="fw-bold mb-3">Featured Products</h2>
            <p className="text-muted lead">Check out our most popular items</p>
          </div>
          <div className="row">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="col-lg-3 col-md-6 mb-4 fade-in-up">
                <div className="product-card">
                  <div className="position-relative overflow-hidden">
                    <img 
                      src={product.image} 
                      className="product-image w-100" 
                      alt={product.name}
                    />
                    <span className="product-badge position-absolute top-0 start-0 m-3">
                      {product.category}
                    </span>
                  </div>
                  <div className="card-body p-4">
                    <h6 className="card-title fw-bold mb-2">{product.name}</h6>
                    <p className="product-price mb-3">{product.price}</p>
                    <button className="btn btn-outline-primary w-100 btn-sm">
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4 fade-in-up">
            <Link to="/products" className="btn btn-primary-gradient px-5">
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}