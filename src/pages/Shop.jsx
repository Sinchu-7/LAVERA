
import { useMemo, useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProductCard from "../components/ProductCard";
import "../styles/Shop.css";
import "../styles/BestSellers.css";

const categories = ["All", "Skincare", "Makeup", "Body Care"];
const API = "http://localhost:5000/api/products";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Backend server could not load products.");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        if (!Array.isArray(productList)) {
          throw new Error("Invalid product data received.");
        }

        setProducts(
          productList.map((product) => ({
            ...product,
            id: product._id || product.id,
            oldPrice: product.originalPrice || 0,
            badge: product.featured ? "BESTSELLER" : "",
          }))
        );
      } catch (err) {
        console.error("Shop product loading error:", err);
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const productCategory = (product.category || "").toLowerCase();

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        productCategory.includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  return (
    <section className="shop-page">
      <motion.div
        className="shop-heading"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span>DISCOVER YOUR BEAUTY</span>
        <h1>Our Beauty <em>Collection</em></h1>
        <p>Find your favourites and let your natural beauty shine.</p>
      </motion.div>

      <div className="shop-toolbar">
        <div className="shop-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search beauty products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="shop-sort">
          <SlidersHorizontal size={18} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Default sorting</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="shop-categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="shop-results-header">
        <p className="shop-count">
          Showing <strong>{filteredProducts.length}</strong> products
        </p>

        {(search || category !== "All" || sort !== "default") && (
          <button className="reset-filters" onClick={clearFilters}>
            Clear filters <X size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={`${category}-${search}-${sort}`}
              className="products-grid shop-products"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id || index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div className="shop-empty" key="empty">
              <ShoppingBag size={45} />
              <h2>No products found</h2>
              <p>We couldn't find anything matching your search.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}

export default Shop;
