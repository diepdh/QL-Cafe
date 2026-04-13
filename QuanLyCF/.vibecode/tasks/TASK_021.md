# TASK #021: Fix HTML Time Input Rejection (Format HH:mm)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-11
**Ưu tiên:** P2 (Giao diện không nhận giờ hiển thị)
**Ước tính:** 5 phút

---

## 🎯 CĂN NGUYÊN VẤN ĐỀ

**Lỗi:** Sau khi sửa truy vấn phân vùng dữ liệu (`TASK_020`), Form vẫn báo trống trơn (`--:--`) ở các ô cấu hình Ca. Dù trong Google Sheets rõ ràng đã lưu `7:00`, `18:00`, v.v.

**Nguyên nhân:** Sự khắt khe của chuẩn HTML5 `<input type="time">`.
1. Theo chuẩn trình duyệt, một ô input kiểu Thời gian **BẮT BUỘC** phải nhận chuỗi đầu vào có định dạng chính xác 2 chữ số: `HH:mm` (Ví dụ `07:00`).
2. Trong khi đó, Google Sheets thường tự động cắt số `0` ở đầu (trở thành `7:00`), hoặc nội suy thành một object Datetime đầy đủ (như kiểu `1899-12-30 07:00:00`).
3. Khi đoạn text dị dạng này `7:00` hoặc `1899-12-30 07:00:00` được nhét vào `.value` của ô input, Trình duyệt từ chối nhận mẫu và tự fallback về `--:--`!

Đây là lúc ta cần một "Bộ chuyển đổi/cắt gọt Text" trước khi mớm cho Input!

## 📋 GIẢI PHÁP ĐÃ ÁP DỤNG TRÊN LOCAL

Brain đã edit file `src/pages/components/settings.html`.
Bổ sung một hàm dọn dẹp format `parseTime` ngay lúc loadSettingsPage:
```javascript
      // Hàm chuẩn hóa giờ (fix lỗi "7:00" thành "07:00" hoặc loại bỏ năm tháng nếu có)
      const parseTime = (val) => {
        if (!val) return '';
        let str = String(val).trim();
        if (str.includes(' ')) str = str.split(' ').pop(); // cắt lấy giờ
        const parts = str.split(':');
        if (parts.length >= 2) return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
        return '';
      };
```
Sau đó bọc toàn bộ các lệnh đọc cấu hình bằng hàm này:
`activeContainer.querySelector('#cfg_shift_morning_start').value = parseTime(config.shift_morning_start) || '06:00';`

## 🏁 YÊU CẦU CHO CODER

1. Chạy lệnh: `clasp push`
2. Báo User lên Google Apps Script tạo deployment **New Version** để update hàm parsing này lên giao diện ứng dụng. Mọi ô giờ sẽ hiển thị sắc nét!
