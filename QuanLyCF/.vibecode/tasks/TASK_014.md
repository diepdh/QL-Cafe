# TASK #014: Cài Đặt — QR Bàn + Thông Tin Quán + Ca Làm Việc
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P1
**Ước tính:** 40 phút
**Phụ thuộc:** TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng trang Cài Đặt (chỉ Admin): thông tin quán, quản lý danh sách bàn, tạo/xem QR code từng bàn, cấu hình ca làm việc.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `Config.gs`: `getConfig(token)`, `updateConfig(token, data)`, `getQrCodes(token)` 
- [ ] Tạo `src/Config.gs` nếu chưa có với các hàm đọc/ghi CONFIG sheet
- [ ] Tạo UI Cài Đặt trong `src/pages/components/settings.js` (hoặc thêm vào file phù hợp)
- [ ] Section Thông Tin Quán: Tên quán, địa chỉ — có thể sửa và lưu
- [ ] Section Ca Làm Việc: hiển thị 3 ca, có thể sửa giờ bắt đầu/kết thúc
- [ ] Section Quản Lý Bàn: danh sách bàn hiện tại, thêm bàn mới, xóa bàn
- [ ] Section QR Codes: hiển thị QR image cho từng bàn (dùng api.qrserver.com), nút "Mở QR" → link ảnh QR để tải về hoặc in
- [ ] Chỉ Admin truy cập được trang này

### Không làm (DO NOT):
- ❌ Không làm upload logo thực — chỉ nhập URL
- ❌ Không làm print trực tiếp từ browser (chỉ mở link QR)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Config.gs    ← Nếu chưa có — getConfig, updateConfig, getQrCodes
src/pages/components/settings.js    ← UI cài đặt
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### QR Code URL (không cần API key):

```javascript
function getQrCodes(token) {
  const user = validateSession(token);
  if (!user || user.role !== 'admin') return { error: 'FORBIDDEN' };
  
  const config = getConfigAsObject();
  const appUrl = ScriptApp.getService().getUrl(); // URL của GAS Web App
  const tables = (config.tables || 'B01,B02,B03').split(',').map(t => t.trim());
  
  return {
    data: tables.map(table => ({
      table_code: table,
      menu_url: `${appUrl}?page=menu&table=${table}`,
      qr_image_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(appUrl + '?page=menu&table=' + table)}`
    }))
  };
}

function getConfigAsObject() {
  const data = getSheetData('CONFIG');
  const obj = {};
  data.forEach(row => { obj[row.key] = row.value; });
  return obj;
}
```

### QR display UI:
```html
<div class="qr-grid">
  <!-- Repeat cho mỗi bàn -->
  <div class="qr-card">
    <img src="[qr_image_url]" alt="QR Bàn B01" width="150">
    <div class="qr-label">Bàn B01</div>
    <a href="[qr_image_url]" target="_blank" class="btn-sm">🖨️ Mở QR</a>
    <a href="[menu_url]" target="_blank" class="btn-sm btn-outline">Xem Menu</a>
  </div>
</div>
```

---

## 🏁 DEFINITION OF DONE

- [ ] Trang Cài Đặt chỉ hiển thị với role=admin
- [ ] Sửa tên quán → lưu vào CONFIG sheet, reload hiển thị tên mới
- [ ] Thêm bàn mới (ví dụ B06) → QR bàn đó xuất hiện
- [ ] QR image load được từ api.qrserver.com, quét ra đúng URL menu
- [ ] Quét QR bàn B01 bằng điện thoại → mở được trang menu công khai

---

## 📌 GHI CHÚ CHO CODER

> `ScriptApp.getService().getUrl()` lấy URL chính xác của Web App đang deploy.
> QR API miễn phí, không cần key: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=URL`
> Danh sách bàn lưu trong CONFIG dưới dạng: key=`tables`, value=`B01,B02,B03,B04,B05`
