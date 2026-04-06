# 📋 TASK_M03 — Fix Grid Layouts + POS 2-Tab Mobile

**Sprint:** Mobile-Responsive UI  
**Phụ thuộc:** TASK_M01, TASK_M02 phải hoàn thành trước  
**Ước tính:** 45–60 phút  
**File chính:** `src/pages/app.html`  
**File mở rộng (nếu cần):** `src/pages/components/orders.html`, `reports.html`, `settings.html`, `recipes.html`

---

## 🎯 Mục tiêu

Sau TASK_M01 + M02, layout shell đã responsive. Task này xử lý nội dung **bên trong các trang** — các grid cứng vỡ trên màn nhỏ — và implement POS mobile dạng **2 tab "Chọn món / Giỏ hàng"**.

---

## 📐 Phạm vi thay đổi

### Nhóm 1: CSS grid overrides trong `app.html`

Tất cả các grid cứng cần override tại breakpoint `max-width: 768px`:

| Template / Selector | Grid hiện tại | Override mobile |
|---|---|---|
| `.kpi-grid` | `auto-fit, minmax(220px, 1fr)` | `repeat(2, 1fr)` |
| `.stats-banner` | `repeat(4, 1fr)` | `repeat(2, 1fr)` |
| `#posTemplate` inner grid | `1fr 400px` | `1fr` (xử lý riêng bằng 2-tab) |
| `#recipesTemplate` inner grid | `300px 1fr` | `1fr` (stack dọc) |
| `#reportsTemplate` chart+table | `1fr 400px` | `1fr` (stack dọc) |
| `#settingsTemplate` | `1fr 1fr` | `1fr` (stack dọc) |

**Cách implement:** Thêm vào phần `@media (max-width: 768px)` đã tạo ở TASK_M01:

```css
@media (max-width: 768px) {
  /* KPI Grid: 2 cột thay vì auto-fit */
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* KPI Card: nhỏ gọn hơn */
  .kpi-card {
    padding: 16px;
    gap: 12px;
  }
  .kpi-icon { width: 44px; height: 44px; font-size: 18px; }
  .kpi-value { font-size: 18px; }

  /* Stats Banner: 2 cột */
  .stats-banner {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Tables: scroll ngang */
  .table-container {
    overflow-x: auto;
  }
  .qcf-table {
    min-width: 500px; /* đảm bảo không bị wrap cột */
  }
  .qcf-table th, .qcf-table td {
    padding: 8px 10px;
    font-size: 13px;
  }

  /* Recipes: stack dọc */
  #recipesTemplate > div[style*="grid-template-columns"] {
    display: block !important;
  }
  #recipesTemplate > div > div:first-child {
    margin-bottom: 16px;
  }

  /* Reports: stack dọc */
  #reportsTemplate [style*="1fr 400px"] {
    grid-template-columns: 1fr !important;
  }

  /* Settings: stack dọc */
  #settingsTemplate > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }

  /* Reports filter bar: wrap */
  #reportsTemplate > div:first-child {
    flex-wrap: wrap;
    gap: 8px;
  }
  #reportsTemplate [style*="gap:4px"] {
    flex-wrap: wrap;
  }
}
```

---

### Nhóm 2: POS Mobile — 2 Tab "Chọn món" / "Giỏ hàng"

**Vấn đề:** POS hiện tại dùng grid `1fr 400px` — trên mobile không thể dùng được.

**Giải pháp:** Trên mobile, hiển thị 2 tab ở đầu trang POS:

```
[ Chọn món ] [ Giỏ hàng (3) ]    ← Tab header, số trong ngoặc = số sản phẩm trong cart
────────────────────────────────
[ Nội dung tab active ]
```

**Cách implement (trong `app.html`, phần CSS + JS):**

#### B1. CSS — POS mobile tabs

```css
@media (max-width: 768px) {
  /* POS grid → stack, nhưng ẩn/hiện qua tab */
  #posTemplate > div {
    display: block !important;
    height: auto !important;
  }

  /* Tab header */
  .pos-mobile-tabs {
    display: flex;
    border-bottom: 2px solid var(--border);
    margin-bottom: 16px;
  }
  .pos-mobile-tab {
    flex: 1;
    padding: 12px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    color: var(--text-muted);
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
  }
  .pos-mobile-tab.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }

  /* Ẩn panel không active */
  .pos-panel-hidden {
    display: none !important;
  }
}

/* Ẩn tab header trên desktop */
.pos-mobile-tabs {
  display: none;
}
```

#### B2. JavaScript — Inject tab header + toggle logic

Trong hàm `navigateTo()`, sau khi `body.innerHTML = posTemplate` và trước `loadPosPage()`:

```javascript
// Inject mobile tab UI vào đầu posTemplate
function injectPosMobileTabs() {
  if (window.innerWidth > 768) return; // chỉ inject trên mobile

  const posGrid = document.querySelector('#pageBody > div'); // div grid chứa 2 panel
  
  // Tạo tab header
  const tabHtml = `
    <div class="pos-mobile-tabs">
      <div class="pos-mobile-tab active" id="posTabProducts" onclick="switchPosTab('products')">
        🛒 Chọn món
      </div>
      <div class="pos-mobile-tab" id="posTabCart" onclick="switchPosTab('cart')">
        📋 Giỏ hàng (<span id="posCartCount">0</span>)
      </div>
    </div>
  `;
  posGrid.insertAdjacentHTML('beforebegin', tabHtml);
  
  // Lấy 2 panel (children của grid div)
  const panels = posGrid.children;
  panels[0].id = 'posPanelProducts';
  panels[1].id = 'posPanelCart';
}

function switchPosTab(tab) {
  const productsPanel = document.getElementById('posPanelProducts');
  const cartPanel = document.getElementById('posPanelCart');
  const tabProducts = document.getElementById('posTabProducts');
  const tabCart = document.getElementById('posTabCart');

  if (tab === 'products') {
    productsPanel?.classList.remove('pos-panel-hidden');
    cartPanel?.classList.add('pos-panel-hidden');
    tabProducts?.classList.add('active');
    tabCart?.classList.remove('active');
  } else {
    productsPanel?.classList.add('pos-panel-hidden');
    cartPanel?.classList.remove('pos-panel-hidden');
    tabProducts?.classList.remove('active');
    tabCart?.classList.add('active');
  }
}
```

**Cập nhật cart count:** Khi add/remove sản phẩm khỏi cart (trong hàm `updatePosSummary()` hoặc tương đương), cập nhật `posCartCount` nếu element tồn tại.

---

## ✅ Definition of Done

### Grid layouts:
- [ ] `.kpi-grid` hiển thị 2 cột trên mobile (không còn tràn)
- [ ] `.stats-banner` hiển thị 2 cột trên mobile
- [ ] `.table-container` có scroll ngang khi bảng rộng
- [ ] Trang **Reports**: chart và top-products stack dọc (không bị vỡ)
- [ ] Trang **Settings**: 2 panel stack dọc (không bị vỡ)
- [ ] Trang **Recipes**: product list ở trên, recipe detail ở dưới (không side-by-side)

### POS Mobile 2 Tab:
- [ ] Trên mobile: POS hiển thị 2 tab "Chọn món" / "Giỏ hàng" ở đầu trang
- [ ] Tab "Chọn món" active mặc định khi vào POS
- [ ] Tab "Giỏ hàng" hiển thị số lượng sản phẩm trong cart
- [ ] Chuyển tab mượt mà, không reload dữ liệu
- [ ] Trên desktop: POS giữ nguyên layout `1fr 400px` side-by-side

---

## 🚫 Không làm trong task này

- Không thay đổi logic tính tiền / tạo đơn hàng
- Không thay đổi API calls
- Không làm animation phức tạp
- Không sửa `menu.html` (trang QR menu khách hàng)

---

## 📝 Ghi chú cho Coder

- Các grid override dùng `!important` do các template đang dùng inline style (`style="display:grid; grid-template-columns: ..."`). CSS media query không override được inline style nếu không có `!important`.
- Hàm `injectPosMobileTabs()` cần gọi trong `navigateTo()` ngay sau khi inject posTemplate HTML, **trước** `loadPosPage()`.
- `posCartCount` chỉ tồn tại trên mobile. Hàm update count phải kiểm tra `document.getElementById('posCartCount')` trước khi set (để không lỗi trên desktop).
- Nếu component `orders.html`, `reports.html`, `settings.html`, `recipes.html` có inline style grid → override bằng cùng cách (`!important` trong media query của `app.html`). Chỉ mở rộng sang file component nếu override từ `app.html` không đủ.
