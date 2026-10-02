// Plain JavaScript data: later, replace this array with products from your API.
export const products = [
  {
    id: "everyday-knit",
    name: "The Everyday Knit",
    category: "Knitwear",
    gender: "Women",
    price: 4290,
    image: "/images/shirt.jpg",
    color: "Taupe",
    swatch: "#b2a091",
    tag: "BESTSELLER",
    fabric: "Cotton blend",
    description:
      "A soft, relaxed knit with an easy silhouette. Layer it up or wear it on its own for a quiet everyday look.",
  },
  {
    id: "tailored-coat",
    name: "The Trench Coat",
    category: "Outerwear",
    gender: "Women",
    price: 12990,
    image: "/images/coat.jpg",
    color: "Oat",
    swatch: "#b59c83",
    tag: "NEW SEASON",
    fabric: "Cotton blend",
    description:
      "A considered outer layer with softly structured shoulders and an effortless longline cut.",
  },
  {
    id: "essential-knit",
    name: "The Essential Knit",
    category: "Knitwear",
    gender: "Men",
    price: 6490,
    image: "/images/knit.jpg",
    color: "Cream",
    swatch: "#e2dfd0",
    tag: "THE ESSENTIALS",
    fabric: "Cotton knit",
    description:
      "A textured knit made for cooler days. A comfortable shape that works just as well on its own as it does layered.",
  },
  {
    id: "city-trousers",
    name: "The City Trousers",
    category: "Trousers",
    gender: "Men",
    price: 5490,
    image: "/images/trousers.jpg",
    color: "Grey",
    swatch: "#7d7e77",
    tag: "",
    fabric: "Cotton blend",
    description:
      "Relaxed tailoring, everyday ease. A straight leg and an understated finish bring a little intention to every outfit.",
  },
  {
    id: "weekend-shirt",
    name: "The Weekend Shirt",
    category: "Shirts",
    gender: "Men",
    price: 4990,
    image: "/images/mens-shirt.jpg",
    color: "White",
    swatch: "#f0ede6",
    tag: "NEW SEASON",
    fabric: "Cotton",
    description:
      "The shirt you reach for on repeat. An open, relaxed fit that moves easily between workdays and weekends.",
  },
  {
    id: "evening-dress",
    name: "The Evening Dress",
    category: "Dresses",
    gender: "Women",
    price: 8490,
    image: "/images/dress.jpg",
    color: "Black",
    swatch: "#262421",
    tag: "",
    fabric: "Woven blend",
    description:
      "A quietly striking dress with clean lines and a timeless silhouette. Keep the styling simple and let the shape speak.",
  },
  {
    id: "classic-jacket",
    name: "The Relaxed Blazer",
    category: "Outerwear",
    gender: "Men",
    price: 9990,
    image: "/images/jacket.jpg",
    color: "Taupe",
    swatch: "#9d917f",
    tag: "EDITOR’S PICK",
    fabric: "Cotton blend",
    description:
      "A versatile jacket with a relaxed shape. A finishing layer for everyday combinations.",
  },
  {
    id: "daily-bag",
    colors: [
      { name: "Cognac", swatch: "#8c5738", image: "/images/bag.jpg" },
      { name: "Black", swatch: "#252525", image: "/images/bag-black.jpg" },
    ],
    name: "The Daily Bag",
    category: "Accessories",
    gender: "Women",
    price: 5990,
    image: "/images/bag.jpg",
    color: "Cognac",
    swatch: "#8c5738",
    tag: "",
    fabric: "Leather-look material",
    description:
      "Room for the essentials, with a simple shape that goes everywhere. The finishing touch for your daily rotation.",
  },
];
export const sizes = ["XS", "S", "M", "L", "XL"];
export const money = (value) => `PKR ${Number(value).toLocaleString("en-PK")}`;
export const getProduct = (id) => products.find((product) => product.id === id);
export function totals(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + (getProduct(item.id)?.price || 0) * item.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 10000 ? 0 : 250;
  return { subtotal, shipping, total: subtotal + shipping };
}

// Colour variants can each provide their own photo. Most garments have one curated colour.
export const colorOptions = (product) =>
  product.colors || [
    { name: product.color, swatch: product.swatch, image: product.image },
  ];
export const variantFor = (product, color) =>
  colorOptions(product).find((variant) => variant.name === color) ||
  colorOptions(product)[0];
