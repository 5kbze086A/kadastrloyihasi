import ExcelJS from "exceljs";

/**
 * Excel ustun nomlari (kichik harfda). Bitta joyda saqlanadi.
 * Yangi nom variantini shu yerga qo'shing.
 */
const ALIASES = {
  name: ["f.i.sh.", "f.i.sh", "fish", "fio", "f.i.o.", "ism", "fuqaro"],
  jshshir: ["jshshir", "jshshr", "pinfl"],
  passport: ["pasport", "passport"],
  type: ["obyekt turi", "turi", "type"],
  status: ["holati", "status"],
  address: ["manzil", "address"],
  cadastral: ["kadastr raqami", "kadastr", "cadastral"],
  area: ["maydon", "maydoni", "area"]
};

const REQUIRED = ["jshshir", "passport"];

export const normalizeKey = (value) =>
  String(value ?? "").toUpperCase().replace(/\s+/g, "");

function cellText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if (value.richText) return value.richText.map((p) => p.text).join("").trim();
    if (value.result !== undefined) return cellText(value.result);
    if (value.text !== undefined) return cellText(value.text);
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return "";
  }
  return String(value).trim();
}

/** Excel faylni bir marta o'qib, xotirada indekslaydi (faqat serverda). */
export async function loadDatabase(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("Excel faylda varaq topilmadi");

  // Sarlavhalar -> ichki maydon nomi
  const columnMap = {};
  sheet.getRow(1).eachCell((cell, col) => {
    const header = cellText(cell.value).toLowerCase();
    for (const [field, names] of Object.entries(ALIASES)) {
      if (names.includes(header) && !columnMap[field]) columnMap[field] = col;
    }
  });

  const missing = REQUIRED.filter((f) => !columnMap[f]);
  if (missing.length) {
    throw new Error(
      `Excelda majburiy ustunlar topilmadi: ${missing.join(", ")}. ` +
        `Topilgan ustunlar: ${Object.keys(columnMap).join(", ") || "yo'q"}`
    );
  }

  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const get = (f) => (columnMap[f] ? cellText(row.getCell(columnMap[f]).value) : "");
    const record = {
      name: get("name"),
      jshshir: normalizeKey(get("jshshir")),
      passport: normalizeKey(get("passport")),
      type: get("type"),
      status: get("status"),
      address: get("address"),
      cadastral: get("cadastral"),
      area: get("area")
    };
    if (record.jshshir || record.passport) rows.push(record);
  });

  const byJshshir = new Map();
  const byPassport = new Map();
  for (const r of rows) {
    if (r.jshshir) push(byJshshir, r.jshshir, r);
    if (r.passport) push(byPassport, r.passport, r);
  }

  return { rows, byJshshir, byPassport };
}

function push(map, key, value) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

/** Qatorlarni JSHSHIR bo'yicha fuqarolarga guruhlaydi. */
function groupCitizens(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = r.jshshir || `P:${r.passport}`;
    if (!groups.has(key)) {
      groups.set(key, {
        name: r.name,
        jshshir: r.jshshir,
        passport: r.passport,
        properties: []
      });
    }
    const g = groups.get(key);
    if (!g.name && r.name) g.name = r.name;
    if (!g.passport && r.passport) g.passport = r.passport;
    g.properties.push({
      type: r.type,
      status: r.status,
      address: r.address,
      cadastral: r.cadastral,
      area: r.area
    });
  }
  return [...groups.values()];
}

export function search(db, type, value) {
  const key = normalizeKey(value);
  const rows = (type === "jshshir" ? db.byJshshir : db.byPassport).get(key) || [];
  return groupCitizens(rows);
}

export function stats(db) {
  return {
    citizens: new Set(db.rows.map((r) => r.jshshir || `P:${r.passport}`)).size,
    properties: db.rows.length
  };
}
