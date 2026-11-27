
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../styles/BestSellers.css";

const products = [
  {
    id: 1,
    name: "Lavender Glow Serum",
    category: "SKINCARE",
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
    category: "FACE CARE",
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
    category: "MOISTURIZER",
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
    category: "LIP CARE",
    price: 399,
    oldPrice: 499,
    rating: 4.7,
    reviews: 82,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=700",
  },
];

function BestSellers() {
  return (
    <section className="bestsellers-section" id="collections">
      <div className="section-heading">
        <span>LOVED BY OUR COMMUNITY</span>
        <h2>Our Best <em>Sellers</em></h2>
        <p>Discover the little luxuries everyone is falling in love with.</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <div className="view-all-container">
        <Link to="/shop" className="view-all-button">
          Explore All Products →
        </Link>
      </div>
    </section>
  );
}

export default BestSellers;
