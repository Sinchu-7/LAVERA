
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ProductCard from "../components/ProductCard";
import ProductDetailModal from "../components/ProductDetailModal";
import "../styles/Shop.css";
import "../styles/BestSellers.css";

const categories = ["All", "Skincare", "Makeup", "Body Care"];
const API = "http://localhost:5000/api/products";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [category, setCategory] = useState(() => searchParams.get("category") || "All");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sort, setSort] = useState(() => searchParams.get("sort") || "default");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch !== null && querySearch !== search) {
      setSearch(querySearch);
    }
    const queryCategory = searchParams.get("category");
    if (queryCategory && queryCategory !== category) {
      setCategory(queryCategory);
    }
    const querySort = searchParams.get("sort");
    if (querySort && querySort !== sort) {
      setSort(querySort);
    }
  }, [searchParams]);

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

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach((cat) => {
      if (cat !== "All") counts[cat] = 0;
    });
    products.forEach((p) => {
      if (p.category && counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const name = (product.name || "").toLowerCase();
      const productCategory = (product.category || "").toLowerCase();
      const description = (product.description || "").toLowerCase();

      const matchesSearch =
        !term ||
        name.includes(term) ||
        productCategory.includes(term) ||
        description.includes(term);

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesStock = !onlyInStock || (product.stock > 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "featured") {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    } else if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sort === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sort === "discount") {
      result.sort((a, b) => {
        const discA = (a.originalPrice || 0) - a.price;
        const discB = (b.originalPrice || 0) - b.price;
        return discB - discA;
      });
    }

    return result;
  }, [products, search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setOnlyInStock(false);
    setSort("default");
    setSearchParams({});
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
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (val === "default") next.delete("sort");
                else next.set("sort", val);
                return next;
              });
            }}
            aria-label="Sort products"
          >
            <option value="default">Default sorting</option>
            <option value="featured">Featured & Bestsellers</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Savings</option>
            <option value="newest">Newest Additions</option>
            <option value="name-asc">Alphabetical (A - Z)</option>
          </select>
        </div>
      </div>

      <div className="shop-categories">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => {
              setCategory(item);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (item === "All") next.delete("category");
                else next.set("category", item);
                return next;
              });
            }}
          >
            <span>{item}</span>
            <span className="cat-count-badge">{categoryCounts[item] ?? 0}</span>
          </button>
        ))}
        <button
          type="button"
          className={`stock-filter-pill ${onlyInStock ? "active" : ""}`}
          onClick={() => setOnlyInStock(!onlyInStock)}
        >
          ✓ In Stock Only
        </button>
      </div>

      <div className="shop-results-header">
        <p className="shop-count">
          Showing <strong>{filteredProducts.length}</strong> products
          {search.trim() && (
            <span className="search-active-pill">
              matching "<em>{search.trim()}</em>"
            </span>
          )}
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
                  <ProductCard
                    product={product}
                    onSelectProduct={setSelectedProduct}
                  />
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
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

export default Shop;
