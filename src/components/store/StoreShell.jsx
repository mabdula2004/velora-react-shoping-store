"use client";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Plus,
  Minus,
  Check,
  PackageCheck,
  Truck,
  RefreshCcw,
} from "lucide-react";
import { useStore } from "./StoreProvider";
import { SearchDialog } from "./SearchDialog";
import { getProduct, money, totals, variantFor } from "@/lib/store/products";

export function StoreShell({ children }) {
  const store = useStore();
  const { pathname, search } = useLocation();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dialog = useRef(null);
  const count = store.cart.reduce((sum, item) => sum + item.quantity, 0);
  useEffect(() => {
    setMenu(false);
    store.setCartOpen(false);
    setSearchOpen(false);
  }, [pathname, search]);
  useEffect(() => {
    if (store.cartOpen) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [store.cartOpen]);
  return (
    <>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        A little more, on us. Complimentary delivery over PKR 10,000{" "}
        <span>THE AUTUMN EDIT — 2026</span>
      </div>
      <header className="site-header">
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/women">Women</Link>
          <Link to="/men">Men</Link>
          <Link to="/new-arrivals">New arrivals</Link>
        </nav>
        <button
          className="icon-button mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
          aria-expanded={menu}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <Link to="/" className="wordmark" aria-label="Velora home">
          VELORA<span>EVERYDAY, CONSIDERED.</span>
        </Link>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          >
            <Search />
          </button>
          <Link
            className="icon-button account-icon"
            to="/login"
            aria-label="Your account"
          >
            <UserRound />
          </Link>
          <Link
            className="icon-button"
            to="/wishlist"
            aria-label={`Wishlist, ${store.wishlist.length} items`}
          >
            <Heart />
            {store.wishlist.length > 0 && <i>{store.wishlist.length}</i>}
          </Link>
          <button
            className="icon-button"
            onClick={() => store.setCartOpen(true)}
            aria-label={`Open shopping bag, ${count} items`}
          >
            <ShoppingBag />
            {count > 0 && <i>{count}</i>}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <Link to="/women">Women</Link>
          <Link to="/men">Men</Link>
          <Link to="/new-arrivals">New arrivals</Link>
          <Link to="/login">Your account</Link>
        </nav>
      )}
      <main id="main-content">{children}</main>
      <section className="service-strip" aria-label="Shopping information">
        <div>
          <Truck />
          <span>
            Delivered to your door<small>Complimentary over PKR 10,000</small>
          </span>
        </div>
        <div>
          <RefreshCcw />
          <span>
            A little peace of mind
            <small>Explore our demo shopping experience</small>
          </span>
        </div>
        <div>
          <PackageCheck />
          <span>
            Considered essentials<small>Made for your everyday rotation</small>
          </span>
        </div>
      </section>
      <footer>
        <div className="footer-top">
          <div>
            <Link className="footer-brand" to="/">
              VELORA
            </Link>
            <p>
              Less noise. More you.
              <br />A quieter kind of everyday style.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/women">Womenswear</Link>
            <Link to="/men">Menswear</Link>
            <Link to="/new-arrivals">New arrivals</Link>
          </div>
          <div>
            <h3>Your VELORA</h3>
            <Link to="/wishlist">Your wishlist</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create an account</Link>
          </div>
          <div className="footer-note">
            <span className="eyebrow">A CONSIDERED WARDROBE</span>
            <p>
              Good pieces.
              <br />
              Endless possibilities.
            </p>
            <Link className="text-link" to="/shop">
              Discover the collection
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VELORA · A frontend portfolio concept</span>
          <span>Pakistan / PKR</span>
          <span>Demo store — no real orders or payments.</span>
        </div>
      </footer>
      {store.toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {store.toast}
        </div>
      )}
      <dialog
        ref={dialog}
        className="bag-dialog"
        onCancel={() => store.setCartOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) store.setCartOpen(false);
        }}
        aria-labelledby="bag-title"
      >
        <div className="bag-inner">
          <div className="panel-heading">
            <h2 id="bag-title">
              Your bag <small>({count})</small>
            </h2>
            <button
              className="icon-button"
              aria-label="Close shopping bag"
              onClick={() => store.setCartOpen(false)}
            >
              <X />
            </button>
          </div>
          {store.cart.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={42} />
              <h3>A little room for something good.</h3>
              <p>Your bag is waiting for your next favourite.</p>
              <Link
                className="button"
                to="/shop"
                onClick={() => store.setCartOpen(false)}
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <>
              <p className="bag-note">
                {totals(store.cart).subtotal >= 10000
                  ? "Your bag qualifies for complimentary delivery."
                  : `${money(10000 - totals(store.cart).subtotal)} away from complimentary delivery.`}
              </p>
              <div className="bag-items">
                {store.cart.map((item) => {
                  const p = getProduct(item.id);
                  return (
                    <div
                      className="bag-item"
                      key={item.id + item.size + (item.color || "")}
                    >
                      <Link
                        to={`/product?id=${p.id}`}
                        onClick={() => store.setCartOpen(false)}
                      >
                        <img
                          src={variantFor(p, item.color).image}
                          alt={p.name}
                        />
                      </Link>
                      <div>
                        <Link
                          to={`/product?id=${p.id}`}
                          onClick={() => store.setCartOpen(false)}
                        >
                          {p.name}
                        </Link>
                        <p>
                          {item.color || p.color} / {item.size}
                        </p>
                        <strong>{money(p.price)}</strong>
                        <div className="quantity">
                          <button
                            aria-label={`Decrease ${p.name} quantity`}
                            onClick={() =>
                              store.updateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1,
                                item.color,
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            disabled={item.quantity >= 10}
                            aria-label={`Increase ${p.name} quantity`}
                            onClick={() =>
                              store.updateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1,
                                item.color,
                              )
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-button"
                        aria-label={`Remove ${p.name}`}
                        onClick={() =>
                          store.updateQuantity(
                            item.id,
                            item.size,
                            0,
                            item.color,
                          )
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="bag-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(totals(store.cart).subtotal)}</strong>
                </div>
                <p>Delivery calculated at checkout. Demo purchases only.</p>
                <Link
                  className="button full"
                  to="/checkout"
                  onClick={() => store.setCartOpen(false)}
                >
                  Continue to checkout
                </Link>
                <button
                  className="text-link"
                  onClick={() => store.setCartOpen(false)}
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
