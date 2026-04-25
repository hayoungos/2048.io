const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const DATA_PATH = path.join(ROOT_DIR, "rankings.json");

async function readRankings() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v) => Number.isFinite(v)).sort((a, b) => b - a).slice(0, 5);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeRankings(rankings) {
  await fs.writeFile(DATA_PATH, JSON.stringify(rankings, null, 2), "utf8");
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "text/plain; charset=utf-8";
}

async function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT_DIR, safePath);
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": getMimeType(filePath) });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

async function handleApi(req, res) {
  if (req.method === "GET") {
    try {
      const rankings = await readRankings();
      sendJson(res, 200, { rankings });
    } catch {
      sendJson(res, 500, { message: "Could not read rankings" });
    }
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 64) req.destroy();
    });
    req.on("end", async () => {
      try {
        const parsed = JSON.parse(body || "{}");
        const score = Number(parsed.score);
        if (!Number.isFinite(score) || score < 0) {
          sendJson(res, 400, { message: "Invalid score" });
          return;
        }

        const rankings = await readRankings();
        rankings.push(Math.floor(score));
        rankings.sort((a, b) => b - a);
        const top = rankings.slice(0, 5);
        await writeRankings(top);
        sendJson(res, 200, { rankings: top });
      } catch {
        sendJson(res, 500, { message: "Could not save score" });
      }
    });
    return;
  }

  sendJson(res, 405, { message: "Method not allowed" });
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url.startsWith("/api/rankings")) {
    await handleApi(req, res);
    return;
  }
  await serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`2048 server running on http://localhost:${PORT}`);
});
