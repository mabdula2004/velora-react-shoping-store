import { useEffect } from "react";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { StoreProvider } from "@/components/store/StoreProvider";
import { StoreShell } from "@/components/store/StoreShell";
import { Catalog } from "@/components/store/Catalog";
import { ProductDetail } from "@/components/store/ProductDetail";
import { AuthForm } from "@/components/store/AuthForm";
import { Checkout } from "@/components/store/Checkout";
import Home from "@/pages/Home";

function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    // Client-side navigation keeps React state, so reset scroll explicitly.
    window.scrollTo({ top: 0 });
    const titles = {
      "/": "A quieter kind of style",
      "/shop": "The Collection",
      "/men": "Menswear",
      "/women": "Womenswear",
      "/new-arrivals": "New Arrivals",
      "/wishlist": "Your Wishlist",
      "/product": "Discover a Piece",
      "/login": "Sign In",
      "/register": "Create an Account",
      "/checkout": "Checkout",
    };
    document.title = `${titles[location.pathname] || "Page Not Found"} | VELORA`;
  }, [location.pathname, location.search]);
  return null;
}
const Router =
  import.meta.env.VITE_OFFLINE_PREVIEW === "1" ? HashRouter : BrowserRouter;

export default function App() {
  // Router chooses the screen; Provider shares shopping state across all screens.
  return (
    <Router>
      <StoreProvider>
        <RouteEffects />
        <StoreShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Catalog />} />
            <Route path="/men" element={<Catalog collection="Men" />} />
            <Route path="/women" element={<Catalog collection="Women" />} />
            <Route path="/new-arrivals" element={<Catalog arrivals />} />
            <Route path="/wishlist" element={<Catalog wishlistOnly />} />
            <Route path="/product" element={<ProductDetail />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="*"
              element={
                <section className="empty-state">
                  <h3>That page wandered off.</h3>
                  <p>Find your way back to the collection.</p>
                  <Link className="button" to="/shop">
                    Explore VELORA
                  </Link>
                </section>
              }
            />
          </Routes>
        </StoreShell>
      </StoreProvider>
    </Router>
  );
}
