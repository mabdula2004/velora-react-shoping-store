"use client";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import { products } from "@/lib/store/products";
import { ProductCard } from "./ProductCard";
import { useStore } from "./StoreProvider";
export function Catalog({
  wishlistOnly = false,
  collection = "All",
  arrivals = false,
}) {
  const { wishlist, ready } = useStore();
  const [searchParams] = useSearchParams();
  const queryKey = searchParams.toString();
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState(collection);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [newOnly, setNewOnly] = useState(arrivals);
  useEffect(() => {
    const params = new URLSearchParams(queryKey);
    setGender(
      ["Women", "Men"].includes(params.get("gender"))
        ? params.get("gender")
        : collection,
    );
    setSearch(params.get("q") || "");
    setCategory("All");
    setNewOnly(arrivals || params.get("new") === "1");
  }, [queryKey, collection, arrivals]);
  // Derived values do not need their own state. Filter -> sort -> render with map().
  const filtered = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (!wishlistOnly || wishlist.includes(p.id)) &&
            (gender === "All" || p.gender === gender) &&
            (category === "All" || p.category === category) &&
            (!newOnly || p.tag === "NEW SEASON") &&
            `${p.name} ${p.category} ${p.color} ${p.gender}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : sort === "name"
                ? a.name.localeCompare(b.name)
                : 0,
        ),
    [wishlist, wishlistOnly, gender, category, newOnly, search, sort],
  );
  function reset() {
    setSearch("");
    setGender(collection);
    setCategory("All");
    setSort("featured");
    setNewOnly(arrivals);
  }
  return (
    <div className="page-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>{wishlistOnly ? "Wishlist" : "The collection"}</span>
      </nav>
      <div className="page-heading">
        <span className="eyebrow">
          {wishlistOnly ? "KEPT CLOSE" : "THE AUTUMN COLLECTION / 2026"}
        </span>
        <h1>
          {wishlistOnly
            ? "Your favourites."
            : newOnly
              ? "Just arrived."
              : gender === "All"
                ? "Everyday, considered."
                : `${gender}’s collection.`}
        </h1>
        <p>
          {wishlistOnly
            ? "The pieces you keep coming back to. Saved here for whenever you’re ready."
            : "Good pieces. Endless possibilities. Find the ones that feel like you."}
        </p>
      </div>
      <div className="shop-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search pieces, colours…"
            aria-label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="filter-row">
          <select
            aria-label="Filter by collection"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="All">All collections</option>
            <option>Women</option>
            <option>Men</option>
          </select>
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {[...new Set(products.map((p) => p.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>
      <div className="section-heading">
        <p className="results-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          {newOnly ? " · New arrivals" : ""}
        </p>
        <button className="text-link" onClick={reset}>
          Reset filters
        </button>
      </div>
      {wishlistOnly && !ready ? (
        <div className="product-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="product-grid catalog-grid">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {wishlistOnly ? <Heart size={42} /> : <Search size={42} />}
          <h3>
            {wishlistOnly && wishlist.length === 0
              ? "Keep your favourites close."
              : "Nothing here just yet."}
          </h3>
          <p>
            {wishlistOnly && wishlist.length === 0
              ? "Tap the heart on any piece to save it to your wishlist."
              : "Try a different search or reset your filters."}
          </p>
          {wishlistOnly && wishlist.length === 0 ? (
            <Link to="/shop" className="button">
              Explore the collection
            </Link>
          ) : (
            <button className="button" onClick={reset}>
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
