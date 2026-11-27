import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import "../styles/Categories.css";

const categories = [
  {
    name: "Skincare",
    subtitle: "Care for your natural glow",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    id: "Skincare",
    tag: "BESTSELLER",
    items: "18+ Essentials",
  },
  {
    name: "Makeup",
    subtitle: "Express your natural beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    id: "Makeup",
    tag: "TRENDING",
    items: "14+ Shades",
  },
  {
    name: "Body Care",
    subtitle: "Pamper yourself everyday",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    id: "Body Care",
    tag: "ORGANIC",
    items: "12+ Rituals",
  },
  {
    name: "Lip Care",
    subtitle: "A little love for your lips",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    id: "Skincare",
    tag: "POPULAR",
    items: "8+ Treatments",
  },
  {
    name: "Hair Care",
    subtitle: "Shine from root to tip",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
    id: "Body Care",
    tag: "PURE BOTANICALS",
    items: "10+ Formulas",
  },
  {
    name: "Fragrance",
    subtitle: "Leave an unforgettable trail",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    id: "Body Care",
    tag: "SIGNATURE",
    items: "6+ Blends",
  },
];

function Categories() {
  return (
    <section className="categories-section" id="shop">
      <div className="section-heading">
        <span>DISCOVER YOUR FAVORITES</span>
        <h2>Shop by <em>Category</em></h2>
        <p>Pure botanical formulas crafted to elevate your daily self-care ritual.</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            to={`/shop?category=${encodeURIComponent(category.id)}`}
            className="category-card"
            key={category.name}
          >
            <img src={category.image} alt={category.name} loading="lazy" />

            <div className="category-top-badge">
              <span>{category.tag}</span>
            </div>

            <div className="category-overlay">
              <div className="category-text">
                <span className="category-items-count">
                  <Sparkles size={12} /> {category.items}
                </span>
                <h3>{category.name}</h3>
                <p>{category.subtitle}</p>
              </div>

              <span className="category-arrow" aria-label={`Shop ${category.name}`}>
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;
