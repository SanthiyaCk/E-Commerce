import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "../../styles/AdminHome.css";

export default function AdminHome() {
  const API_URL = "https://fakestoreapi.com/products";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    stock: 5,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const withStock = data.map((p) => ({
        ...p,
        stock: Math.floor(Math.random() * 10) + 1,
      }));
      setProducts(withStock);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.title || !newProduct.price) {
      setMessage("❗ Please fill in product title and price.");
      return;
    }

    const localProduct = {
      ...newProduct,
      id: Date.now(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    };

    setProducts((prev) => [...prev, localProduct]);
    setMessage("✅ Product added successfully!");
    setNewProduct({ title: "", price: "", image: "", category: "", stock: 5 });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setMessage("🗑️ Product deleted successfully.");
  };

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (categoryFilter ? p.category === categoryFilter : true))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="admin-home">
      <h2>🛍️ Admin Product Management</h2>
      {message && <p className="message">{message}</p>}

      <form className="add-form" onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product Title"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.image}
          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <div className="filter-sort">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleDelete={() => handleDelete(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
