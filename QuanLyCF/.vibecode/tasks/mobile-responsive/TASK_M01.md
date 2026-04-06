# 📋 TASK_M01 — CSS Responsive: Layout Shell + Sidebar Drawer + Top Bar

**Sprint:** Mobile-Responsive UI  
**Phụ thuộc:** Không có  
**Ước tính:** 30–45 phút  
**File chính:** `src/pages/app.html`

---

## 🎯 Mục tiêu

Chuyển layout tổng thể của app từ desktop-fixed sang responsive, đảm bảo:
- Sidebar ẩn trên mobile, hoạt động như drawer khi mở
- Top bar gọn, hiện hamburger button trên mobile
- Main content chiếm 100% màn hình trên mobile
- Desktop giữ nguyên hoàn toàn (không bị ảnh hưởng)

---

## 📐 Phạm vi thay đổi

**CHỈ sửa trong `src/pages/app.html`**, phần `<style>` và HTML của `#appLayout`.

---

## 🔧 Chi tiết kỹ thuật

### A. CSS — Breakpoint mobile: `@media (max-width: 768px)`

**1. Layout chính:**
```css
@media (max-width: 768px) {
  #appLayout {
    /* Main content phải full-width, không bị sidebar chiếm chỗ */
  }
  .sidebar {
    /* position: fixed, left: 0, top: 0, height: 100%
       transform: translateX(-100%) khi đóng
       z-index: 300
       transition: transform 0.3s ease */
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    width: 100%;
    /* padding-bottom: 64px để nhường chỗ cho bottom nav (sẽ làm ở TASK_M02) */
  }
}
```

**2. Sidebar Overlay (backdrop):**
- Thêm element `<div id="sidebarOverlay">` vào HTML (ngay sau `<aside class="sidebar">`)
- CSS: `position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:299; display:none`
- Khi sidebar mở → overlay hiển thị; click overlay → đóng sidebar

**3. Top bar mobile:**
```css
@media (max-width: 768px) {
  .top-bar {
    height: 56px;  /* nhỏ hơn desktop (64px) */
    padding: 0 16px;
  }
  .mobile-toggle {
    display: flex !important;  /* Hiện hamburger button */
    align-items: center;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
  }
  #currentPageTitle {
    font-size: 18px;  /* nhỏ hơn một chút */
  }
}
```

### B. JavaScript — Các hàm cần thêm/sửa

**Thêm hàm `toggleSidebar()`** (hiện chưa được implement):
```javascript
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  // overlay hiện/ẩn theo trạng thái sidebar
}

function closeSidebar() {
  // Đóng sidebar và overlay
  // Gọi khi click overlay hoặc click nav-item trên mobile
}
```

**Sửa hàm `navigateTo()`:** Sau khi navigate thành công trên mobile → gọi `closeSidebar()` tự động.

### C. HTML — Thêm sidebarOverlay

Thêm vào ngay sau thẻ `<aside class="sidebar">...</aside>`:
```html
<div id="sidebarOverlay" onclick="closeSidebar()"></div>
```

---

## ✅ Definition of Done

- [ ] Trên mobile (≤768px): sidebar **ẩn hoàn toàn** khi load → chỉ thấy main content
- [ ] Hamburger button `☰` xuất hiện trên top bar mobile và **hoạt động** (toggle sidebar)
- [ ] Sidebar trượt vào từ trái với animation mượt (`transition: transform 0.3s`)
- [ ] Click backdrop (overlay) → đóng sidebar
- [ ] Sau khi click menu item trên mobile → sidebar tự đóng
- [ ] Trên desktop (≥769px): **không có thay đổi gì** (sidebar vẫn hiện cố định như cũ)

---

## 🚫 Không làm trong task này

- Không làm Bottom Navigation Bar (→ TASK_M02)
- Không sửa các grid layout bên trong page content (→ TASK_M03)
- Không sửa POS layout (→ TASK_M03)
- Không đụng backend / API calls

---

## 📝 Ghi chú cho Coder

- Breakpoint duy nhất: `max-width: 768px`
- Desktop rule **không được override** — tất cả media query phải nằm trong `@media (max-width: 768px)`
- Sidebar `.open` class được toggle qua JavaScript
- Hiện tại `mobile-toggle` đang bị `display:none` inline style trong HTML → xóa inline style đó, để CSS responsive xử lý
