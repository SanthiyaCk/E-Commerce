// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaChartBar,
    FaCog,
    FaRedo,
    FaExclamationTriangle,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaWarehouse
} from "react-icons/fa";
import AdminOrders from "./AdminOrders";

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
    });
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: ''
    });
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        loadOrders();
        loadProducts();
        loadUsers();
        calculateStats();
    };

    const loadOrders = () => {
        try {
            let allOrders = [];

            // Try multiple storage locations
            const allOrdersNew = JSON.parse(localStorage.getItem('all_orders')) || [];
            const allOrdersOld = JSON.parse(localStorage.getItem('allOrders')) || [];

            if (allOrdersNew.length > 0) {
                allOrders = allOrdersNew;
                console.log("📦 Loaded orders from 'all_orders':", allOrders.length);
            } else if (allOrdersOld.length > 0) {
                allOrders = allOrdersOld;
                console.log("📦 Loaded orders from 'allOrders':", allOrders.length);
            } else {
                // Aggregate from user orders
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('user_orders_')) {
                        try {
                            const userOrders = JSON.parse(localStorage.getItem(key)) || [];
                            allOrders = [...allOrders, ...userOrders];
                        } catch (e) {
                            console.log(`Skipping invalid key: ${key}`);
                        }
                    }
                });
                console.log("📦 Loaded orders from user orders:", allOrders.length);
            }

            // Sort by date (newest first)
            allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(allOrders);
        } catch (error) {
            console.error("❌ Error loading orders:", error);
            setOrders([]);
        }
    };

    const loadProducts = () => {
        try {
            const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
            setProducts(adminProducts);
        } catch (error) {
            console.error("❌ Error loading products:", error);
            setProducts([]);
        }
    };

    const loadUsers = () => {
        try {
            const usersData = JSON.parse(localStorage.getItem('users')) || [];
            setUsers(usersData);
        } catch (error) {
            console.error("❌ Error loading users:", error);
            setUsers([]);
        }
    };

    const calculateStats = () => {
        try {
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
            const pendingOrders = orders.filter(order => order.status === 'processing').length;
            const outOfStockProducts = products.filter(product => product.stock === 0).length;
            const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 5).length;

            setStats({
                totalOrders: orders.length,
                totalProducts: products.length,
                totalUsers: users.length,
                totalRevenue: totalRevenue,
                pendingOrders: pendingOrders,
                outOfStockProducts: outOfStockProducts,
                lowStockProducts: lowStockProducts
            });
        } catch (error) {
            console.error("❌ Error calculating stats:", error);
        }
    };

    const refreshData = () => {
        loadAllData();
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        try {
            const product = {
                id: Date.now(),
                title: newProduct.title,
                price: parseFloat(newProduct.price),
                description: newProduct.description,
                category: newProduct.category,
                image: newProduct.image || 'https://via.placeholder.com/300',
                stock: parseInt(newProduct.stock) || 0,
                createdAt: new Date().toISOString()
            };

            const updatedProducts = [...products, product];
            setProducts(updatedProducts);
            localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));

            setNewProduct({
                title: '',
                price: '',
                description: '',
                category: '',
                image: '',
                stock: ''
            });

            calculateStats();
            alert('Product added successfully!');
        } catch (error) {
            console.error('❌ Error adding product:', error);
            alert('Error adding product');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
            stock: product.stock
        });
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();
        try {
            const updatedProducts = products.map(product =>
                product.id === editingProduct.id
                    ? {
                        ...product,
                        title: newProduct.title,
                        price: parseFloat(newProduct.price),
                        description: newProduct.description,
                        category: newProduct.category,
                        image: newProduct.image,
                        stock: parseInt(newProduct.stock) || 0
                    }
                    : product
            );

            setProducts(updatedProducts);
            localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));

            setEditingProduct(null);
            setNewProduct({
                title: '',
                price: '',
                description: '',
                category: '',
                image: '',
                stock: ''
            });

            calculateStats();
            alert('Product updated successfully!');
        } catch (error) {
            console.error('❌ Error updating product:', error);
            alert('Error updating product');
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setNewProduct({
            title: '',
            price: '',
            description: '',
            category: '',
            image: '',
            stock: ''
        });
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updatedProducts = products.filter(product => product.id !== productId);
            setProducts(updatedProducts);
            localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
            calculateStats();
            alert('Product deleted successfully!');
        }
    };

    const handleUpdateStock = (productId, newStock) => {
        const updatedProducts = products.map(product =>
            product.id === productId
                ? { ...product, stock: parseInt(newStock) }
                : product
        );

        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
        calculateStats();
    };

    const handleDebugStorage = () => {
        console.log('🔍 DEBUG LocalStorage:');
        const keys = Object.keys(localStorage);

        console.log('📊 Orders:');
        const orderKeys = keys.filter(key => key.includes('order'));
        orderKeys.forEach(key => {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                console.log(`  ${key}:`, value?.length || 'No data');
            } catch (e) {
                console.log(`  ${key}: (Invalid JSON)`);
            }
        });

        console.log('📦 Products:', products.length);
        console.log('👥 Users:', users.length);

        alert('Check browser console for debug information!');
    };

    const updateOrderStatus = (orderNumber, newStatus) => {
        try {
            // Update in all_orders
            const allOrders = JSON.parse(localStorage.getItem('all_orders')) || [];
            const updatedAllOrders = allOrders.map(order =>
                order.orderNumber === orderNumber
                    ? { ...order, status: newStatus }
                    : order
            );
            localStorage.setItem('all_orders', JSON.stringify(updatedAllOrders));

            // Update in user orders
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.includes('user_orders_')) {
                    try {
                        const userOrders = JSON.parse(localStorage.getItem(key)) || [];
                        const updatedUserOrders = userOrders.map(order =>
                            order.orderNumber === orderNumber
                                ? { ...order, status: newStatus }
                                : order
                        );
                        localStorage.setItem(key, JSON.stringify(updatedUserOrders));
                    } catch (e) {
                        console.log(`Skipping ${key}`);
                    }
                }
            });

            loadOrders();
            alert(`Order ${orderNumber} status updated to ${newStatus}`);
        } catch (error) {
            console.error('❌ Error updating order status:', error);
            alert('Error updating order status');
        }
    };

    const getStockBadgeClass = (stock) => {
        if (stock === 0) return 'bg-danger';
        if (stock <= 5) return 'bg-warning';
        return 'bg-success';
    };

    const getStockText = (stock) => {
        if (stock === 0) return 'Out of Stock';
        if (stock <= 5) return 'Low Stock';
        return 'In Stock';
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Sidebar */}
                <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                    <div className="position-sticky pt-3">
                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                            <span>Admin Panel</span>
                        </h6>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeSection === 'overview' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveSection('overview')}
                                >
                                    <FaChartBar className="me-2" />
                                    Overview
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeSection === 'products' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveSection('products')}
                                >
                                    <FaBox className="me-2" />
                                    Products
                                    {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
                                        <span className="badge bg-danger ms-2">
                                            {stats.outOfStockProducts + stats.lowStockProducts}
                                        </span>
                                    )}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeSection === 'orders' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveSection('orders')}
                                >
                                    <FaShoppingCart className="me-2" />
                                    Orders
                                    {stats.pendingOrders > 0 && (
                                        <span className="badge bg-danger ms-2">{stats.pendingOrders}</span>
                                    )}
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeSection === 'users' ? 'active bg-primary text-white' : 'text-dark'}`}
                                    onClick={() => setActiveSection('users')}
                                >
                                    <FaUsers className="me-2" />
                                    Users
                                </button>
                            </li>
                        </ul>

                        <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                            <span>Tools</span>
                        </h6>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <button
                                    className="nav-link text-dark"
                                    onClick={refreshData}
                                >
                                    <FaRedo className="me-2" />
                                    Refresh All
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                        <h1 className="h2">
                            {activeSection === 'overview' && '📊 Dashboard Overview'}
                            {activeSection === 'products' && '📦 Product Management'}
                            {activeSection === 'orders' && '🛒 Order Management'}
                            {activeSection === 'users' && '👥 User Management'}
                        </h1>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={refreshData}
                            >
                                <FaRedo className="me-1" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div>
                            <div className="row mb-4">
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-primary shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                        Total Orders
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {stats.totalOrders}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <FaShoppingCart className="fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                        Total Products
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {stats.totalProducts}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <FaBox className="fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-warning shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                        Total Users
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        {stats.totalUsers}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <FaUsers className="fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                        Total Revenue
                                                    </div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                        ${stats.totalRevenue.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <FaChartBar className="fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
                                        </div>
                                        <div className="card-body">
                                            {orders.slice(0, 5).map(order => (
                                                <div key={order.orderNumber} className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                                                    <div>
                                                        <strong>#{order.orderNumber}</strong>
                                                        <div className="small text-muted">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="fw-bold text-primary">${parseFloat(order.total).toFixed(2)}</div>
                                                        <span className={`badge bg-${order.status === 'processing' ? 'warning' : order.status === 'shipped' ? 'info' : 'success'}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            {orders.length === 0 && (
                                                <p className="text-muted text-center">No orders found</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => setActiveSection('products')}
                                                >
                                                    <FaPlus className="me-2" />
                                                    Add New Product
                                                </button>
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => setActiveSection('orders')}
                                                >
                                                    <FaShoppingCart className="me-2" />
                                                    Manage Orders
                                                </button>
                                                {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => setActiveSection('products')}
                                                    >
                                                        <FaExclamationTriangle className="me-2" />
                                                        Manage Stock ({stats.outOfStockProducts + stats.lowStockProducts})
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Section */}
                    {activeSection === 'products' && (
                        <div>
                            <div className="card shadow mb-4">
                                <div className="card-header py-3">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Product Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newProduct.title}
                                                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-3 mb-3">
                                                <label className="form-label">Stock Quantity</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                    required
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Category</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={newProduct.category}
                                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Image URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={newProduct.image}
                                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary">
                                                <FaPlus className="me-2" />
                                                {editingProduct ? 'Update Product' : 'Add Product'}
                                            </button>
                                            {editingProduct && (
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="card shadow">
                                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        All Products ({products.length})
                                        {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
                                            <small className="text-danger ms-2">
                                                ({stats.outOfStockProducts} out of stock, {stats.lowStockProducts} low stock)
                                            </small>
                                        )}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Image</th>
                                                    <th>Title</th>
                                                    <th>Price</th>
                                                    <th>Stock</th>
                                                    <th>Status</th>
                                                    <th>Category</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map(product => (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                                className="rounded"
                                                            />
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <strong>{product.title}</strong>
                                                                <br />
                                                                <small className="text-muted">
                                                                    {product.description.length > 50 
                                                                        ? `${product.description.substring(0, 50)}...` 
                                                                        : product.description
                                                                    }
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>${product.price}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    style={{ width: '80px' }}
                                                                    value={product.stock}
                                                                    onChange={(e) => handleUpdateStock(product.id, e.target.value)}
                                                                    min="0"
                                                                />
                                                                <span className="text-muted">units</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getStockBadgeClass(product.stock)}`}>
                                                                {getStockText(product.stock)}
                                                            </span>
                                                        </td>
                                                        <td>{product.category}</td>
                                                        <td>
                                                            <div className="btn-group btn-group-sm">
                                                                <button 
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => handleEditProduct(product)}
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger"
                                                                    onClick={() => handleDeleteProduct(product.id)}
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {products.length === 0 && (
                                                    <tr>
                                                        <td colSpan="7" className="text-center text-muted py-4">
                                                            No products found. Add your first product above.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Stock Summary */}
                                    {products.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="text-muted mb-3">Stock Summary</h6>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="card bg-success text-white">
                                                        <div className="card-body text-center">
                                                            <h5>In Stock</h5>
                                                            <h3>
                                                                {products.filter(p => p.stock > 5).length}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="card bg-warning text-white">
                                                        <div className="card-body text-center">
                                                            <h5>Low Stock</h5>
                                                            <h3>{stats.lowStockProducts}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="card bg-danger text-white">
                                                        <div className="card-body text-center">
                                                            <h5>Out of Stock</h5>
                                                            <h3>{stats.outOfStockProducts}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Section */}
                    {activeSection === 'orders' && (
                        <div>
                            <AdminOrders
                                orders={orders}
                                onRefresh={refreshData}
                                onUpdateOrderStatus={updateOrderStatus}
                            />
                        </div>
                    )}

                    {/* Users Section */}
                    {activeSection === 'users' && (
                        <div className="card shadow">
                            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                                <h6 className="m-0 font-weight-bold text-primary">
                                    User Management ({users.length} users)
                                </h6>
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={loadUsers}
                                >
                                    <FaRedo className="me-1" />
                                    Refresh
                                </button>
                            </div>
                            <div className="card-body">
                                {/* User Statistics */}
                                <div className="row mb-4">
                                    <div className="col-md-3">
                                        <div className="card bg-primary text-white">
                                            <div className="card-body text-center">
                                                <h5>Total Users</h5>
                                                <h3>{users.length}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-success text-white">
                                            <div className="card-body text-center">
                                                <h5>Active Today</h5>
                                                <h3>
                                                    {users.filter(user => {
                                                        const today = new Date().toDateString();
                                                        const lastLogin = new Date(user.lastLogin).toDateString();
                                                        return lastLogin === today;
                                                    }).length}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-info text-white">
                                            <div className="card-body text-center">
                                                <h5>New This Week</h5>
                                                <h3>
                                                    {users.filter(user => {
                                                        const oneWeekAgo = new Date();
                                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                                        return new Date(user.createdAt) > oneWeekAgo;
                                                    }).length}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-warning text-white">
                                            <div className="card-body text-center">
                                                <h5>Avg Logins</h5>
                                                <h3>
                                                    {users.length > 0
                                                        ? Math.round(users.reduce((sum, user) => sum + (user.loginCount || 1), 0) / users.length)
                                                        : 0
                                                    }
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>User Info</th>
                                                <th>Registration</th>
                                                <th>Last Login</th>
                                                <th>Login Count</th>
                                                <th>Orders</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={user.id} className={user.isActive ? '' : 'table-secondary'}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div>
                                                            <strong>{user.displayName}</strong>
                                                            <br />
                                                            <small className="text-muted">{user.email}</small>
                                                            <br />
                                                            <small className="text-muted">ID: {user.id}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                            <br />
                                                            <small className="text-muted">
                                                                {new Date(user.createdAt).toLocaleTimeString()}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                                            <br />
                                                            <small className="text-muted">
                                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString() : ''}
                                                            </small>
                                                        </div>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-primary rounded-pill">
                                                            {user.loginCount || 1}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className="badge bg-success rounded-pill">
                                                            {orders.filter(order => order.userId === user.id).length}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                            {user.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => {
                                                                    const userOrders = orders.filter(order => order.userId === user.id);
                                                                    alert(`User ${user.displayName} has ${userOrders.length} orders`);
                                                                }}
                                                                title="View User Orders"
                                                            >
                                                                <FaShoppingCart />
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-warning"
                                                                onClick={() => {
                                                                    const newStatus = !user.isActive;
                                                                    const updatedUsers = users.map(u =>
                                                                        u.id === user.id ? { ...u, isActive: newStatus } : u
                                                                    );
                                                                    setUsers(updatedUsers);
                                                                    localStorage.setItem('users', JSON.stringify(updatedUsers));
                                                                    alert(`User ${newStatus ? 'activated' : 'deactivated'}`);
                                                                }}
                                                                title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => {
                                                                    if (window.confirm(`Are you sure you want to delete user ${user.email}?`)) {
                                                                        const updatedUsers = users.filter(u => u.id !== user.id);
                                                                        setUsers(updatedUsers);
                                                                        localStorage.setItem('users', JSON.stringify(updatedUsers));
                                                                        alert('User deleted successfully');
                                                                    }
                                                                }}
                                                                title="Delete User"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr>
                                                    <td colSpan="8" className="text-center text-muted py-4">
                                                        <FaUsers size={48} className="mb-3 opacity-25" />
                                                        <h5>No users found</h5>
                                                        <p>User data will appear here when users register or login to the website.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}