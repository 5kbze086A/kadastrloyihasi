import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "node:path";
import fs from "node:fs";

import { loadDatabase, search, stats } from "./data.js";
import { parseUsers, checkPassword, signToken, verifyToken } from "./auth.js";
import { audit } from "./audit.js";

const {
  PORT = 3000,
  AUTH_SECRET,
  AUTH_USERS,
  DATA_FILE = "./data/data.xlsx",
  TOKEN_TTL_HOURS = "8",
  TRUST_PROXY = "0"
} = process.env;

function fail(message) {
  console.error(`\n[XATO] ${message}\n`);
  process.exit(1);
}

if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
  fail("AUTH_SECRET kamida 32 belgi bo'lishi kerak (.env.example ga qarang).");
}
const users = parseUsers(AUTH_USERS);
if (users.size === 0) fail("AUTH_USERS bo'sh. Format: login:parol,login2:parol2");
for (const [name, pass] of users) {
  if (pass.length < 10) fail(`"${name}" paroli kamida 10 belgi bo'lishi kerak.`);
}
if (!fs.existsSync(DATA_FILE)) {
  fail(`Ma'lumot fayli topilmadi: ${DATA_FILE}\nSinov uchun: npm run sample-data`);
}

let db;
try {
  db = await loadDatabase(DATA_FILE);
} catch (err) {
  fail(`Excelni o'qib bo'lmadi: ${err.message}`);
}
console.log(`Ma'lumotlar yuklandi: ${db.rows.length} ta yozuv`);

const app = express();
app.disable("x-powered-by");
if (TRUST_PROXY === "1") app.set("trust proxy", 1);

app.use(helmet());
app.use((_, res, next) => {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(express.json({ limit: "2kb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." }
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.username || req.ip,
  message: { error: "So'rovlar juda ko'p. Bir daqiqadan keyin urinib ko'ring." }
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const user = verifyToken(AUTH_SECRET, token);
  if (!user) return res.status(401).json({ error: "Kirish talab qilinadi." });
  req.user = user;
  next();
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !checkPassword(users, username, password)
  ) {
    audit({ action: "login_failed", ip: req.ip });
    return res.status(401).json({ error: "Login yoki parol noto'g'ri." });
  }
  audit({ action: "login", user: username, ip: req.ip });
  res.json({
    token: signToken(AUTH_SECRET, username, Number(TOKEN_TTL_HOURS)),
    username
  });
});

app.get("/api/stats", requireAuth, (_req, res) => {
  res.json(stats(db));
});

const VALIDATORS = {
  jshshir: /^\d{14}$/,
  passport: /^[A-Z]{2}\d{7}$/
};

app.post("/api/search", requireAuth, searchLimiter, (req, res) => {
  const { type, value } = req.body || {};
  const query = typeof value === "string" ? value.replace(/\s+/g, "").toUpperCase() : "";

  if (!VALIDATORS[type] || !VALIDATORS[type].test(query)) {
    return res.status(400).json({
      error:
        type === "passport"
          ? "Pasport formati noto'g'ri. Masalan: AA1234567"
          : "JSHSHIR aniq 14 ta raqamdan iborat bo'lishi kerak."
    });
  }

  const citizens = search(db, type, query);
  audit({
    action: "search",
    user: req.user.username,
    ip: req.ip,
    type,
    query,
    found: citizens.length
  });
  res.json({ citizens });
});

app.use("/api", (_req, res) => res.status(404).json({ error: "Topilmadi." }));

// Production: build qilingan frontendni beradi
const dist = path.resolve("dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server xatosi." });
});

app.listen(PORT, () => console.log(`E-MULK server: http://localhost:${PORT}`));
