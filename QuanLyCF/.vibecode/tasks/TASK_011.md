# TASK #011: Chấm Công (Nút VÀO CA / RA CA + Bảng Tháng)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P1
**Ước tính:** 50 phút
**Phụ thuộc:** TASK_010

---

## 🎯 MỤC TIÊU

Xây dựng trang Chấm Công: nhân viên bấm nút VÀO CA / RA CA để ghi timestamp tự động. Manager xem và quản lý bảng công toàn bộ nhân viên theo tháng.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `Staff.gs`: `clockIn(token)`, `clockOut(token)`, `getAttendanceByMonth(token, year, month)`, `editAttendance(token, attendance_id, data)`
- [ ] `clockIn`: kiểm tra hôm nay đã clockIn chưa → nếu rồi: trả warning; nếu chưa: ghi `time_in = new Date()` (server timestamp)
- [ ] `clockOut`: tìm record hôm nay chưa có time_out → ghi `time_out = new Date()`, tính `hours_worked`
- [ ] Tạo `src/pages/components/attendance.js` — UI chấm công
- [ ] UI chính (nhân viên): hiển thị trạng thái ca hiện tại + nút 🟢 VÀO CA (to, nổi bật xanh) hoặc 🔴 RA CA (to, nổi bật đỏ) tùy trạng thái
- [ ] Sau bấm: hiển thị timestamp vừa ghi ("Vào ca lúc 08:15")
- [ ] Manager view: bảng tháng NV × ngày, tổng giờ, ước tính lương, thống kê đi muộn
- [ ] Manager có thể sửa record chấm công (trường hợp quên bấm)
- [ ] Xuất bảng công tháng dưới dạng CSV

### Không làm (DO NOT):
- ❌ Không làm app di động native — chỉ responsive web
- ❌ Không làm GPS chấm công hay nhận diện khuôn mặt

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/attendance.js    ← UI chấm công
```

### Sửa đổi:
```
src/Staff.gs    ← Thêm clockIn, clockOut, getAttendanceByMonth, editAttendance
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Staff.gs — clockIn():

```javascript
function clockIn(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const records = getSheetData('ATTENDANCE');
  
  // Kiểm tra đã clockIn hôm nay chưa
  const existing = records.find(r => 
    r.staff_id === user.staff_id && 
    Utilities.formatDate(new Date(r.date), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === today &&
    r.time_in !== ''
  );
  if (existing) {
    const timeIn = Utilities.formatDate(new Date(existing.time_in), 'Asia/Ho_Chi_Minh', 'HH:mm');
    return { warning: `Bạn đã vào ca lúc ${timeIn}` };
  }
  
  const now = new Date();
  const id = generateId('ATT');
  
  // Xác định ca dựa theo giờ hiện tại
  const hour = now.getHours();
  let shift = 'morning';
  if (hour >= 13 && hour < 19) shift = 'afternoon';
  else if (hour >= 19) shift = 'evening';
  
  appendRow('ATTENDANCE', [id, user.staff_id, today, shift, now.toISOString(), '', 0, '', '']);
  
  const timeStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH:mm');
  return { success: true, time_in: timeStr, shift };
}

function clockOut(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const sheet = getSheet('ATTENDANCE');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const rowDate = Utilities.formatDate(new Date(row[2]), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    if (row[1] === user.staff_id && rowDate === today && !row[5]) {
      const timeOut = new Date();
      const timeIn = new Date(row[4]);
      const hoursWorked = ((timeOut - timeIn) / 3600000).toFixed(2);
      
      sheet.getRange(i+1, 6).setValue(timeOut.toISOString());
      sheet.getRange(i+1, 7).setValue(Number(hoursWorked));
      
      const timeStr = Utilities.formatDate(timeOut, 'Asia/Ho_Chi_Minh', 'HH:mm');
      return { success: true, time_out: timeStr, hours_worked: hoursWorked };
    }
  }
  return { error: 'Không tìm thấy record vào ca hôm nay. Vui lòng bấm VÀO CA trước.' };
}
```

### UI Nút chấm công (nhân viên):

```html
<!-- Khi chưa vào ca -->
<div class="clock-status">
  <div class="status-text">Bạn chưa vào ca hôm nay</div>
  <button class="btn-clock btn-clock-in" id="btnClockIn">
    🟢 VÀO CA
  </button>
</div>

<!-- Khi đã vào ca, chưa ra ca -->
<div class="clock-status">
  <div class="status-text">Đang trong ca · Vào lúc <strong>08:15</strong></div>
  <button class="btn-clock btn-clock-out" id="btnClockOut">
    🔴 RA CA
  </button>
</div>

<!-- Đã hoàn thành ca -->
<div class="clock-status done">
  <div class="status-text">✅ Ca hôm nay hoàn thành</div>
  <div class="status-sub">Vào: 08:15 · Ra: 16:30 · Tổng: 8.25 giờ</div>
</div>
```

### CSS nút chấm công:
```css
.btn-clock {
  width: 100%;
  padding: 20px;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.btn-clock-in  { background: #22C55E; color: white; }
.btn-clock-out { background: #EF4444; color: white; }
.btn-clock:active { transform: scale(0.97); }
```

---

## 🏁 DEFINITION OF DONE

- [ ] Nhân viên thấy nút VÀO CA (xanh, to) khi chưa vào ca
- [ ] Bấm VÀO CA → nút đổi thành RA CA, hiển thị "Vào ca lúc HH:MM"
- [ ] Bấm RA CA → hiển thị tổng giờ làm, ATTENDANCE sheet cập nhật đúng
- [ ] Bấm VÀO CA lần 2 trong ngày → warning "Đã vào ca lúc..."
- [ ] Manager thấy bảng công tháng đầy đủ, chọn tháng/năm thay đổi được
- [ ] Manager sửa được record bị thiếu time_in/time_out
- [ ] Nút to, đẹp, bấm được dễ trên mobile

---

## 📌 GHI CHÚ CHO CODER

> Server timestamp (GAS `new Date()`) quan trọng — không để client tự gửi timestamp.
> Bảng tháng của Manager: tính estimated_salary = hours_worked × hourly_rate cho mỗi NV.
> Export CSV: dùng `Utilities.newBlob(csvContent, 'text/csv', 'bangcong_thang.csv')` — trả về base64 rồi download client-side.
