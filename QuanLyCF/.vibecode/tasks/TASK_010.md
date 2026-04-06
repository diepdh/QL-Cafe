# TASK #010: Hồ Sơ Nhân Viên & Quản Lý User
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P1
**Ước tính:** 45 phút
**Phụ thuộc:** TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng trang Hồ Sơ Nhân Viên: xem danh sách, thêm/sửa thông tin nhân viên (chỉ Manager/Admin). Mỗi nhân viên có tài khoản đăng nhập tương ứng trong USERS sheet.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Staff.gs` với: `getStaff(token)`, `createStaff(token, data)`, `updateStaff(token, staff_id, data)`, `deactivateStaff(token, staff_id)`
- [ ] Khi tạo nhân viên mới: tạo 1 dòng trong STAFF + 1 dòng trong USERS (username = phone/email, password = "123456" mặc định)
- [ ] Tạo `src/pages/components/staff.js` — UI hồ sơ nhân viên
- [ ] Danh sách NV: bảng cột Tên, Chức vụ, SĐT, Ngày vào làm, Lương/giờ, Trạng thái, Hành Động
- [ ] Form thêm/sửa NV: Họ tên, SĐT, Email, Chức vụ (dropdown), Ngày vào làm, Lương/giờ (hoặc tháng)
- [ ] Nút "Nghỉ việc" → đổi status = "inactive"
- [ ] Chỉ hiển thị NV đang active theo mặc định (có toggle xem cả inactive)

### Không làm (DO NOT):
- ❌ Không làm chấm công ở task này (TASK_011)
- ❌ Không cho đổi password trong task này (scope nhỏ)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Staff.gs                         ← CRUD nhân viên
src/pages/components/staff.js        ← UI hồ sơ nhân viên
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Staff.gs — createStaff():

```javascript
function createStaff(token, data) {
  const user = validateSession(token);
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) return { error: 'FORBIDDEN' };
  
  const staff_id = generateId('STF');
  appendRow('STAFF', [
    staff_id, data.full_name, data.phone, data.email,
    data.position, data.start_date, data.hourly_rate, 'active'
  ]);
  
  // Tạo tài khoản mặc định
  const user_id = generateId('USR');
  const username = data.phone || data.email;
  appendRow('USERS', [user_id, username, '123456', data.position === 'manager' ? 'manager' : 'cashier', staff_id]);
  
  return { success: true, staff_id, default_password: '123456' };
}
```

### Chức vụ → role mapping:
```
manager  → role: "manager"
cashier  → role: "cashier"
barista  → role: "cashier"
server   → role: "cashier"
```

---

## 🏁 DEFINITION OF DONE

- [ ] Trang Hồ Sơ NV: danh sách đúng từ STAFF sheet
- [ ] Thêm NV mới → xuất hiện trong STAFF + tạo user trong USERS
- [ ] Sửa thông tin NV → cập nhật đúng
- [ ] Nhân viên mới đăng nhập được với username=phone, password=123456
- [ ] Nút Nghỉ việc → status = inactive
- [ ] Viewer không thấy form thêm/sửa

---

## 📌 GHI CHÚ CHO CODER

> Thông báo sau khi tạo NV mới: "Tài khoản mặc định: [username] / 123456. Yêu cầu NV đổi mật khẩu sớm."
> Lương/giờ vs lương tháng: lưu trong cột `hourly_rate`, nếu là lương tháng thì chia 160 (quy ước).
