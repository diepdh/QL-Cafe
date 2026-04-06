# TASK REVIEW: TASK_M01 + M02 + M03 (Gộp)
## Mobile Responsive UI – QuanLyCF
**Reviewer:** Antigravity (Claude Sonnet 4.6)
**Review time:** 2026-04-06T13:20:00+07:00
**Verdict:** ❌ FIX REQUIRED

> **Ghi chú quy trình:** Coder không tạo REPORT files (TASK_M01_REPORT.md, M02, M03) trước khi đánh dấu DONE trong PROGRESS.md. Đây là vi phạm quy trình Vibecode v5.0. Review này được thực hiện trực tiếp trên code.

---

## 📊 DEFINITION OF DONE — VERDICT

### TASK_M01 — Layout Shell + Sidebar Drawer + Top Bar

| # | Definition of Done | Status | Ghi chú |
|---|---|---|---|
| 1 | Sidebar ẩn hoàn toàn khi load trên mobile (≤768px) | ✅ PASS | CSS `transform: translateX(-100%)` đúng |
| 2 | Hamburger button xuất hiện + hoạt động | ✅ PASS | `toggleSidebar()` được implement, inline `display:none` đã xóa |
| 3 | Sidebar trượt vào với animation `transition: transform 0.3s` | ✅ PASS | Đúng theo spec |
| 4 | Click backdrop → đóng sidebar | ✅ PASS | `closeSidebar()` gán vào `onclick` của overlay |
| 5 | Click menu item → sidebar tự đóng | ✅ PASS | `closeSidebar()` gọi cuối `navigateTo()` |
| 6 | Desktop (≥769px) không bị ảnh hưởng | 🟡 PARTIAL | **Xem Issue #1 bên dưới** |

**DoD Score: 5.5/6**

### TASK_M02 — Bottom Navigation Bar

| # | Definition of Done | Status | Ghi chú |
|---|---|---|---|
| 1 | Bottom nav ẩn trên desktop (≥769px) | ❌ FAIL | **Issue #2 — CRITICAL** |
| 2 | Bottom nav hiển thị đúng trên mobile | 🟡 PARTIAL | Phụ thuộc vào Issue #2 |
| 3 | 5 tab đúng nội dung | ✅ PASS | HTML đúng |
| 4 | Tab active highlight đúng | ✅ PASS | `updateBottomNav()` hoạt động đúng |
| 5 | Click tab → navigate đúng, sidebar đóng | ✅ PASS | `navigateTo()` gọi `closeSidebar()` |
| 6 | Tab "Menu" → mở sidebar | ✅ PASS | `toggleSidebar()` đúng |
| 7 | Main content không bị che | ✅ PASS | `padding-bottom: 64px` trong media query |
| 8 | Chỉ hiện sau khi đăng nhập | ✅ PASS | `showApp()` thêm class `visible`, `showLogin()` xóa |

**DoD Score: 6/8 (do Issue #2)**

### TASK_M03 — Grid Layouts + POS 2-Tab

| # | Definition of Done | Status | Ghi chú |
|---|---|---|---|
| 1 | `.kpi-grid` 2 cột trên mobile | ✅ PASS | `repeat(2, 1fr) !important` |
| 2 | `.stats-banner` 2 cột trên mobile | ✅ PASS | `repeat(2, 1fr) !important` |
| 3 | `.table-container` scroll ngang | ✅ PASS | `overflow-x: auto` |
| 4 | Reports: stack dọc | ✅ PASS | Selector đúng |
| 5 | Settings: stack dọc | ✅ PASS | Selector đúng |
| 6 | Recipes: stack dọc | 🟡 PARTIAL | **Xem Issue #3** |
| 7 | POS mobile: 2 tab "Chọn món/Giỏ hàng" | ✅ PASS | Logic rõ ràng |
| 8 | Tab "Giỏ hàng" hiển thị số sản phẩm | ❌ FAIL | **Issue #4** |
| 9 | Desktop POS giữ nguyên `1fr 400px` | ✅ PASS | `injectPosMobileTabs()` check `window.innerWidth > 768` |

**DoD Score: 7/9**

---

## ✅ NHỮNG GÌ LÀM TỐT

- **Cấu trúc CSS sạch**: Toàn bộ responsive rule gom trong 1 block `@media (max-width: 768px)`, có comment rõ ràng phân biệt từng task.
- **`toggleSidebar()` / `closeSidebar()`**: Implement đúng, đơn giản, không có side effect.
- **`updateBottomNav()`**: Fallback về `bn-menu` cho các page không có trong map — đúng ý thiết kế.
- **`injectPosMobileTabs()`**: Guard `window.innerWidth > 768` tốt, không inject trên desktop. Việc đặt `panels[1].classList.add('pos-panel-hidden')` mặc định đúng UX.
- **`applyBottomNavPermissions()`**: Xử lý phân quyền tab viewer đầy đủ.
- **`navigateTo()` gọi `closeSidebar()` cuối hàm**: Tốt — sidebar tự đóng sau mỗi navigate, kể cả từ sidebar drawer.
- **Không đụng backend / API calls**: Đúng scope.

---

## ❌ VẤN ĐỀ CẦN XỬ LÝ

### 🔴 CRITICAL

#### Issue #2: Bottom Nav hiển thị trên cả desktop
- **File:** `src/pages/app.html` — CSS lines 198–237
- **Vấn đề:** Class `.bottom-nav` được khai báo với `display: none` **bên trong** `@media (max-width: 768px)`. Còn class `.bottom-nav.visible` khai báo `display: flex` cũng **bên trong** media query đó. Tuy nhiên, JS trong `showApp()` vô điều kiện thêm class `visible` vào `#bottomNav` mà không kiểm tra kích thước màn hình. Kết quả: trên desktop, `bottomNav` nhận class `visible` nhưng không có rule CSS nào prevent nó hiện — bởi vì `.bottom-nav { display: none }` chỉ tồn tại trong media query ≤768px, không có base rule ngoài media query. **File CSS thực tế không có `display: none` cho `.bottom-nav` ở cấp global** → bottom nav hiện trên desktop với layout bị vỡ.
- **Tại sao critical:** DoD M02#1 "ẩn hoàn toàn trên desktop" không đạt. Trên desktop, bottom nav sẽ chiếm thêm 64px ở cuối trang + giao diện bị thêm thanh thừa.
- **Hướng sửa:** Thêm base rule ngoài media query: `.bottom-nav { display: none; }`. Giữ nguyên `.bottom-nav.visible` và rule `display: flex` trong media query. Hoặc thêm rule `@media (min-width: 769px) { .bottom-nav { display: none !important; } }`.

---

### 🟡 MAJOR

#### Issue #1: `.mobile-toggle` hiển thị cả trên desktop
- **File:** `src/pages/app.html` — HTML line 288, CSS lines 97–103
- **Vấn đề:** HTML hiện tại là `<div class="mobile-toggle" style="cursor:pointer;">` — đã xóa `display:none` inline. CSS chỉ set `display: flex !important` trong media query ≤768px nhưng **không có rule ẩn nó trên desktop** ngoài media query. Không có base CSS rule `display: none` cho `.mobile-toggle` ở cấp global → hamburger hiện trên desktop.
- **Hướng sửa:** Thêm global rule: `.mobile-toggle { display: none; }` vào phần LAYOUT CSS (dưới `.page-body`). Media query sẽ override thành `display: flex` trên mobile.

#### Issue #3: CSS selector cho Recipes có thể không match
- **File:** `src/pages/app.html` — CSS line 147
- **Vấn đề:** Selector `#recipesTemplate > div[style*="grid-template-columns"]` match dựa trên inline style. HTML line 342 có `style="display:grid; grid-template-columns: 300px 1fr; gap:20px;"` — selector này **hoạt động được**. Tuy nhiên khi `navigateTo('recipes')` chạy, `innerHTML` được inject vào `#pageBody`, không phải `#recipesTemplate`. Selector `#recipesTemplate > div[...]` sẽ **không match** vì lúc này nội dung nằm trong `#pageBody`, không phải `#recipesTemplate`. Tương tự cho `#reportsTemplate`, `#settingsTemplate`, `#posTemplate`.
- **Tại sao major:** Các grid overrides cho Recipes, Reports, Settings, POS sẽ không có tác dụng trên mobile khi page đã được inject vào pageBody.
- **Hướng sửa:** Thay tất cả selector `#recipesTemplate > div[...]`, `#reportsTemplate div[...]`, `#settingsTemplate > div[...]`, `#posTemplate > div` bằng selector chỉ theo class chung hoặc bằng selector `#pageBody > div[style*="grid-template-columns"]` chung cho tất cả trường hợp.

#### Issue #4: Cart count không được cập nhật
- **File:** `src/pages/app.html` — không có điểm cập nhật `posCartCount`
- **Vấn đề:** Element `<span id="posCartCount">0</span>` được inject vào DOM bởi `injectPosMobileTabs()`, nhưng không có callback nào trong code hiện tại cập nhật giá trị này khi thêm/xóa sản phẩm. Hàm `updatePosSummary()` (trong component `orders.html`) không chạm đến `posCartCount`.
- **Hướng sửa:** Trong hàm `updatePosSummary()` (hoặc hàm tương đương trong component POS), thêm: `const cartCountEl = document.getElementById('posCartCount'); if (cartCountEl) cartCountEl.innerText = cartItems.length;`. Cần xác định đúng tên hàm và biến cart trong component.

---

### 🟢 MINOR (ghi chú, không yêu cầu sửa)

- **Line 288 — `mobile-toggle` không có `aria-label`**: Nên thêm `aria-label="Mở menu"` cho accessibility, nhưng không ảnh hưởng DoD.
- **`injectPosMobileTabs()` dùng `window.innerWidth`**: Không phản ứng khi resize window — chấp nhận được vì đây là app mobile-oriented, người dùng không thường xuyên resize.
- **Không có REPORT files**: Vi phạm quy trình nhưng không ảnh hưởng chất lượng code → ghi chú, yêu cầu bổ sung sau.
- **`pos-mobile-tabs` CSS dùng `display: none` ở base**: Đúng nhưng `.pos-mobile-tabs { display: none; }` nằm ngoài media query chưa được khai báo — tương tự issue bottom-nav. Tuy nhiên tabs chỉ được inject bởi JS khi mobile nên ít impact hơn.

---

## 🏁 VERDICT FINAL

**Verdict:** ❌ FIX REQUIRED

**Lý do:** Có 1 CRITICAL (bottom nav hiện trên desktop) và 2 MAJOR (mobile-toggle hiện trên desktop, CSS selector không match sau inject). Issue #2 và #1 cùng liên quan đến cùng 1 pattern lỗi: thiếu base CSS rule `display: none` cho element trước khi override trong media query. Issue #3 nghiêm trọng vì làm vô hiệu hóa phần lớn grid overrides của TASK_M03 trên mobile.

**Ưu tiên sửa:**
1. **Issue #2 + #1** (cùng root cause): Thêm `display: none` cho `.bottom-nav` và `.mobile-toggle` ở cấp global CSS
2. **Issue #3**: Sửa CSS selectors từ `#template > div[...]` thành selector targeting `#pageBody`
3. **Issue #4**: Cập nhật `posCartCount` trong hàm xử lý cart

---

## 💡 GỢI Ý CHO LESSONS.md

- **Pattern "base + override"**: Khi dùng media query để bật/tắt element, luôn phải khai báo base rule (`display: none`) ở ngoài media query trước, rồi mới override trong breakpoint. Không chỉ dùng JS class để toggle mà không có base CSS.
- **Template inject pattern**: Khi HTML được inject vào `#pageBody` qua `innerHTML`, các CSS selector phải target `#pageBody` (nơi element thực sự tồn tại lúc runtime), không phải `#templateId` (chỉ tồn tại lúc DOM load, bị ẩn bởi class `hidden`).
- **Vibecode quy trình**: Coder phải tạo REPORT file trước khi cập nhật PROGRESS.md. Bỏ qua bước này khiến Brain không có đủ thông tin để điều phối.
