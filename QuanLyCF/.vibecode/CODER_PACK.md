# 📦 CODER PACK: QuanLyCF
## Vibecode v5.0 — Tài liệu kỹ thuật cho Coder
**Tạo bởi:** Brain (Antigravity AI)
**Ngày:** 2026-03-26

---

> ⚠️ TÀI LIỆU NÀY LÀ NGUỒN THAM CHIẾU KỸ THUẬT DUY NHẤT.
> Mọi quyết định kỹ thuật không có trong đây → HỎI BRAIN.

---

## 🚀 PLATFORM & SETUP

Dự án này **KHÔNG dùng Node.js hay npm**. Đây là **Google Apps Script (GAS) project**.

### Cấu trúc thư mục cần tạo:

```
QuanLyCF/
├── .vibecode/          ← Vibecode system (đã có)
└── src/
    ├── Code.gs
    ├── Auth.gs
    ├── Orders.gs
    ├── Inventory.gs
    ├── Products.gs
    ├── Staff.gs
    ├── Reports.gs
    ├── Cashflow.gs
    ├── Utils.gs
    ├── Config.gs
    └── pages/
        ├── index.html
        ├── app.html
        ├── menu.html
        └── components/
            ├── dashboard.js
            ├── orders.js
            ├── inventory.js
            ├── recipes.js
            ├── processing.js
            ├── staff.js
            ├── attendance.js
            ├── cashflow.js
            └── reports.js
```

### Deploy lên Google Apps Script:
1. Tạo Google Spreadsheet mới → lưu Spreadsheet ID
2. Vào **Extensions → Apps Script**
3. Copy-paste từng `.gs` file vào GAS editor
4. Copy-paste HTML files vào GAS (File → New → HTML)
5. **Deploy → New deployment → Web App**
   - Execute as: Me
   - Who has access: Anyone (cho QR Menu) hoặc Anyone with Google account
6. Copy URL deploy → đây là URL chính của app

---

## ⚙️ GOOGLE SHEETS DATABASE

### Spreadsheet ID
Lưu Spreadsheet ID vào `Config.gs::SPREADSHEET_ID`. Coder cần tạo Google Sheet mới và điền ID vào file.

### 14 Sheets cần tạo (đúng tên, đúng thứ tự cột):

#### Sheet: CONFIG
| A | B |
|---|---|
| key | value |
| cafe_name | Tên Quán |
| cafe_logo_url | |
| shift_morning | 07:00-13:00 |
| shift_afternoon | 13:00-19:00 |
| shift_evening | 19:00-23:00 |
| tables | B01,B02,B03,B04,B05 |

#### Sheet: USERS
| A | B | C | D | E |
|---|---|---|---|---|
| user_id | username | password_hash | role | staff_id |

Role values: `admin` / `manager` / `cashier` / `viewer`

#### Sheet: STAFF
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| staff_id | full_name | phone | email | position | start_date | hourly_rate | status |

Position values: `manager` / `cashier` / `barista` / `server`
Status values: `active` / `inactive`

#### Sheet: CATEGORIES
| A | B | C |
|---|---|---|
| category_id | name | sort_order |

#### Sheet: PRODUCTS
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| product_id | name | category_id | price | image_url | status | created_at |

Status values: `active` / `paused` / `out_of_stock`

#### Sheet: RAW_MATERIALS
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| material_id | name | unit | stock_qty | min_stock | supplier_id |

#### Sheet: REFINED_MATERIALS
| A | B | C | D | E |
|---|---|---|---|---|
| refined_id | name | unit | stock_qty | min_stock |

#### Sheet: RECIPES
| A | B | C | D | E |
|---|---|---|---|---|
| recipe_id | product_id | refined_id | quantity | unit |

(Một product_id có thể có nhiều dòng — mỗi dòng 1 NVL tinh chế)

#### Sheet: ORDERS
| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| order_id | table_code | source | status | payment_method | subtotal | discount | total | staff_id | created_at | completed_at |

Source values: `qr` / `pos`
Status values: `pending` / `completed` / `cancelled`

#### Sheet: ORDER_ITEMS
| A | B | C | D | E |
|---|---|---|---|---|
| item_id | order_id | product_id | quantity | note |

#### Sheet: PROCUREMENT
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| procurement_id | material_id | quantity | unit_price | supplier_id | date |

#### Sheet: SUPPLIERS
| A | B | C | D |
|---|---|---|---|
| supplier_id | name | phone | note |

#### Sheet: PROCESSING_LOG
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| log_id | raw_material_id | raw_qty_used | refined_id | refined_qty_produced | staff_id | created_at |

#### Sheet: ATTENDANCE
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| attendance_id | staff_id | date | shift | time_in | time_out | hours_worked | note | edited_by |

#### Sheet: CASHFLOW
| A | B | C | D | E | F |
|---|---|---|---|---|---|
| cashflow_id | type | category | amount | note | date |

Type values: `income` / `expense`

---

## 🧩 GAS CODING PATTERNS

### Pattern 1: doGet() Router (Code.gs)

```javascript
function doGet(e) {
  const page = e.parameter.page || 'login';
  
  // Public route — không cần auth
  if (page === 'menu') {
    const table = e.parameter.table || '';
    return HtmlService.createTemplateFromFile('pages/menu')
      .evaluate()
      .setTitle('Menu - QuanLyCF')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  // Protected routes
  return HtmlService.createTemplateFromFile('pages/app')
    .evaluate()
    .setTitle('QuanLyCF')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
```

### Pattern 2: Server-side function (Auth check mọi function)

```javascript
// Mọi function gọi từ frontend phải có auth check đầu tiên
function getOrders(token) {
  const user = Auth.validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  // Logic xử lý...
  return { data: [...] };
}
```

### Pattern 3: Gọi GAS từ Frontend

```javascript
// Frontend JS gọi Apps Script function
google.script.run
  .withSuccessHandler(function(result) {
    if (result.error) { showError(result.error); return; }
    renderData(result.data);
  })
  .withFailureHandler(function(err) {
    showError('Lỗi hệ thống: ' + err.message);
  })
  .getOrders(sessionToken);
```

### Pattern 4: LockService (bắt buộc dùng khi ghi ORDERS, ATTENDANCE)

```javascript
function createOrder(token, orderData) {
  const user = Auth.validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000); // Chờ tối đa 5 giây
  
  try {
    // Ghi vào sheet...
    const sheet = getSheet('ORDERS');
    sheet.appendRow([...]);
    return { success: true, order_id: newId };
  } finally {
    lock.releaseLock();
  }
}
```

### Pattern 5: generateId() (Utils.gs)

```javascript
function generateId(prefix) {
  // Format: PRD-20260326-001
  const date = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + '-' + date + '-' + rand;
}
```

### Pattern 6: getSheet() helper (Utils.gs)

```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // ← Coder điền vào

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}
```

---

## 🎨 DESIGN TOKENS (CSS Variables)

Khai báo trong `<style>` của `app.html`:

```css
:root {
  --primary:      #7C3AED;
  --primary-lt:   #A78BFA;
  --secondary:    #10B981;
  --accent:       #F59E0B;
  --bg:           #F8FAFC;
  --surface:      #FFFFFF;
  --sidebar-bg:   #1E1B4B;
  --text:         #1E293B;
  --text-muted:   #64748B;
  --border:       #E2E8F0;
  --error:        #EF4444;
  --success:      #22C55E;
  --warning:      #F59E0B;
  
  --radius-sm:    6px;
  --radius:       8px;
  --radius-lg:    12px;
  --radius-pill:  24px;
  
  --shadow-card:  0 1px 3px rgba(0,0,0,0.08);
  --shadow-drop:  0 4px 16px rgba(0,0,0,0.12);
}
```

---

## 📐 LAYOUT PATTERN

### App Shell (sidebar + content):

```html
<div class="app-layout">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-logo">QuanLyCF</div>
    <nav class="sidebar-nav">
      <!-- Nav items theo nhóm -->
    </nav>
    <div class="sidebar-user"><!-- User info --></div>
  </aside>
  
  <!-- Main content -->
  <main class="main-content" id="mainContent">
    <header class="topbar"><!-- Page title + actions --></header>
    <div class="page-body" id="pageBody">
      <!-- Dynamic content inject vào đây -->
    </div>
  </main>
</div>
```

### CSS Layout:

```css
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 240px;
  background: var(--sidebar-bg);
  flex-shrink: 0;
  overflow-y: auto;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.page-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--bg);
}

/* Mobile */
@media (max-width: 640px) {
  .sidebar { 
    position: fixed; 
    left: -240px; 
    z-index: 100;
    transition: left 0.3s;
  }
  .sidebar.open { left: 0; }
  .main-content { width: 100%; }
}
```

---

## ⚠️ GAS-SPECIFIC GOTCHAS

```
1. GAS timeout 6 phút
   → Không xử lý loop lớn trong 1 function
   → Dùng batch processing nếu cần

2. HTML Service limitations
   → Không dùng <script src="external"> trực tiếp trong GAS HTML
   → Dùng CDN qua <script> inline hoặc createHtmlOutput

3. google.script.run là async
   → Mọi response đều qua callback, không dùng return value trực tiếp

4. getDataRange() với sheet rỗng
   → Luôn check if (values.length <= 1) return [] trước khi slice(1)

5. Timezone
   → Dùng 'Asia/Ho_Chi_Minh' cho mọi Utilities.formatDate()

6. Session token
   → Lưu trong PropertiesService.getScriptProperties()
   → Key format: 'session_' + token
   → TTL: ghi thêm expiry timestamp, check khi validate
```

---

## 📋 TASK EXECUTION CHECKLIST

Trước khi bắt đầu mỗi task:
```
□ Đọc BLUEPRINT.md phần liên quan
□ Đọc TASK file đầy đủ, hiểu rõ DoD
□ Kiểm tra PROGRESS.md — biết context task trước
□ Xác nhận SPREADSHEET_ID đã có trong Utils.gs
□ Không có blocker trước khi bắt đầu
```

Sau khi hoàn thành:
```
□ Test thủ công trên GAS Web App URL
□ Kiểm tra trên mobile (responsive)
□ Không có JS error trong console
□ Viết TASK_NNN_REPORT.md đầy đủ
```

---

*Tài liệu này được tạo bởi Brain dựa trên Blueprint đã duyệt.*
*Coder không tự sửa file này. Phát hiện sai sót → báo cáo trong TASK_REPORT.*
