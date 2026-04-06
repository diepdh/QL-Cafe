# TASK #002: Auth System + App Shell + Login Page
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 60 phút
**Phụ thuộc:** TASK_001

---

## 🎯 MỤC TIÊU

Xây dựng hệ thống đăng nhập (Auth.gs), triển khai GAS Web App với doGet() router, và tạo trang login + app shell cơ bản (sidebar + content area). Đây là bộ khung chạy được cho toàn bộ ứng dụng.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Code.gs` với `doGet()` router: route `menu` → public page, còn lại → app shell
- [ ] Tạo `src/Auth.gs` với các functions: `login(username, password)`, `validateSession(token)`, `logout(token)`
- [ ] Login: so sánh username + password trong sheet USERS, trả về session token (UUID)
- [ ] Session: lưu token vào `PropertiesService.getScriptProperties()` với key `session_TOKEN` và giá trị `{user_id, role, expiry}` (TTL 8 giờ)
- [ ] Tạo `src/pages/index.html` — trang login với design theo BLUEPRINT (màu tím #7C3AED, font Be Vietnam Pro)
- [ ] Tạo `src/pages/app.html` — app shell với sidebar navigation đầy đủ và content area rỗng
- [ ] Sidebar hiển thị đúng menu theo BLUEPRINT (10 nhóm, đúng thứ tự)
- [ ] Deploy GAS Web App, ghi URL vào Report
- [ ] Phân quyền: mỗi sidebar menu item kiểm tra role trước khi hiển thị (Admin thấy tất cả)

### Không làm (DO NOT):
- ❌ Không implement nội dung các trang con (dashboard, orders...) — task sau
- ❌ Không làm QR Menu page (TASK_008)
- ❌ Không dùng bcrypt — simple string comparison đủ dùng (upgrade sau nếu cần)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Code.gs           ← doGet() router chính
src/Auth.gs           ← login(), validateSession(), logout()
src/pages/index.html  ← Login page UI
src/pages/app.html    ← App shell: sidebar + topbar + content area
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Code.gs — doGet() router:

```javascript
function doGet(e) {
  const page = e.parameter.page || '';
  
  if (page === 'menu') {
    // Public QR menu — xử lý ở TASK_008
    return HtmlService.createHtmlOutput('<p>Menu coming soon</p>');
  }
  
  // Serve app shell (login xử lý client-side)
  return HtmlService.createTemplateFromFile('pages/app')
    .evaluate()
    .setTitle('QuanLyCF — Quản Lý Cafe')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
```

### Auth.gs:

```javascript
function login(username, password) {
  const users = getSheetData('USERS');
  const user = users.find(u => u.username === username && u.password_hash === password);
  if (!user) return { error: 'Sai tên đăng nhập hoặc mật khẩu' };
  
  const token = Utilities.getUuid();
  const expiry = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 giờ
  
  PropertiesService.getScriptProperties().setProperty(
    'session_' + token,
    JSON.stringify({ user_id: user.user_id, role: user.role, staff_id: user.staff_id, expiry })
  );
  
  return { token, role: user.role, staff_id: user.staff_id };
}

function validateSession(token) {
  if (!token) return null;
  const raw = PropertiesService.getScriptProperties().getProperty('session_' + token);
  if (!raw) return null;
  const session = JSON.parse(raw);
  if (new Date().getTime() > session.expiry) {
    PropertiesService.getScriptProperties().deleteProperty('session_' + token);
    return null;
  }
  return session;
}

function logout(token) {
  PropertiesService.getScriptProperties().deleteProperty('session_' + token);
  return { success: true };
}
```

### Login page design (index.html):
Dựa theo screenshot app mẫu đã thấy ở đầu cuộc hội thoại:
- Background gradient tím/xanh
- Card trắng trung tâm, bo góc 16px
- Icon cart màu tím
- Tiêu đề "QuanLyCF", subtitle "Đăng nhập để tiếp tục"
- Input username + password (có toggle ẩn/hiện)
- Button "Đăng Nhập" màu tím #7C3AED
- Font: Be Vietnam Pro (Google Fonts CDN)

### Session lưu client-side:
```javascript
// Trong login success handler
sessionStorage.setItem('qcf_token', result.token);
sessionStorage.setItem('qcf_role', result.role);
sessionStorage.setItem('qcf_staff_id', result.staff_id);
```

### Sidebar navigation items (theo role):
```
TỔNG QUAN:   Dashboard                    (tất cả role)
BÁN HÀNG:   Tạo Đơn, Danh Sách Đơn      (admin/manager/cashier)
KHO HÀNG:   Sản Phẩm, NVL Thô, NVL Tinh Chế, Nhập Hàng, Sơ Chế, NCC  (admin/manager)
NHÂN SỰ:    Hồ Sơ NV, Chấm Công         (admin/manager = full; cashier = chỉ chấm công mình)
TÀI CHÍNH:  Thu Chi                       (admin/manager)
BÁO CÁO:   Doanh Thu, Nhân Sự           (admin/manager/viewer)
CÀI ĐẶT:   Cài Đặt                       (admin only)
```

---

## 🏁 DEFINITION OF DONE

- [ ] GAS Web App deploy thành công, có URL `https://script.google.com/macros/s/.../exec`
- [ ] Truy cập URL → thấy trang Login (không thấy app shell)
- [ ] Đăng nhập admin/12345678 → vào được app shell, thấy sidebar
- [ ] Đăng nhập sai → hiển thị thông báo lỗi
- [ ] Đăng xuất → quay về trang Login
- [ ] Sidebar hiển thị đúng menu items
- [ ] Responsive: sidebar ẩn trên mobile, có nút hamburger

---

## 📌 GHI CHÚ CHO CODER

> App dùng Single-Page: `app.html` serve luôn, content inject dynamically qua JS.
> Login page là 1 "state" của app (khi chưa có token), không phải file riêng.
> Có thể kết hợp `index.html` và `app.html` thành 1 file nếu tiện hơn.
> Ghi GAS Web App URL vào Report.
