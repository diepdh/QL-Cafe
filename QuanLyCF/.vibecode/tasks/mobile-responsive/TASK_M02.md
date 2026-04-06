# 📋 TASK_M02 — Bottom Navigation Bar

**Sprint:** Mobile-Responsive UI  
**Phụ thuộc:** TASK_M01 phải hoàn thành trước  
**Ước tính:** 30–45 phút  
**File chính:** `src/pages/app.html`

---

## 🎯 Mục tiêu

Thêm **Bottom Navigation Bar** cố định ở dưới cùng màn hình trên mobile — giúp điều hướng nhanh bằng ngón tay cái mà không cần mở sidebar.

Thiết kế tham khảo: hình 2 và hình 3 (demo.sheet.com.vn) — bottom nav 5 tab, tab active có icon + label đổi màu primary.

---

## 📐 Phạm vi thay đổi

**CHỈ sửa trong `src/pages/app.html`**, phần `<style>`, HTML body, và `<script>`.

---

## 🔧 Chi tiết kỹ thuật

### A. HTML — Thêm bottom nav element

Thêm vào ngay trước `</body>`, **ngoài** `#appLayout`:

```html
<nav class="bottom-nav" id="bottomNav">
  <a class="bottom-nav-item active" id="bn-dashboard" onclick="navigateTo('dashboard','Dashboard')">
    <i class="fas fa-chart-line"></i>
    <span>Trang chủ</span>
  </a>
  <a class="bottom-nav-item" id="bn-pos" onclick="navigateTo('pos','Tạo Đơn')">
    <i class="fas fa-cash-register"></i>
    <span>Tạo Đơn</span>
  </a>
  <a class="bottom-nav-item" id="bn-orders-list" onclick="navigateTo('orders-list','Danh Sách Đơn')">
    <i class="fas fa-list-ul"></i>
    <span>DS Đơn</span>
  </a>
  <a class="bottom-nav-item" id="bn-products" onclick="navigateTo('products','Sản Phẩm')">
    <i class="fas fa-mug-hot"></i>
    <span>Sản Phẩm</span>
  </a>
  <a class="bottom-nav-item" id="bn-menu" onclick="toggleSidebar()">
    <i class="fas fa-bars"></i>
    <span>Menu</span>
  </a>
</nav>
```

**Lưu ý:** Bottom nav chỉ hiển thị khi đã đăng nhập (sau khi `showApp()` được gọi). Mặc định `display:none`, sẽ được bật qua CSS responsive hoặc class.

---

### B. CSS — Bottom Nav styles

```css
/* Bottom Nav — ẩn trên desktop */
.bottom-nav {
  display: none;
}

@media (max-width: 768px) {
  .bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    z-index: 200;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 10px;
    color: var(--text-muted);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
    padding: 8px 4px;
  }

  .bottom-nav-item i {
    font-size: 20px;
  }

  .bottom-nav-item.active {
    color: var(--primary);
  }

  .bottom-nav-item.active i {
    /* optional: scale nhẹ để nhấn mạnh */
  }
}
```

**Điều chỉnh main-content padding (đã đặt nền từ TASK_M01):**
```css
@media (max-width: 768px) {
  .main-content {
    padding-bottom: 64px; /* nhường chỗ cho bottom nav */
  }
}
```

---

### C. JavaScript — Cập nhật active state

**Thêm hàm `updateBottomNav(pageId)`:**
```javascript
function updateBottomNav(pageId) {
  // Map pageId → bottom nav item id
  const map = {
    'dashboard': 'bn-dashboard',
    'pos': 'bn-pos',
    'orders-list': 'bn-orders-list',
    'products': 'bn-products'
    // Các page khác → không active tab nào (hoặc active "Menu" tab)
  };
  
  // Xóa hết active
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));
  
  // Set active đúng tab
  const targetId = map[pageId];
  if (targetId) document.getElementById(targetId)?.classList.add('active');
  // Nếu không có trong map → active tab "Menu" vì đang ở trang trong drawer
}
```

**Sửa hàm `navigateTo()`:** Gọi `updateBottomNav(id)` ở cuối hàm.

**Ẩn/Hiện bottom nav theo trạng thái đăng nhập:**
- `showLogin()` → ẩn bottom nav
- `showApp()` → hiện bottom nav (chỉ áp dụng CSS media query tự hiện trên mobile)

---

### D. Phân quyền hiển thị bottom nav

Các tab có thể ẩn theo role:
- Tab **Tạo Đơn** (`pos`): ẩn với role `viewer`
- Tab **DS Đơn** (`orders-list`): ẩn với role `viewer`
- Tab **Sản Phẩm** (`products`): hiển thị với mọi role

**Cách xử lý:** Trong `showApp()` sau khi có `STATE.user.role`, gọi hàm `applyBottomNavPermissions()` để ẩn tab không phù hợp.

```javascript
function applyBottomNavPermissions() {
  const role = STATE.user.role;
  if (role === 'viewer') {
    document.getElementById('bn-pos')?.style.setProperty('display','none');
    document.getElementById('bn-orders-list')?.style.setProperty('display','none');
  }
}
```

---

## ✅ Definition of Done

- [ ] Bottom nav **ẩn hoàn toàn** trên desktop (≥769px)
- [ ] Bottom nav **hiển thị** đúng ở dưới cùng trên mobile (≤768px)
- [ ] 5 tab hiển thị đúng: Dashboard | Tạo Đơn | DS Đơn | Sản Phẩm | Menu
- [ ] Tab tương ứng với trang hiện tại được **highlight màu primary**
- [ ] Click tab → navigate đúng trang, sidebar tự đóng nếu đang mở
- [ ] Tab "Menu" → mở Sidebar Drawer (gọi `toggleSidebar()`)
- [ ] Main content **không bị che** bởi bottom nav (có padding-bottom đủ)
- [ ] Bottom nav chỉ hiện sau khi đăng nhập, ẩn ở login page

---

## 🚫 Không làm trong task này

- Không sửa các grid layout bên trong page content (→ TASK_M03)
- Không sửa POS layout (→ TASK_M03)
- Không thêm animation phức tạp cho bottom nav
- Không đụng backend / API calls
