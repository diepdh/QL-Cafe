# 🧰 SKILL REQUIREMENTS: QuanLyCF
## Danh sách kỹ năng Coder cần có
**Tạo bởi:** Brain | **Ngày:** 2026-03-26

---

> Đây là checklist để Coder self-assess trước khi bắt đầu.
> Nếu thiếu skill nào, báo Brain NGAY — đừng tiếp tục.

---

## 🔧 TOOLS CẦN THIẾT

```
□ Google Account           → Để tạo Google Sheets + Apps Script
□ Trình duyệt Chrome       → Để test GAS Web App
□ VSCode / IDE             → Để soạn thảo code trước khi paste vào GAS
□ Điện thoại Android/iOS  → Để test responsive QR Menu
```

---

## 💻 TECHNICAL SKILLS

### Must Have (P0 — Bắt buộc):

```
□ Google Apps Script        → Viết được .gs files, doGet/doPost, SpreadsheetApp
□ Google Sheets API (GAS)   → getDataRange, appendRow, getSheetByName
□ HTML5 / CSS3              → Layout, flexbox, responsive, CSS variables
□ Vanilla JavaScript (ES6+) → fetch/google.script.run, async callback, DOM manipulation
□ HtmlService (GAS)         → createTemplateFromFile, evaluate(), addMetaTag
□ PropertiesService (GAS)   → getScriptProperties, setProperty, getProperty
□ LockService (GAS)         → getScriptLock, tryLock, releaseLock
```

### Should Have (P1 — Nên có):

```
□ Chart.js cơ bản           → Vẽ line chart, bar chart từ data array
□ QR API                    → Dùng api.qrserver.com để generate QR image URL
□ Responsive CSS            → Media queries cho mobile 375px, tablet, desktop
□ CSS Flexbox + Grid        → Layout 2 cột, sidebar + main, card grid
```

### Nice to Have (P2 — Có thì tốt):

```
□ Google Fonts API          → Load Be Vietnam Pro + Inter qua CDN
□ Utilities (GAS)           → formatDate, computeDigest (hash đơn giản)
```

---

## 📚 TÀI LIỆU THAM KHẢO

| Resource | URL | Khi nào dùng |
|----------|-----|--------------|
| GAS Reference | https://developers.google.com/apps-script/reference | Mọi GAS API |
| SpreadsheetApp | https://developers.google.com/apps-script/reference/spreadsheet | Sheet operations |
| HtmlService | https://developers.google.com/apps-script/reference/html | Serving HTML |
| Chart.js Docs | https://www.chartjs.org/docs/latest/ | Dashboard charts |
| QR API | https://goqr.me/api/ | Generate QR code |

---

## ⚠️ PRE-FLIGHT CHECK

Trước khi bắt đầu TASK_001, verify:

```
1. Tạo Google Sheet mới → Copy Spreadsheet ID từ URL
   URL dạng: https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   
2. Mở Apps Script từ Sheet: Extensions → Apps Script
   → Đổi tên project thành "QuanLyCF"
   → Xác nhận có thể Save và Run function đơn giản
   
3. Test deploy:
   → Deploy → New deployment → Web App
   → Xác nhận có URL dạng: https://script.google.com/macros/s/.../exec
   
4. Điền SPREADSHEET_ID vào Utils.gs::SPREADSHEET_ID
```

---

*Nếu thiếu bất kỳ P0 skill nào → Báo Brain ngay, đừng bắt đầu.*
