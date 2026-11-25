
import { ArrowUpRight } from "lucide-react";
import "../styles/Categories.css";

const categories = [
  {
    name: "Skincare",
    subtitle: "Care for your natural glow",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    id: "skincare",
  },
  {
    name: "Makeup",
    subtitle: "Express your beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    id: "makeup",
  },
  {
    name: "Lip Care",
    subtitle: "A little love for your lips",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    id: "lipcare",
  },
  {
    name: "Hair Care",
    subtitle: "Shine from root to tip",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
    id: "haircare",
  },
  {
    name: "Body Care",
    subtitle: "Pamper yourself daily",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600",
    id: "bodycare",
  },
  {
    name: "Fragrance",
    subtitle: "Leave a beautiful impression",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
    id: "fragrance",
  },
];

function Categories() {
  return (
    <section className="categories-section" id="shop">
      <div className="section-heading">
        <span>DISCOVER YOUR FAVORITES</span>
        <h2>Shop by <em>Category</em></h2>
        <p>Everything you need to feel beautiful, inside and out.</p>
      </div>

      <div className="categories-grid">
        {categories.map((category, index) => (
          <a
            href={`#${category.id}`}
            className="category-card"
            key={category.id}
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <img src={category.image} alt={category.name} />

            <div className="category-overlay">
              <div>
                <h3>{category.name}</h3>
                <p>{category.subtitle}</p>
              </div>

              <span className="category-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Categories;
