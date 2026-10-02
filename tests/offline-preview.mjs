import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const issues = [];
const log = new VirtualConsole();
log.on("jsdomError", (error) => issues.push(error.message));
const html = readFileSync("preview/velora-preview.html", "utf8");
const dom = new JSDOM(html, {
  url: "file:///preview/velora-preview.html",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  virtualConsole: log,
  beforeParse(w) {
    w.scrollTo = () => {};
    w.HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute("open", "");
    };
    w.HTMLDialogElement.prototype.close = function () {
      this.removeAttribute("open");
    };
  },
});
const w = dom.window,
  d = w.document;
const pause = () => new Promise((r) => setTimeout(r, 90));
await pause();
assert(d.querySelector("h1").textContent.includes("A quieter"));
const click = async (selector) => {
  assert(d.querySelector(selector), selector);
  d.querySelector(selector).dispatchEvent(
    new w.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }),
  );
  await pause();
};
await click('.desktop-nav a[href="#/men"]');
assert.match(d.querySelector("h1").textContent, /Men/);
await click(".catalog-grid .product-image a");
assert(d.querySelector(".detail-copy"));
assert(
  d
    .querySelector(".detail-image img")
    .src.startsWith("data:image/jpeg;base64,"),
);
await click('button[aria-label="Open search"]');
assert(d.querySelector(".search-dialog").open);
await click('button[aria-label="Close search"]');
assert(!d.querySelector(".search-dialog").open);
await click('a[aria-label="Your account"]');
await click(".google-button");
assert(d.querySelector(".google-preview"));
await click(".google-preview .button");
assert(d.body.textContent.includes("Hello, Demo Shopper"));
assert(!d.querySelector("script[src]"));
assert(!d.querySelector('link[rel="stylesheet"]'));
assert.deepEqual(issues, []);
console.log(
  "PASS: offline file renders, routes, opens products/search, embeds images and runs Google demo without a server.",
);
dom.window.close();
