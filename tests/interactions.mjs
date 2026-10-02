import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";

// Exercise the compiled production app in a local DOM; no remote browser or network.
const errors = [];
const consoleCapture = new VirtualConsole();
consoleCapture.on("jsdomError", (error) => errors.push(error.message));
const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  {
    url: "http://localhost/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: consoleCapture,
  },
);
const { window: w } = dom;
const d = w.document;
w.scrollTo = () => {};
w.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
w.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const js = readdirSync("dist/assets").find((name) => name.endsWith(".js"));
w.eval(readFileSync(`dist/assets/${js}`, "utf8"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(predicate, label) {
  for (let i = 0; i < 70; i++) {
    if (predicate()) return;
    await sleep(20);
  }
  throw new Error(`Timed out: ${label}`);
}
const q = (selector) => {
  const node = d.querySelector(selector);
  assert(node, `Missing ${selector}`);
  return node;
};
const text = () => d.body.textContent;
async function click(selector) {
  q(selector).dispatchEvent(
    new w.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
  );
  await sleep(40);
}
async function fill(selector, value) {
  const input = q(selector);
  Object.getOwnPropertyDescriptor(
    w.HTMLInputElement.prototype,
    "value",
  ).set.call(input, value);
  input.dispatchEvent(new w.Event("input", { bubbles: true }));
  input.dispatchEvent(new w.Event("change", { bubbles: true }));
  await sleep(35);
}
let passed = 0;
function pass(label) {
  passed++;
  console.log(`PASS ${passed}: ${label}`);
}
await until(() => text().includes("A quieter"), "initial render");
await click('.desktop-nav a[href="/men"]');
await until(() => q("h1").textContent.includes("Men"), "men route");
assert.equal(d.querySelectorAll(".catalog-grid article").length, 4);
pass("Men click opens menswear with 4 products");
await click('.desktop-nav a[href="/women"]');
assert.match(q("h1").textContent, /Women/);
assert.equal(d.querySelectorAll(".catalog-grid article").length, 4);
pass("Women click switches collection");
await click('.desktop-nav a[href="/new-arrivals"]');
assert.match(q("h1").textContent, /Just arrived/);
assert.equal(d.querySelectorAll(".catalog-grid article").length, 2);
pass("New arrivals route filters the catalog");
await click('button[aria-label="Toggle navigation"]');
assert(d.querySelector(".mobile-nav"));
await click('.mobile-nav a[href="/men"]');
assert(!d.querySelector(".mobile-nav"));
pass("Mobile menu opens, navigates and closes");
await click('button[aria-label="Open search"]');
assert(q(".search-dialog").hasAttribute("open"));
pass("Search icon opens search dialog");
await fill('input[aria-label="Search the collection"]', "coat");
assert.equal(d.querySelectorAll(".search-results a").length, 1);
pass("Search updates matching products while typing");
await fill('input[aria-label="Search the collection"]', "zzzz");
assert.equal(d.querySelectorAll(".search-results a").length, 0);
assert(text().includes("No matches yet"));
pass("Search empty-state feedback");
await fill('input[aria-label="Search the collection"]', "knit");
q(".search-dialog-form").dispatchEvent(
  new w.Event("submit", { bubbles: true, cancelable: true }),
);
await sleep(70);
assert.equal(d.querySelectorAll(".catalog-grid article").length, 2);
assert(!q(".search-dialog").hasAttribute("open"));
pass("Search submit opens a filtered results page");
await click(".catalog-grid .product-image a");
await until(() => d.querySelector(".detail-copy"), "product detail");
assert.match(q("h1").textContent, /Everyday Knit/);
pass("Product image opens product detail");
await click(".detail-actions .button");
assert(text().includes("Choose a size before"));
pass("Add-to-bag requires a size");
await click(".size-buttons button:nth-child(3)");
await click(".detail-actions .button");
await click('button[aria-label^="Open shopping bag"]');
assert.match(q(".bag-items").textContent, /Taupe\s*\/\s*M/);
pass("Selected size appears in bag");
await click('button[aria-label="Increase The Everyday Knit quantity"]');
assert(q(".bag-summary").textContent.includes("8,580"));
pass("Quantity control recalculates subtotal");
const saved = JSON.parse(w.localStorage.getItem("velora-shopping-v1"));
assert.equal(saved.cart[0].quantity, 2);
pass("Cart persists to browser-local storage");
await click('button[aria-label="Close shopping bag"]');
await click(".detail-actions .heart-button");
assert.equal(
  JSON.parse(w.localStorage.getItem("velora-shopping-v1")).wishlist.length,
  1,
);
pass("Wishlist toggle persists");
await click('a[aria-label="Your account"]');
await click(".google-button");
assert(text().includes("Google sign-in · Design preview"));
await click(".google-preview .button");
assert(text().includes("Hello, Demo Shopper"));
pass("Continue with Google opens a working demo account flow");
await click(".form-success button");
assert(d.querySelector(".google-button"));
pass("Account preview signs out");
await click('button[aria-label^="Open shopping bag"]');
await click('.bag-summary a[href="/checkout"]');
await until(() => d.querySelector(".checkout-form"), "checkout");
assert(!q(".checkout-form").checkValidity());
pass("Checkout blocks empty required fields");
for (const [name, value] of Object.entries({
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "Shopper",
  address: "12 Sample Street",
  city: "Lahore",
  postcode: "54000",
  phone: "03001234567",
}))
  await fill(`[name="${name}"]`, value);
q('.checkout-form input[type="checkbox"]').checked = true;
assert(q(".checkout-form").checkValidity());
q(".checkout-form").dispatchEvent(
  new w.Event("submit", { bubbles: true, cancelable: true }),
);
await until(
  () => text().includes("That’s a lovely choice."),
  "order confirmation",
);
await until(
  () =>
    JSON.parse(w.localStorage.getItem("velora-shopping-v1")).cart.length === 0,
  "cart storage cleared",
);
pass("Valid demo checkout confirms order and clears bag");
assert.deepEqual(errors, []);
console.log(
  `\n${passed} production-bundle interaction checks passed. Browser layout/focus testing is separate.`,
);
dom.window.close();
