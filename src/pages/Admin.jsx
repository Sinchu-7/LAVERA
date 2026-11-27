
import { useEffect, useState } from "react";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setProducts(data.products || []);
    } catch {
      setMessage("Unable to load products.");
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
    setMessage("");

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

      setMessage(data.message);
      setForm(emptyProduct);
      setEditingId(null);
      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
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

      setMessage(data.message);
      await fetchProducts();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f8f3f7",
      padding: "35px 5%",
      color: "#29202b",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      color: "#806080",
      marginBottom: "25px",
    },
    form: {
      background: "white",
      padding: "25px",
      borderRadius: "15px",
      maxWidth: "750px",
      marginBottom: "35px",
      boxShadow: "0 4px 20px #0000000d",
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "8px 0 15px",
      border: "1px solid #ddd",
      borderRadius: "7px",
      boxSizing: "border-box",
    },
    button: {
      padding: "11px 20px",
      background: "#806080",
      color: "white",
      border: "none",
      borderRadius: "7px",
      cursor: "pointer",
      marginRight: "8px",
    },
  };

  return (
    <main style={styles.page}>
      <h1 style={styles.heading}>LAVERA Admin Dashboard</h1>
      <p>Manage your beauty products and inventory.</p>

      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <label>Product Name</label>
        <input style={styles.input} name="name" value={form.name}
          onChange={handleChange} required />

        <label>Description</label>
        <textarea style={styles.input} name="description"
          value={form.description} onChange={handleChange} required />

        <label>Price (₹)</label>
        <input style={styles.input} type="number" name="price"
          value={form.price} onChange={handleChange} min="0" required />

        <label>Original Price (₹)</label>
        <input style={styles.input} type="number" name="originalPrice"
          value={form.originalPrice} onChange={handleChange} min="0" />

        <label>Category</label>
        <select style={styles.input} name="category"
          value={form.category} onChange={handleChange}>
          <option>Skincare</option>
          <option>Makeup</option>
          <option>Body Care</option>
        </select>

        <label>Image URL</label>
        <input style={styles.input} name="image" value={form.image}
          onChange={handleChange} required />

        <label>Stock</label>
        <input style={styles.input} type="number" name="stock"
          value={form.stock} onChange={handleChange} min="0" required />

        <label>Rating</label>
        <input style={styles.input} type="number" name="rating"
          value={form.rating} onChange={handleChange} min="0" max="5" step="0.1" />

        <label>Number of Reviews</label>
        <input style={styles.input} type="number" name="reviews"
          value={form.reviews} onChange={handleChange} min="0" />

        <label>
          <input type="checkbox" name="featured"
            checked={form.featured} onChange={handleChange} />
          {" "}Featured Product
        </label>

        <br /><br />

        <button style={styles.button} disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" style={styles.button} onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h2>All Products ({products.length})</h2>

      {products.map((product) => (
        <div key={product._id} style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}>
          <img src={product.image} alt={product.name}
            style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "8px" }} />

          <div style={{ flex: 1 }}>
            <strong>{product.name}</strong>
            <p>₹{product.price} | Stock: {product.stock}</p>
          </div>

          <button style={styles.button} onClick={() => handleEdit(product)}>
            Edit
          </button>

          <button style={{ ...styles.button, background: "#b43e55" }}
            onClick={() => handleDelete(product._id)}>
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}

export default Admin;
