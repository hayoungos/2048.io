const fs = require("fs/promises");
const path = require("path");

const DATA_PATH = path.join(process.cwd(), "rankings.json");

let cachedRankings = null;

function normalizeRankings(values) {
  if (!Array.isArray(values)) return [];
  return values
    .filter((v) => Number.isFinite(v))
    .map((v) => Math.floor(v))
    .filter((v) => v >= 0)
    .sort((a, b) => b - a)
    .slice(0, 5);
}

async function readRankings() {
  if (cachedRankings) return cachedRankings;
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    cachedRankings = normalizeRankings(JSON.parse(raw));
    return cachedRankings;
  } catch {
    cachedRankings = [];
    return cachedRankings;
  }
}

async function writeRankings(values) {
  const normalized = normalizeRankings(values);
  cachedRankings = normalized;
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(normalized, null, 2), "utf8");
  } catch {
    // Vercel serverless filesystem may be read-only; keep in-memory fallback.
  }
  return normalized;
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const rankings = await readRankings();
    res.status(200).json({ rankings });
    return;
  }

  if (req.method === "POST") {
    const score = Number(req.body?.score);
    if (!Number.isFinite(score) || score < 0) {
      res.status(400).json({ message: "Invalid score" });
      return;
    }

    const rankings = await readRankings();
    rankings.push(Math.floor(score));
    const top = await writeRankings(rankings);
    res.status(200).json({ rankings: top });
    return;
  }

  res.status(405).json({ message: "Method not allowed" });
};
