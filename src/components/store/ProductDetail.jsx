"use client";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Truck, Check } from "lucide-react";
import {
  getProduct,
  money,
  products,
  sizes,
  colorOptions,
  variantFor,
} from "@/lib/store/products";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreProvider";
export function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [error, setError] = useState("");
  const [guide, setGuide] = useState(false);
  const [added, setAdded] = useState(false);
  const { wishlist, toggleWishlist, addToCart, setCartOpen } = useStore();
  useEffect(() => {
    const p = getProduct(productId);
    setProduct(p || null);
    setColor(p?.color || "");
    setLoaded(true);
    setSize(p?.category === "Accessories" ? "One size" : "");
    setAdded(false);
    setError("");
    setGuide(false);
  }, [productId]);
  if (!loaded)
    return (
      <div className="page-wrap">
        <div className="product-detail">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="empty-state">
        <h3>That piece couldn’t be found.</h3>
        <p>Explore the collection to find your next favourite.</p>
        <Link className="button" to="/shop">
          Back to the collection
        </Link>
      </div>
    );
  const saved = wishlist.includes(product.id);
  const variant = variantFor(product, color);
  function add() {
    if (!size) {
      setError("Choose a size before adding this piece.");
      return;
    }
    if (addToCart(product.id, size, color)) {
      setError("");
      setAdded(true);
    }
  }
  return (
    <div className="page-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={product.gender === "Men" ? "/men" : "/women"}>
          {product.gender}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <div className="product-detail">
        <div className="detail-image">
          <img src={variant.image} alt={`${product.name} in ${variant.name}`} />
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {product.gender.toUpperCase()} / {product.category.toUpperCase()}
          </span>
          <h1>{product.name}</h1>
          <p className="detail-price">{money(product.price)}</p>
          <p className="detail-description">{product.description}</p>
          <div className="detail-color">
            Colour: <strong>{variant.name}</strong>
            <div className="color-options">
              {colorOptions(product).map((option) => (
                <button
                  key={option.name}
                  className={`color-chip ${color === option.name ? "selected" : ""}`}
                  style={{ background: option.swatch }}
                  aria-label={`Colour ${option.name}`}
                  aria-pressed={color === option.name}
                  onClick={() => {
                    setColor(option.name);
                    setAdded(false);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="size-heading">
            <span>
              Size: <strong>{size || "Select a size"}</strong>
            </span>
            {product.category !== "Accessories" && (
              <button onClick={() => setGuide(!guide)} aria-expanded={guide}>
                Size guide
              </button>
            )}
          </div>
          {guide && (
            <div className="size-guide">
              <p>Illustrative sizing · body chest/bust, cm</p>
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Women</th>
                    <th>Men</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["XS", "80–84", "86–90"],
                    ["S", "85–89", "91–95"],
                    ["M", "90–94", "96–100"],
                    ["L", "95–101", "101–107"],
                    ["XL", "102–108", "108–114"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="size-buttons">
            {(product.category === "Accessories" ? ["One size"] : sizes).map(
              (s) => (
                <button
                  key={s}
                  className={size === s ? "selected" : ""}
                  aria-pressed={size === s}
                  onClick={() => {
                    setSize(s);
                    setError("");
                    setAdded(false);
                  }}
                >
                  {s}
                </button>
              ),
            )}
          </div>
          <p className="inline-error" role="alert">
            {error}
          </p>
          <div className="detail-actions">
            <button className="button" onClick={add}>
              {added ? (
                <>
                  <Check size={16} /> &nbsp; Add another
                </>
              ) : (
                "Add to bag"
              )}
            </button>
            <button
              className={`heart-button ${saved ? "saved" : ""}`}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          {added && (
            <button
              className="text-link"
              style={{ marginBottom: 20 }}
              onClick={() => setCartOpen(true)}
            >
              View your bag
            </button>
          )}
          <div className="delivery-note">
            <Truck size={18} />
            Complimentary delivery on orders over PKR 10,000
          </div>
          <details open>
            <summary>Details &amp; care</summary>
            <p>
              {product.fabric}. Relaxed styling. Follow the garment label for
              care instructions. Product details and prices are illustrative for
              this frontend demo.
            </p>
          </details>
          <details>
            <summary>Delivery &amp; returns</summary>
            <p>
              This is a portfolio store. Checkout simulates an order; no
              shipment, payment or return is processed. Demo delivery is PKR
              250, or free from PKR 10,000.
            </p>
          </details>
        </div>
      </div>
      <section style={{ paddingTop: 65 }}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">A FEW GOOD PAIRINGS</span>
            <h2>You might also love.</h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
        </div>
      </section>
    </div>
  );
}
