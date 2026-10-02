"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getProduct, sizes, colorOptions } from "@/lib/store/products";
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  // React state drives the UI. Calling a setter redraws components using that value.
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [customer, setCustomer] = useState(null);
  const timer = useRef(null);
  useEffect(() => {
    // Read storage after mounting: window/localStorage do not exist on the server.
    try {
      const saved = JSON.parse(
        localStorage.getItem("velora-shopping-v1") || "{}",
      );
      setCart(
        Array.isArray(saved.cart)
          ? saved.cart.filter(
              (item) =>
                getProduct(item.id) &&
                (sizes.includes(item.size) || item.size === "One size") &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0 &&
                item.quantity <= 10,
            )
          : [],
      );
      setWishlist(
        Array.isArray(saved.wishlist)
          ? [...new Set(saved.wishlist.filter(getProduct))]
          : [],
      );
      setCustomer(sessionStorage.getItem("velora-demo-name") || null);
    } catch {
      /* A damaged storage value should never stop the storefront. */
    }
    setReady(true);
    return () => clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          "velora-shopping-v1",
          JSON.stringify({ cart, wishlist }),
        );
      } catch {
        /* Shopping still works if browser storage is disabled. */
      }
    }
  }, [cart, wishlist, ready]);
  const notify = (message) => {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3200);
  };
  function addToCart(id, size, color) {
    const product = getProduct(id);
    if (product) color = color || product.color;
    if (
      !product ||
      !colorOptions(product).some((option) => option.name === color) ||
      !(product.category === "Accessories"
        ? size === "One size"
        : sizes.includes(size))
    )
      return false;
    setCart((previous) => {
      const existing = previous.find(
        (item) =>
          item.id === id &&
          item.size === size &&
          (item.color || getProduct(item.id).color) === color,
      );
      return existing
        ? previous.map((item) =>
            item === existing
              ? { ...item, quantity: Math.min(10, item.quantity + 1) }
              : item,
          )
        : [...previous, { id, size, color, quantity: 1 }];
    });
    notify(`${product.name} added to your bag`);
    return true;
  }
  function updateQuantity(id, size, quantity, color = getProduct(id)?.color) {
    setCart((previous) =>
      quantity <= 0
        ? previous.filter(
            (item) =>
              !(
                item.id === id &&
                item.size === size &&
                (item.color || getProduct(item.id).color) === color
              ),
          )
        : previous.map((item) =>
            item.id === id &&
            item.size === size &&
            (item.color || getProduct(item.id).color) === color
              ? { ...item, quantity: Math.min(10, quantity) }
              : item,
          ),
    );
  }
  function toggleWishlist(id) {
    if (!getProduct(id)) return;
    setWishlist((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }
  function previewSignIn(name) {
    setCustomer(name);
    try {
      sessionStorage.setItem("velora-demo-name", name);
    } catch {}
  }
  function signOut() {
    setCustomer(null);
    try {
      sessionStorage.removeItem("velora-demo-name");
    } catch {}
    notify("You have left the account preview");
  }
  return (
    <StoreContext.Provider
      value={{
        cart,
        setCart,
        wishlist,
        ready,
        cartOpen,
        setCartOpen,
        toast,
        notify,
        addToCart,
        updateQuantity,
        toggleWishlist,
        customer,
        previewSignIn,
        signOut,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export const useStore = () => useContext(StoreContext);
