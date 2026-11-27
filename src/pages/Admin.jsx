import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  PlusCircle,
  Boxes,
  BarChart3,
  ExternalLink,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import "../styles/Admin.css";

const API = "http://localhost:5000/api/products";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "Skincare",
  image: "",
  stock: "",
  rating: "0",
  reviews: "0",
  featured: false,
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [imgLoadError, setImgLoadError] = useState(false);

  const autoFillSample = () => {
    const samples = [
      {
        name: "Wild Lavender Glow Elixir",
        description: "Intense botanical facial oil with organic lavender and squalane for radiant skin.",
        price: "849",
        originalPrice: "1099",
        category: "Skincare",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
        stock: "25",
        rating: "4.9",
        reviews: "38",
        featured: true,
      },
      {
        name: "Berry Velvet Lip Tint",
        description: "Hydrating tinted butter balm infused with rosehip and sheer berry pigments.",
        price: "499",
        originalPrice: "649",
        category: "Makeup",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
        stock: "40",
        rating: "4.8",
        reviews: "52",
        featured: false,
      },
      {
        name: "Silk Lavender Body Polish",
        description: "Gentle exfoliating body scrub infused with Himalayan salts and lavender oil.",
        price: "699",
        originalPrice: "899",
        category: "Body Care",
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
        stock: "18",
        rating: "4.7",
        reviews: "29",
        featured: true,
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setForm(picked);
    setImgLoadError(false);
    showToast("Sample product template loaded!");
  };

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setProducts(data.products || data.data || []);
    } catch {
      showToast("Unable to connect to backend server.", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice || 0),
        stock: Number(form.stock),
        rating: Number(form.rating || 0),
        reviews: Number(form.reviews || 0),
      };

      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      showToast(data.message || (editingId ? "Product updated" : "Product created"), "success");
      setForm(emptyProduct);
      setEditingId(null);
      setActiveTab("products");
      await fetchProducts();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      originalPrice: product.originalPrice ?? "",
      category: product.category || "Skincare",
      image: product.image || "",
      stock: product.stock ?? "",
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      featured: product.featured || false,
    });
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      showToast(data.message || "Product deleted", "success");
      await fetchProducts();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
    setActiveTab("products");
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-brand">
          <h1>🦋 LAVÉRA</h1>
          <span className="admin-badge">ADMIN CONSOLE</span>
        </div>

        <div className="admin-header-actions">
          <Link to="/" className="store-link-btn">
            View Live Store <ExternalLink size={14} />
          </Link>
        </div>
      </header>

      <main className="admin-main">
        {/* Navigation Tabs */}
        <nav className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={17} /> Products Directory ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            <PlusCircle size={17} /> {editingId ? "Edit Product" : "Add Product"}
          </button>
        </nav>

        {/* Feedback Alert Banner */}
        {message.text && (
          <div className={`admin-toast-banner ${message.type}`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Content: Products Table */}
        {activeTab === "products" && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h2>Product Catalog ({products.length})</h2>
              <button
                className="action-edit-btn"
                onClick={() => { setForm(emptyProduct); setEditingId(null); setActiveTab("add"); }}
              >
                <PlusCircle size={15} /> Add New Product
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#8c7b99" }}>
                        No products available in database. Add your first product to begin!
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id || product.id}>
                        <td>
                          <div className="table-product-cell">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="table-product-thumb"
                            />
                            <div>
                              <strong>{product.name}</strong>
                              {product.featured && (
                                <span style={{ marginLeft: 8, fontSize: 10, color: "#70469b" }}>✦ FEATURED</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="table-category-pill">{product.category}</span>
                        </td>
                        <td>
                          <strong>₹{product.price}</strong>
                          {product.originalPrice > product.price && (
                            <del style={{ marginLeft: 6, color: "#aaa", fontSize: 12 }}>
                              ₹{product.originalPrice}
                            </del>
                          )}
                        </td>
                        <td>
                          <span
                            className={`table-stock-badge ${
                              product.stock === 0
                                ? "out-of-stock"
                                : product.stock <= 5
                                ? "low-stock"
                                : "in-stock"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock <= 5
                              ? `Low: ${product.stock}`
                              : `${product.stock} units`}
                          </span>
                        </td>
                        <td>★ {Number(product.rating || 0).toFixed(1)} ({product.reviews || 0})</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-edit-btn"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              className="action-delete-btn"
                              onClick={() => handleDelete(product._id || product.id)}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Add / Edit Product */}
        {activeTab === "add" && (
          <div className="admin-card" style={{ maxWidth: 850, margin: "0 auto" }}>
            <div className="admin-card-header">
              <h2>{editingId ? "Edit Product Details" : "Create New Beauty Product"}</h2>
              {!editingId && (
                <button
                  type="button"
                  className="action-edit-btn"
                  onClick={autoFillSample}
                  style={{ background: "#f5edf9" }}
                >
                  <Sparkles size={14} /> Auto-fill Sample Product
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Lavender Infused Overnight Serum"
                    required
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe product formulation and skin benefits..."
                    rows={3}
                    required
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 799"
                    required
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Original / Old Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 999"
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  >
                    <option value="Skincare">Skincare</option>
                    <option value="Makeup">Makeup</option>
                    <option value="Body Care">Body Care</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Stock Inventory *</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="Available units"
                    required
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Image URL *</label>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={(e) => { handleChange(e); setImgLoadError(false); }}
                      placeholder="https://images.unsplash.com/..."
                      required
                      style={{ flex: 1, padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                    />
                    {form.image && (
                      <div style={{ width: 50, height: 50, borderRadius: 10, overflow: "hidden", border: "1px solid #ebdcf5", background: "#f6effb", flexShrink: 0 }}>
                        <img
                          src={form.image}
                          alt="Preview"
                          onError={() => setImgLoadError(true)}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                  {imgLoadError && (
                    <small style={{ color: "#dc2626", marginTop: 4, display: "block" }}>
                      Warning: Could not preview image at this URL
                    </small>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Rating (0 - 5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Reviews Count</label>
                  <input
                    type="number"
                    name="reviews"
                    value={form.reviews}
                    onChange={handleChange}
                    min="0"
                    style={{ width: "100%", padding: "11px 14px", border: "1px solid #ebdcf5", borderRadius: 10, outline: "none" }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                  <input
                    type="checkbox"
                    id="featured-check"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                  />
                  <label htmlFor="featured-check" style={{ fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Mark as Featured / Bestseller Collection
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#70469b",
                    color: "white",
                    border: "none",
                    padding: "13px 28px",
                    borderRadius: 25,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {loading ? "Saving..." : editingId ? "Update Product" : "Save Product"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{
                      background: "#f1e4fb",
                      color: "#70469b",
                      border: "none",
                      padding: "13px 24px",
                      borderRadius: 25,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;
