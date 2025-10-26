// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import "./styles/Footer.css";

// Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// User Components
import Navbar from "./components/User/Navbar";
import Footer from "./components/User/Footer";
import Home from "./components/User/Home";
import About from "./components/User/About";
import Contact from "./components/User/Contact";
import Login from "./components/User/Login";
import ProductList from "./components/User/ProductList";
import ProductDetail from "./components/User/ProductDetails";
import UserDashboard from "./components/User/UserDashboard";
import Checkout from "./components/User/Checkout";

// Admin Components
import Header from "./components/Admin/Header";
import AdminHome from "./components/Admin/AdminHome";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminOrders from "./components/Admin/AdminOrders";

// ---------- Protected Route for logged-in users ----------
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return user || isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ---------- Public Route for unauthenticated users ----------
function PublicRoute({ children }) {
  const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return !user && !isAuthenticated ? children : <Navigate to="/" replace />;
}

// ---------- Admin Protected Route ----------
function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const adminAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  return isAdmin || adminAuthenticated ? children : <Navigate to="/admin" replace />;
}

// ---------- Main App Component ----------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Routes>
            {/* ---------- USER ROUTES ---------- */}
            
            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />

            {/* About Route */}
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              }
            />

            {/* Contact Route */}
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              }
            />

            {/* Products Route */}
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <div className="container mt-4">
                      <h2 className="text-center mb-4">🛍️ Products</h2>
                      <ProductList />
                    </div>
                  </ProtectedRoute>
                  <Footer />
                </>
              }
            />

            {/* Product Detail Route */}
            <Route
              path="/product/:productId"
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                  <Footer />
                </>
              }
            />

            {/* Checkout Routes - Single product & Cart checkout */}
            <Route
              path="/checkout/:productId?"
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                  <Footer />
                </>
              }
            />

            {/* User Dashboard Route */}
            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                  <Footer />
                </>
              }
            />

            {/* Login Route */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* ---------- ADMIN ROUTES ---------- */}
            
            {/* Admin Login */}
            <Route 
              path="/admin" 
              element={<AdminLogin />} 
            />

            {/* Admin Home */}
            <Route
              path="/admin/home"
              element={
                <AdminProtectedRoute>
                  <Header />
                  <AdminHome />
                  <Footer />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Admin Orders */}
            <Route
              path="/admin/orders"
              element={
                <AdminProtectedRoute>
                  <AdminOrders />
                </AdminProtectedRoute>
              }
            />

            {/* ---------- FALLBACK ROUTES ---------- */}
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}