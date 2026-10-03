import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const dir = path.resolve("logs");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, "audit.log");

const mask = (v) =>
  v.length <= 5 ? "***" : `${v.slice(0, 3)}${"*".repeat(v.length - 5)}${v.slice(-2)}`;

/** Kim, nimani, qachon qidirganini yozib boradi (qiymat maskalangan). */
export function audit(event) {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    ...event,
    ...(event.query
      ? {
          query: mask(event.query),
          queryHash: crypto.createHash("sha256").update(event.query).digest("hex").slice(0, 12)
        }
      : {})
  });
  fs.appendFile(file, line + "\n", (err) => {
    if (err) console.error("Audit yozilmadi:", err.message);
  });
}
