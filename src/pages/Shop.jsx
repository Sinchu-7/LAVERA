
import { useMemo, useState } from "react";
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

const products = [
  {
    id: 1,
    name: "Lavender Glow Serum",
    category: "Skincare",
    price: 799,
    oldPrice: 999,
    rating: 4.9,
    reviews: 128,
    badge: "BESTSELLER",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700",
  },
  {
    id: 2,
    name: "Rose Water Toner",
    category: "Skincare",
    price: 549,
    oldPrice: 699,
    rating: 4.8,
    reviews: 96,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=700",
  },
  {
    id: 3,
    name: "Vitamin C Face Cream",
    category: "Skincare",
    price: 899,
    oldPrice: 1099,
    rating: 4.9,
    reviews: 154,
    badge: "TOP RATED",
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=700",
  },
  {
    id: 4,
    name: "Butterfly Lip Gloss",
    category: "Makeup",
    price: 399,
    oldPrice: 499,
    rating: 4.7,
    reviews: 82,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=700",
  },
  {
    id: 5,
    name: "Luxury Body Lotion",
    category: "Body Care",
    price: 649,
    oldPrice: 799,
    rating: 4.8,
    reviews: 74,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=700",
  },
  {
    id: 6,
    name: "Beauty Essentials",
    category: "Makeup",
    price: 499,
    oldPrice: 599,
    rating: 4.6,
    reviews: 65,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700",
  },
];

const categories = ["All", "Skincare", "Makeup", "Body Care"];

function Shop() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

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
  }, [search, category, sort]);

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
        <h1>
          Our Beauty <em>Collection</em>
        </h1>
        <p>
          Find your favourites and let your natural beauty shine.
        </p>
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
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="shop-empty"
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ShoppingBag size={45} />
            <h2>No products found</h2>
            <p>
              We couldn't find anything matching your search.
            </p>
            <button onClick={clearFilters}>
              Clear Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Shop;
