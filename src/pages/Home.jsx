import { Link } from "react-router-dom";
import { products } from "@/lib/store/products";
import { ProductCard } from "@/components/store/ProductCard";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE AUTUMN COLLECTION / 2026</span>
          <h1>
            A quieter
            <br />
            kind of <em>style.</em>
          </h1>
          <p>
            Considered pieces. Effortless combinations.
            <br />
            For the way you move through every day.
          </p>
          <div className="hero-buttons">
            <Link className="button" to="/women">
              Shop women
            </Link>
            <Link className="text-link" to="/men">
              Shop men
            </Link>
          </div>
          <div className="hero-bottom">
            <span>LESS, BUT BETTER.</span>
            <span>01 — 08</span>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src="/images/hero.jpg"
            alt="Autumn fashion in soft neutral tones"
            fetchPriority="high"
          />
          <div className="photo-caption">
            <span>THE ART OF EVERYDAY</span>
            <Link to="/new-arrivals">Explore the edit</Link>
          </div>
        </div>
      </section>
      <div className="collection-ribbon">
        <span>TIMELESS BY DESIGN</span>
        <i /> <span>EFFORTLESS BY NATURE</span>
        <i />
        <span>YOURS, EVERY DAY</span>
        <i />
        <span>THE VELORA WAY</span>
      </div>
      <section className="section-wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR NEXT EVERYDAY FAVOURITES</span>
            <h2>The considered edit.</h2>
          </div>
          <Link className="text-link" to="/shop">
            View all pieces
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard product={product} index={index} key={product.id} />
          ))}
        </div>
      </section>
      <section className="editorial-grid section-wrap">
        <Link to="/women" className="editorial-card">
          <img
            src="/images/women.jpg"
            alt="Relaxed womenswear styling"
            loading="lazy"
          />
          <div>
            <span className="eyebrow">THE WOMEN’S EDIT</span>
            <h2>In your element.</h2>
            <span className="editorial-link">Discover womenswear</span>
          </div>
        </Link>
        <Link to="/men" className="editorial-card">
          <img
            src="/images/men.jpg"
            alt="Everyday menswear styling"
            loading="lazy"
          />
          <div>
            <span className="eyebrow">THE MEN’S EDIT</span>
            <h2>Easy does it.</h2>
            <span className="editorial-link">Discover menswear</span>
          </div>
        </Link>
      </section>
      <section className="brand-statement">
        <span className="eyebrow">THE VELORA PHILOSOPHY</span>
        <h2>
          Style that feels like <em>you.</em>
        </h2>
        <p>
          A wardrobe built around possibility. Pieces to dress up, slow down,
          <br className="desktop-only" /> and make your own. Nothing extra.
          Everything you need.
        </p>
        <Link to="/shop" className="text-link">
          Find your everyday
        </Link>
      </section>
    </>
  );
}
