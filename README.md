# E-MULK

Ko'chmas mulk ma'lumotlarini JSHSHIR yoki pasport bo'yicha qidirish tizimi.

**Arxitektura:** React (Vite) frontend + Express backend. Excel fayl faqat serverda
o'qiladi va hech qachon brauzerga yuborilmaydi.

## Ishga tushirish

```bash
npm install
cp .env.example .env        # AUTH_SECRET va AUTH_USERS ni to'ldiring
```

Excel fayl `data/data.xlsx` ga qo'yiladi. Kerakli ustunlar (nomi bir oz farq qilsa ham bo'ladi,
`server/data.js` ichidagi `ALIASES` ga qarang):

| F.I.Sh. | JSHSHIR | Pasport | Obyekt turi | Holati | Manzil | Kadastr raqami | Maydon |
|---|---|---|---|---|---|---|---|

JSHSHIR va Pasport ustunlari **majburiy**. JSHSHIR ustunini Excelda *Matn* formatida saqlang.

Sinov uchun to'qib chiqarilgan ma'lumot: `npm run sample-data`

```bash
npm run dev      # frontend: http://localhost:5173, API: http://localhost:3000
```

## Production

```bash
npm run build
npm start        # (serverda) dist/ va API bitta serverda (PORT, default 3000)
```

HTTPS orqasida (nginx/Caddy) ishlating. Proksi orqasida `TRUST_PROXY=1` qiling.

## Xavfsizlik

- Kirish login/parol bilan, token 8 soat amal qiladi (`TOKEN_TTL_HOURS`).
- Qidiruv: foydalanuvchiga daqiqasiga 20 ta, login: 15 daqiqada 10 ta urinish.
- Har bir qidiruv `logs/audit.log` ga yoziladi (kim, qachon, nimani — qiymat maskalangan).
- `data/` va `logs/` git'ga tushmaydi. Ularga faqat server foydalanuvchisi kira olishi kerak.
- Shaxsiy ma'lumotlar bilan ishlash bo'yicha amaldagi qonun talablarini alohida tekshiring.

## Render.com'ga joylash (bepul, demo uchun)

1. Loyihani **private** GitHub repoga yuklang (`git status` da `.env`, `data/*.xlsx`, `logs/` ko'rinmasligi kerak).
2. Render → **New → Blueprint** → reponi tanlang. `render.yaml` avtomatik o'qiladi.
3. `AUTH_USERS` so'ralganda `login:uzun-parol` kiriting. `AUTH_SECRET` avtomatik yaratiladi.
4. Deploy tugagach, `https://e-mulk-xxxx.onrender.com` da kirasiz.

Demo'da ma'lumot har deployda `npm run sample-data` bilan yaratiladi (to'qib chiqarilgan yozuvlar).
Bepul tarifda 15 daqiqa so'rov bo'lmasa server uxlaydi (birinchi so'rov ~1 daqiqa), fayl tizimi doimiy emas.
**Haqiqiy fuqaro ma'lumotlarini bepul chet el hostingiga qo'ymang** (pastga qarang).
