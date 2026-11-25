
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />

        <span className="product-badge">{product.badge}</span>

        <button
          className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Toggle wishlist"
        >
          <Heart size={19} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        <button className="quick-add" onClick={handleAddToCart}>
          <ShoppingBag size={17} />
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>

        <div className="product-rating">
          <Star size={14} fill="currentColor" />
          <span>{product.rating}</span>
          <small>({product.reviews} reviews)</small>
        </div>

        <div className="product-price">
          ₹{product.price}
          {product.oldPrice && (
            <del>₹{product.oldPrice}</del>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
