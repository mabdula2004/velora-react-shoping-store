"use client";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useStore } from "./StoreProvider";
import { getProduct, money, totals, variantFor } from "@/lib/store/products";
export function Checkout() {
  const { cart, setCart, ready } = useStore();
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const bill = totals(cart);
  function placeOrder(event) {
    event.preventDefault();
    if (submitting || !cart.length) return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone")).replace(/[\s()-]/g, "");
    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      setError("Enter a phone number with 10–15 digits.");
      return;
    }
    if (
      ["firstName", "lastName", "address", "city", "postcode"].some(
        (key) => !String(data.get(key) || "").trim(),
      )
    ) {
      setError("Complete all delivery fields.");
      return;
    }
    setError("");
    setSubmitting(true);
    // A short demo loading state, then a local confirmation. No API/payment is called.
    timer.current = setTimeout(() => {
      const summary = {
        number: `VEL-${Date.now().toString(36).toUpperCase()}`,
        total: bill.total,
        count: cart.reduce((n, item) => n + item.quantity, 0),
      };
      setOrder(summary);
      setCart([]);
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
  }
  if (!ready)
    return (
      <div className="loading-page" role="status">
        Preparing your bag…
      </div>
    );
  if (order)
    return (
      <section className="order-success">
        <div className="success-icon">
          <Check size={30} />
        </div>
        <span className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</span>
        <h1>That’s a lovely choice.</h1>
        <p>
          Your demo order is complete. No payment was taken, and nothing will be
          shipped.
        </p>
        <div className="order-id">
          <strong>{order.number}</strong>
          <br />
          {order.count} {order.count === 1 ? "piece" : "pieces"} ·{" "}
          {money(order.total)}
        </div>
        <p>Thanks for exploring VELORA.</p>
        <Link className="button" to="/shop">
          Continue exploring
        </Link>
      </section>
    );
  if (!cart.length)
    return (
      <section className="empty-state">
        <ShoppingBag size={42} />
        <h3>Your bag is taking a little break.</h3>
        <p>Add a piece from the collection before checking out.</p>
        <Link className="button" to="/shop">
          Explore the collection
        </Link>
      </section>
    );
  return (
    <div className="page-wrap">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/shop">Collection</Link>
        <span>/</span>
        <span>Checkout</span>
      </nav>
      <div className="page-heading">
        <span className="eyebrow">ONE LAST THING</span>
        <h1>Make it yours.</h1>
        <p>Demo checkout — use sample details. No real orders or payments.</p>
      </div>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={placeOrder}>
          <h2>01 / Contact</h2>
          <label className="field">
            Email address
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <h2>02 / Delivery details</h2>
          <div className="form-grid">
            <label className="field">
              First name
              <input
                name="firstName"
                autoComplete="given-name"
                required
                maxLength={80}
              />
            </label>
            <label className="field">
              Last name
              <input
                name="lastName"
                autoComplete="family-name"
                required
                maxLength={80}
              />
            </label>
            <label className="field span-two">
              Street address
              <input
                name="address"
                autoComplete="street-address"
                placeholder="House number and street"
                required
                maxLength={200}
              />
            </label>
            <label className="field">
              City
              <input
                name="city"
                autoComplete="address-level2"
                required
                maxLength={80}
              />
            </label>
            <label className="field">
              Postal code
              <input
                name="postcode"
                autoComplete="postal-code"
                inputMode="numeric"
                pattern="[0-9]{5}"
                title="Enter a 5-digit postal code"
                required
              />
            </label>
            <label className="field">
              Country
              <select name="country" autoComplete="country-name">
                <option>Pakistan</option>
              </select>
            </label>
            <label className="field">
              Phone number
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="0300 1234567"
                required
              />
            </label>
          </div>
          <h2>03 / Payment preview</h2>
          <div className="demo-note" style={{ marginTop: 0, marginBottom: 20 }}>
            Demo order · No payment required. Your contact and delivery details
            are not saved or submitted.
          </div>
          <label className="check-label">
            <input type="checkbox" required />I understand this order is a demo
            and will not be fulfilled.
          </label>
          <p className="inline-error" role="alert" style={{ marginTop: 16 }}>
            {error}
          </p>
          <button className="button full" type="submit" disabled={submitting}>
            {submitting
              ? "Preparing your confirmation…"
              : `Place demo order · ${money(bill.total)}`}
          </button>
        </form>
        <aside className="order-summary">
          <h2>In your bag</h2>
          {cart.map((item) => {
            const p = getProduct(item.id);
            return (
              <div
                className="summary-item"
                key={item.id + item.size + (item.color || "")}
              >
                <img src={variantFor(p, item.color).image} alt={p.name} />
                <div>
                  {p.name}
                  <small>
                    {item.color || p.color} / {item.size} · Qty {item.quantity}
                  </small>
                </div>
                <span>{money(p.price * item.quantity)}</span>
              </div>
            );
          })}
          <div className="totals-list">
            <div>
              <span>Subtotal</span>
              <span>{money(bill.subtotal)}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>
                {bill.shipping === 0 ? "Complimentary" : money(bill.shipping)}
              </span>
            </div>
            <div className="grand-total">
              <strong>Total</strong>
              <strong>{money(bill.total)}</strong>
            </div>
          </div>
          <p className="demo-note">
            All prices are in PKR. This is a fictional catalog for a frontend
            portfolio project.
          </p>
        </aside>
      </div>
    </div>
  );
}
