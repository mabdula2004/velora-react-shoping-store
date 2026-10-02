import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

// HashRouter keeps all navigation inside one local file. Embed assets so no server is needed.
execFileSync(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "build", "--outDir", ".offline-build"],
  { stdio: "inherit", env: { ...process.env, VITE_OFFLINE_PREVIEW: "1" } },
);
const assets = ".offline-build/assets";
let js = readFileSync(
  path.join(
    assets,
    readdirSync(assets).find((name) => name.endsWith(".js")),
  ),
  "utf8",
);
let css = readFileSync(
  path.join(
    assets,
    readdirSync(assets).find((name) => name.endsWith(".css")),
  ),
  "utf8",
);
for (const name of readdirSync("public/images")) {
  const data = `data:image/jpeg;base64,${readFileSync(`public/images/${name}`).toString("base64")}`;
  js = js.split(`/images/${name}`).join(data);
}
// System-font fallback makes this preview fully offline, including typography.
css = css.replace(/@import\s*url\([^;]+;/g, "");
const icon = `data:image/svg+xml;base64,${readFileSync("public/favicon.svg").toString("base64")}`;
const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>VELORA — Interactive Design Preview</title><link rel="icon" href="${icon}"><style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
mkdirSync("preview", { recursive: true });
writeFileSync("preview/velora-preview.html", html);
console.log("Created preview/velora-preview.html — double-click to open.");
