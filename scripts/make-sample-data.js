// Faqat SINOV uchun to'qib chiqarilgan ma'lumot yaratadi (haqiqiy shaxslarga aloqasi yo'q).
import ExcelJS from "exceljs";
import fs from "node:fs";

fs.mkdirSync("data", { recursive: true });

const wb = new ExcelJS.Workbook();
const ws = wb.addWorksheet("Ma'lumotlar");
ws.addRow(["F.I.Sh.", "JSHSHIR", "Pasport", "Obyekt turi", "Holati", "Manzil", "Kadastr raqami", "Maydon"]);
ws.addRows([
  ["Test Fuqaro Birinchi", "30101990000011", "AA1234567", "Kvartira", "Faol", "Namangan sh., Test ko'chasi 1-uy", "11:01:01:01:0001", "64.5 m²"],
  ["Test Fuqaro Birinchi", "30101990000011", "AA1234567", "Yer uchastkasi", "Faol", "Namangan t., Namuna MFY", "11:02:03:04:0002", "600 m²"],
  ["Test Fuqaro Ikkinchi", "40202985000022", "AB7654321", "Uy-joy", "Faol", "Toshkent sh., Sinov ko'chasi 5-uy", "10:03:02:01:0003", "145 m²"]
]);
ws.getColumn(2).numFmt = "@";
await wb.xlsx.writeFile("data/data.xlsx");
console.log("data/data.xlsx yaratildi (3 ta sinov yozuvi)");
