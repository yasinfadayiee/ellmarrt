// Local preview: serves docs/ under the same base path GitHub Pages uses (/ellmarrt/).
const http = require("http");
const fs = require("fs");
const path = require("path");
const DOCS = path.join(__dirname, "../docs");
const BASE = fs.existsSync(path.join(DOCS, "CNAME")) ? "" : "/ellmarrt";
const PORT = +process.env.PORT || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };
http.createServer((req, res) => {
  const shot = req.url.includes("shot=1") || (req.headers.referer || "").includes("shot=1");
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (u === "/" && BASE) { res.writeHead(302, { Location: BASE + "/" }); return res.end(); }
  if (!u.startsWith(BASE)) { res.writeHead(404); return res.end(); }
  let f = path.join(DOCS, u.slice(BASE.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404, { "Content-Type": TYPES[".html"] }); return res.end(fs.readFileSync(path.join(DOCS, "404.html"))); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
  // screenshot mode: eager images + no reveal animation so full-page captures render everything
  if (shot && f.endsWith(".html")) return res.end(fs.readFileSync(f, "utf8").replace(/loading="lazy"/g, 'loading="eager"').replace("</head>", "<style>.rv{opacity:1!important;transform:none!important}</style></head>"));
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`preview http://localhost:${PORT}${BASE}/`));
