"use client";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { money } from "@/lib/store/products";
import { useStore } from "./StoreProvider";
export function ProductCard({ product, index = 0 }) {
  const { wishlist, toggleWishlist } = useStore();
  const navigate = useNavigate();
  const saved = wishlist.includes(product.id);
  return (
    <article
      className="product-card reveal"
      onClick={(event) => {
        if (!event.target.closest("a,button"))
          navigate(`/product?id=${product.id}`);
      }}
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
    >
      <div className="product-image">
        <Link to={`/product?id=${product.id}`} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button
          className={`heart-button ${saved ? "saved" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <Link className="card-shop" to={`/product?id=${product.id}`}>
          Choose your size
        </Link>
      </div>
      <div className="product-info">
        <div>
          <Link to={`/product?id=${product.id}`}>{product.name}</Link>
          <p>
            {product.gender} · {product.color}
          </p>
        </div>
        <span>{money(product.price)}</span>
      </div>
      <div className="swatch-label">
        <i style={{ background: product.swatch }} />
        <small>{product.color}</small>
      </div>
    </article>
  );
}
