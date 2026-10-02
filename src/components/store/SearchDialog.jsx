import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { products, money } from "@/lib/store/products";

export function SearchDialog({ open, onClose }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const matches = products.filter((product) =>
    `${product.name} ${product.category} ${product.gender} ${product.color}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
      input.current.focus();
    } else dialog.current?.close();
  }, [open]);
  function submit(event) {
    event.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  }
  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="search-title"
    >
      <div className="search-dialog-inner">
        <div className="panel-heading">
          <h2 id="search-title">Find your next favourite.</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close search"
          >
            <X />
          </button>
        </div>
        <form className="search-dialog-form" onSubmit={submit}>
          <Search size={21} />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try knitwear, a coat, or a bag…"
            aria-label="Search the collection"
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>
        <p className="search-result-label" aria-live="polite">
          {query
            ? `${matches.length} matching pieces`
            : "Explore the collection"}
        </p>
        <div className="search-results">
          {matches.map((product) => (
            <Link
              to={`/product?id=${product.id}`}
              key={product.id}
              onClick={onClose}
            >
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <span>
                  {product.gender} · {product.color}
                </span>
              </div>
              <span>{money(product.price)}</span>
            </Link>
          ))}
        </div>
        {!matches.length && (
          <div className="empty-state">
            <h3>No matches yet.</h3>
            <p>Try “knit”, “shirt” or “bag”.</p>
            <button className="text-link" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
