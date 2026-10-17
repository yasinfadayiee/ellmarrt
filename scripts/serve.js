// Local preview: serves docs/ under the same base path GitHub Pages uses (/ellmarrt/).
const http = require("http");
const fs = require("fs");
const path = require("path");
const DOCS = path.join(__dirname, "../docs");
const BASE = fs.existsSync(path.join(DOCS, "CNAME")) ? "" : "/ellmarrt";
const PORT = +process.env.PORT || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };
const crypto = require("crypto");
const MOCK = path.join(__dirname, "../.mockgh");
const ROOT = path.join(__dirname, "..");
const sha = (b) => crypto.createHash("sha1").update(b).digest("hex");
async function mockGh(req, res, u) {
  const json = (code, o) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
  const m = u.match(/^\/__mockgh\/repos\/[^/]+\/[^/]+(\/.*)?$/);
  const rest = (m && m[1]) || "";
  if (!rest) return json(200, { permissions: { push: true } });
  if (rest.startsWith("/actions/runs")) return json(200, { workflow_runs: [{ id: 1, status: "completed", conclusion: "success", created_at: new Date().toISOString(), updated_at: new Date().toISOString() }] });
  if (rest.includes("/dispatches")) { res.writeHead(204); return res.end(); }
  const cm = rest.match(/^\/contents\/(.+)$/);
  if (!cm) return json(404, { message: "Not Found" });
  const rel = cm[1];
  const over = path.join(MOCK, rel), orig = path.join(ROOT, rel);
  const cur = fs.existsSync(over) ? over : fs.existsSync(orig) && !rel.startsWith("uploads/") ? orig : null;
  if (req.method === "GET") { if (!cur) return json(404, { message: "Not Found" }); const b = fs.readFileSync(cur); return json(200, { content: b.toString("base64"), sha: sha(b) }); }
  if (req.method === "PUT") {
    let body = ""; for await (const c of req) body += c; const j = JSON.parse(body);
    if (cur) { const b = fs.readFileSync(cur); if (!j.sha) return json(422, { message: "sha wasn't supplied" }); if (j.sha !== sha(b)) return json(409, { message: "does not match" }); }
    const buf = Buffer.from(j.content, "base64"); fs.mkdirSync(path.dirname(over), { recursive: true }); fs.writeFileSync(over, buf);
    return json(200, { content: { sha: sha(buf), path: rel } });
  }
  return json(405, { message: "no" });
}
http.createServer((req, res) => {
  const shot = req.url.includes("shot=1") || (req.headers.referer || "").includes("shot=1");
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (u.startsWith("/__mockgh")) return mockGh(req, res, u).catch((e) => { res.writeHead(500); res.end(String(e)); });
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
