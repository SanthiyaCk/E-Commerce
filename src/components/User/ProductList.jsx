import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHeart, FaSearch, FaFilter, FaExclamationTriangle, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { addToCart, addToWishlist } from "../../utils/orderStorage";
import { auth } from "../../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, sortOption]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Load products from multiple sources
      const [apiProducts, adminProducts] = await Promise.all([
        fetchProductsFromAPI(),
        fetchAdminProducts()
      ]);

      // Combine both product lists
      const allProducts = [...adminProducts, ...apiProducts];
      
      // Remove duplicates based on product ID
      const uniqueProducts = allProducts.reduce((acc, product) => {
        const existingProduct = acc.find(p => p.id === product.id);
        if (!existingProduct) {
          acc.push(product);
        }
        return acc;
      }, []);

      setProducts(uniqueProducts);
      
      // Extract categories
      const allCategories = [...new Set(uniqueProducts.map(product => product.category))];
      setCategories(allCategories);

    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsFromAPI = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      return data.map(product => ({
        ...product,
        source: 'api',
        stock: Math.floor(Math.random() * 30) + 1 // Random stock between 1-30 for API products
      }));
    } catch (error) {
      console.error("Error fetching API products:", error);
      return [];
    }
  };

  const fetchAdminProducts = () => {
    try {
      const adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
      return adminProducts.map(product => ({
        ...product,
        source: 'admin',
        // Ensure all required fields are present
        rating: product.rating || { rate: 4.5, count: 0 },
        category: product.category || 'uncategorized',
        stock: product.stock || 0 // Ensure stock property exists
      }));
    } catch (error) {
      console.error("Error loading admin products:", error);
      return [];
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortOption) {
      case "price_low_high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.title.localeCompare(b.title));
        break;
      case "rating_high_low":
        filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case "stock_high_low":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      default:
        // Default sorting - keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Get stock status and color
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: "Out of Stock", color: "danger", badge: "bg-danger" };
    } else if (stock <= 5) {
      return { text: `Low Stock: ${stock}`, color: "warning", badge: "bg-warning" };
    } else if (stock <= 10) {
      return { text: `In Stock: ${stock}`, color: "info", badge: "bg-info" };
    } else {
      return { text: `In Stock: ${stock}`, color: "success", badge: "bg-success" };
    }
  };

  // Get stock icon
  const getStockIcon = (stock) => {
    if (stock === 0 || stock <= 5) {
      return <FaExclamationTriangle className="me-1" />;
    }
    return null;
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("This product is out of stock!");
      return;
    }

    const success = addToCart(user.uid, product);
    if (success) {
      alert("Product added to cart!");
    } else {
      alert("Failed to add product to cart");
    }
  };

  const handleAddToWishlist = (product) => {
    if (!user) {
      alert("Please log in to add items to wishlist");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      alert("Cannot add out-of-stock items to wishlist!");
      return;
    }

    const success = addToWishlist(user.uid, product);
    if (success) {
      alert("Product added to wishlist!");
    } else {
      alert("Product already in wishlist");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOption("");
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Products</h2>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={loadProducts}
        >
          Refresh Products
        </button>
      </div>

      {/* Search, Filter and Sort Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="input-group" style={{ width: "350px", height: "50px" }}>
            <span className="input-group-text" style={{ height: "53px" }}>
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-auto custom-filter">
          <div className="input-group">
            <span className="input-group-text">
              <FaFilter />
            </span>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-4">
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary dropdown-toggle w-90"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaSort className="me-2" />
              Sorted List: {
                sortOption === "price_low_high" ? "Price: Low to High" :
                sortOption === "price_high_low" ? "Price: High to Low" :
                sortOption === "name_asc" ? "Name: A-Z" :
                sortOption === "name_desc" ? "Name: Z-A" :
                sortOption === "rating_high_low" ? "Rating: High to Low" :
                sortOption === "stock_high_low" ? "Stock: High to Low" :
                ""
              }
            </button>
            <ul className="dropdown-menu w-100">
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("")}
                >
                  No Sorted
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("price_low_high")}
                >
                  <FaSortUp className="me-2" />
                  Price: Low to High
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("price_high_low")}
                >
                  <FaSortDown className="me-2" />
                  Price: High to Low
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("name_asc")}
                >
                  Name: A-Z
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("name_desc")}
                >
                  Name: Z-A
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("rating_high_low")}
                >
                  Rating: High to Low
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item"
                  onClick={() => handleSortChange("stock_high_low")}
                >
                  Stock: High to Low
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory !== "all" || sortOption) && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <small className="text-muted">Active filters:</small>
              {searchTerm && (
                <span className="badge bg-primary">
                  Search: {searchTerm}
                  <button 
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => setSearchTerm("")}
                  ></button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="badge bg-info">
                  Category: {selectedCategory}
                  <button 
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => setSelectedCategory("all")}
                  ></button>
                </span>
              )}
              {sortOption && (
                <span className="badge bg-warning text-dark">
                  Sort: {
                    sortOption === "price_low_high" ? "Price: Low to High" :
                    sortOption === "price_high_low" ? "Price: High to Low" :
                    sortOption === "name_asc" ? "Name: A-Z" :
                    sortOption === "name_desc" ? "Name: Z-A" :
                    sortOption === "rating_high_low" ? "Rating: High to Low" :
                    "Stock: High to Low"
                  }
                  <button 
                    className="btn-close ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => setSortOption("")}
                  ></button>
                </span>
              )}
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Count with Stock Summary */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="mb-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </h5>
          <div className="d-flex gap-3 flex-wrap">
            <small className="text-success">
              <strong>
                {filteredProducts.filter(p => p.stock > 10).length} High Stock
              </strong>
            </small>
            <small className="text-info">
              <strong>
                {filteredProducts.filter(p => p.stock > 5 && p.stock <= 10).length} Medium Stock
              </strong>
            </small>
            <small className="text-warning">
              <strong>
                {filteredProducts.filter(p => p.stock > 0 && p.stock <= 5).length} Low Stock
              </strong>
            </small>
            <small className="text-danger">
              <strong>
                {filteredProducts.filter(p => p.stock === 0).length} Out of Stock
              </strong>
            </small>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <FaSearch size={48} className="text-muted mb-3" />
          <h5>No products found</h5>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
          <button 
            className="btn btn-primary"
            onClick={clearAllFilters}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div className="card h-100 product-card">
                  <div 
                    className="card-img-top position-relative"
                    style={{ 
                      height: "250px", 
                      cursor: product.stock > 0 ? "pointer" : "not-allowed",
                      background: "#f8f9fa",
                      overflow: "hidden"
                    }}
                    onClick={() => product.stock > 0 && handleProductClick(product.id)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "1rem",
                        transition: "transform 0.3s ease",
                        filter: product.stock === 0 ? "grayscale(100%)" : "none"
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x250/ffffff/666666?text=Product+Image";
                      }}
                    />
                    
                    {/* Stock Status Badge */}
                    <span className={`position-absolute top-0 start-0 badge ${stockStatus.badge} m-2`}>
                      {getStockIcon(product.stock)}
                      {stockStatus.text}
                    </span>

                    {/* Admin Product Badge */}
                    {product.source === 'admin' && (
                      <span className="position-absolute top-0 end-0 badge bg-success m-2">
                        Store Product
                      </span>
                    )}
                    
                    {/* API Product Badge */}
                    {product.source === 'api' && (
                      <span className="position-absolute top-0 end-0 badge bg-info m-2">
                        Featured
                      </span>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {product.stock === 0 && (
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <div className="bg-dark bg-opacity-75 text-white px-3 py-2 rounded">
                          <FaExclamationTriangle size={24} className="mb-2" />
                          <div>Out of Stock</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h6 
                      className="card-title cursor-pointer"
                      style={{ cursor: product.stock > 0 ? "pointer" : "not-allowed" }}
                      onClick={() => product.stock > 0 && handleProductClick(product.id)}
                    >
                      {product.title}
                    </h6>
                    
                    <p className="card-text text-muted small flex-grow-1">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </p>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h5 text-primary mb-0">
                        ₹ {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}
                      </span>
                      <div className="d-flex align-items-center">
                        <span className="text-warning me-1">
                          ⭐
                        </span>
                        <small className="text-muted">
                          {product.rating?.rate || 4.5} ({product.rating?.count || 0})
                        </small>
                      </div>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Stock Level</small>
                        <small className={`text-${stockStatus.color} fw-bold`}>
                          {stockStatus.text}
                        </small>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div 
                          className={`progress-bar bg-${stockStatus.color}`}
                          style={{ 
                            width: `${product.stock > 30 ? 100 : (product.stock / 30) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <small className="text-muted mb-3 d-block">
                      Category: {product.category}
                    </small>

                    <div className="d-grid gap-2">
                      <button
                        className={`btn btn-${product.stock > 0 ? "primary" : "secondary"} btn-sm`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <FaShoppingCart className="me-2" />
                        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleAddToWishlist(product)}
                        disabled={product.stock === 0}
                      >
                        <FaHeart className="me-2" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;