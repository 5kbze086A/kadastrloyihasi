import crypto from "node:crypto";

const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();

export function parseUsers(raw = "") {
  const users = new Map();
  for (const pair of raw.split(",")) {
    const i = pair.indexOf(":");
    if (i < 1) continue;
    users.set(pair.slice(0, i).trim(), pair.slice(i + 1));
  }
  return users;
}

export function checkPassword(users, username, password) {
  const expected = users.get(username);
  // Foydalanuvchi bor-yo'qligidan qat'i nazar bir xil vaqt sarflanadi
  const a = sha(expected ?? crypto.randomBytes(16));
  const b = sha(password ?? "");
  return crypto.timingSafeEqual(a, b) && expected !== undefined;
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");

export function signToken(secret, username, ttlHours) {
  const payload = b64(
    JSON.stringify({ u: username, exp: Date.now() + ttlHours * 3600_000 })
  );
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(secret, token) {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return { username: data.u };
  } catch {
    return null;
  }
}
