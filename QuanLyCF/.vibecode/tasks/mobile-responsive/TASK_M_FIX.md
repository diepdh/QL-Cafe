# 📋 TASK_M_FIX — Sửa lỗi sau Review M01/M02/M03

**Sprint:** Mobile-Responsive UI — Fix Pass  
**Phụ thuộc:** TASK_M01, M02, M03 đã hoàn thành  
**Ước tính:** 20–30 phút  
**File chính:** `src/pages/app.html`  
**Nguồn:** Reviewer phát hiện — xem `TASK_M01_M02_M03_REVIEW.md`

---

## 🎯 Mục tiêu

Sửa **3 lỗi** được Reviewer xác định. Tất cả lỗi đều nằm trong phần CSS của `app.html`. **Không được sửa gì ngoài 3 issues này.**

---

## 🔧 Chi tiết 3 Issues cần sửa

---

### ❌ ISSUE #1 — CRITICAL: `.bottom-nav` hiện trên desktop

**Root cause:** Không có global base rule `display: none` cho `.bottom-nav`. Rule duy nhất hiện tại chỉ nằm bên trong `@media (max-width: 768px)`, nên trên desktop CSS không ẩn bottom nav — chỉ JS class `.visible` kiểm soát, dẫn đến xuất hiện trên cả desktop sau khi login.

**Cách sửa:**  
Thêm rule sau vào phần CSS **ngoài** (trước) khối `@media (max-width: 768px)`, đặt ngay trong nhóm `/* --- LAYOUT --- */`:

```css
.bottom-nav { display: none; }
```

**Vị trí chèn:** Sau dòng `.page-body { ... }` (hiện tại khoảng line 73), trước `/* --- MOBILE RESPONSIVE (TASK_M01) --- */`.

---

### 🟡 ISSUE #2 — MAJOR: `.mobile-toggle` hiện trên desktop

**Root cause:** Cùng pattern với Issue #1. Inline style `display:none` đã bị xóa khỏi HTML element (đúng). Nhưng CSS chỉ set `display: flex !important` trong media query ≤768px mà **không có base rule ẩn** nó ở cấp global → hamburger icon hiện trên cả desktop.

**Cách sửa:**  
Thêm rule sau vào phần LAYOUT CSS, cùng chỗ với Issue #1:

```css
.mobile-toggle { display: none; }
```

> **Lưu ý:** Sau khi thêm 2 rule trên, desktop hoạt động đúng vì không có class `.visible` hay `display: flex` nào override. Mobile vẫn đúng vì media query có `display: flex !important`.

---

### 🟡 ISSUE #3 — MAJOR: CSS selectors `#template > div` không match sau khi inject vào `#pageBody`

**Root cause:** Khi `navigateTo()` chạy, nội dung template được inject vào `#pageBody` bằng `innerHTML`. Lúc này các element thực sự nằm trong `#pageBody`, **không phải** trong `#recipesTemplate`, `#reportsTemplate`, `#settingsTemplate`, `#posTemplate`. Các CSS selectors hiện tại trỏ vào template gốc → không có tác dụng.

**Selectors hiện tại sai (nằm trong `@media (max-width: 768px)`):**

| Selector hiện tại | Lý do sai |
|---|---|
| `#recipesTemplate > div[style*="grid-template-columns"]` | Không match sau inject |
| `#reportsTemplate div[style*="1fr 400px"]` | Không match sau inject |
| `#reportsTemplate > div:first-child` | Không match sau inject |
| `#reportsTemplate [style*="gap:4px"]` | Không match sau inject |
| `#settingsTemplate > div[style*="grid-template-columns"]` | Không match sau inject |
| `#posTemplate > div` | Không match sau inject |

**Cách sửa:** Thay tất cả bằng selectors trỏ vào `#pageBody`:

| Selector cũ | Selector mới |
|---|---|
| `#recipesTemplate > div[style*="grid-template-columns"]` | `#pageBody > div[style*="grid-template-columns"]` |
| `#reportsTemplate div[style*="1fr 400px"]` | `#pageBody div[style*="1fr 400px"]` |
| `#reportsTemplate > div:first-child` | `#pageBody > div:first-child` |
| `#reportsTemplate [style*="gap:4px"]` | `#pageBody [style*="gap:4px"]` |
| `#settingsTemplate > div[style*="grid-template-columns"]` | `#pageBody > div[style*="grid-template-columns"]` |
| `#posTemplate > div` | `#pageBody > div` |

> **Lưu ý quan trọng:** Selector `#pageBody > div:first-child` và `#pageBody > div[style*="grid-template-columns"]` sẽ áp dụng cho **mọi trang** inject vào pageBody, không chỉ Reports/Settings/Recipes. Kiểm tra xem điều này có gây conflict không:
> - `div[style*="grid-template-columns"]` → chỉ match div có inline style grid, đúng với Recipes/Settings.
> - `div[style*="1fr 400px"]` → chỉ match Reports/POS layout cụ thể, an toàn.
> - `#pageBody > div:first-child` với `flex-wrap: wrap` → áp dụng cho filter bar của mọi trang → chấp nhận được vì không phá layout.
> - `#pageBody > div` với `display: block !important; height: auto !important` → **có thể conflict** với POS nếu lúc này đang dùng selector này cho mọi div con của pageBody. Hãy đổi selector này cụ thể hơn: `#pageBody > div[style*="1fr 400px"]` hoặc `#pageBody > div[style*="height: calc"]` để chỉ target POS grid.

---

## ✅ Definition of Done

- [ ] Trên desktop (≥769px): `.bottom-nav` **không hiển thị** (ẩn hoàn toàn dù JS đã thêm class `visible`)
- [ ] Trên desktop (≥769px): `.mobile-toggle` (hamburger) **không hiển thị**
- [ ] Trên mobile (≤768px): cả hai vẫn **hoạt động bình thường** như trước
- [ ] Trang **Recipes** trên mobile: 2 panel stack dọc (không side-by-side `300px 1fr`)
- [ ] Trang **Reports** trên mobile: chart + top products stack dọc (không side-by-side `1fr 400px`)
- [ ] Trang **Settings** trên mobile: 2 panel stack dọc (không side-by-side `1fr 1fr`)
- [ ] Desktop trên tất cả trang: **không có thay đổi giao diện**, layout giữ nguyên

---

## 🚫 Không làm trong task này

- Không sửa bất kỳ logic JS nào
- Không sửa HTML structure
- Không đụng `orders.html` hay component files khác
- Không thêm feature mới
- Không refactor CSS ngoài 3 issues trên

---

## 📝 Ghi chú cho Coder

- Tổng số dòng thay đổi ước tính: **~10 dòng** (2 dòng thêm mới + ~8 dòng sửa selector)
- Sau khi sửa, test nhanh bằng Chrome DevTools → Device Toolbar (iPhone 12 Pro, 390px) để verify
- Nếu selector `#pageBody > div` gây conflict ngoài ý muốn → báo ngay, đừng tự xử lý ngoài scope
