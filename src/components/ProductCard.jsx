
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("lavera-wishlist") || "[]"
    );

    return saved.some((item) => item.id === product.id);
  });

  const [added, setAdded] = useState(false);

  const handleWishlist = () => {
    const saved = JSON.parse(
      localStorage.getItem("lavera-wishlist") || "[]"
    );

    let updated;

    if (isWishlisted) {
      updated = saved.filter((item) => item.id !== product.id);
    } else {
      updated = [...saved, product];
    }

    localStorage.setItem("lavera-wishlist", JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(
      localStorage.getItem("lavera-cart") || "[]"
    );

    const existing = cart.find((item) => item.id === product.id);

    let updated;

    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("lavera-cart", JSON.stringify(updated));

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
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <Heart
            size={19}
            fill={isWishlisted ? "currentColor" : "none"}
          />
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
          {product.oldPrice && <del>₹{product.oldPrice}</del>}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
