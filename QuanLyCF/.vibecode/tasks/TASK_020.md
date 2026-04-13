# TASK #020: Fix Settings Data Display (Not populating visible inputs)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-11
**Ưu tiên:** P1 (Form trống trơn sau khi reload)
**Ước tính:** 5 phút

---

## 🎯 CĂN NGUYÊN VẤN ĐỀ

**Lỗi:** Sau khi lưu thành công, mở lại Tab Cài Đặt thì "Ca làm việc" và "Thông tin quán" đều trống trơn (`--:--`). Mặc dù trên backend, các Config này đã được lưu chuẩn xác.

**Nguyên nhân:** Lại là hậu quả của việc "Nhân bản Giao diện" (Clone HTML via `.innerHTML`).
Khi mở Tab Cài Đặt, hàm `loadSettingsPage()` gọi API về để lấy dữ liệu. Quá trình điền dữ liệu dùng lệnh:
```javascript
document.getElementById('cfg_shift_morning_start').value = config.shift_morning_start;
```
Bởi vì cấu trúc của trang tồn tại **2 bản ghi** HTML giống hệt nhau (1 bản gốc bị ẩn trong kho chứa `<div id="settingsTemplate">` và 1 bản người dùng đang sử dụng trên `#pageBody`), lệnh `getElementById` của Javascript sẽ **luôn luôn tìm thấy thằng đầu tiên** (chính là bản gốc bị ẩn).
Hậu quả: App điền thông tin rất chuẩn xác, nhưng nó... điền vào cái Form tàng hình. Còn Form trên mặt tiền thì vẫn để trống.

## 📋 GIẢI PHÁP ĐÃ ÁP DỤNG TRÊN LOCAL

Brain đã edit file `src/pages/components/settings.html`:
Thay vì dùng `document.getElementById` chung chung, mã nguồn đã được thay đổi thành:
```javascript
const activeContainer = document.getElementById('pageBody');
activeContainer.querySelector('#cfg_shop_name').value = config.shop_name || '';
// ...
```
Điều này ép Javascript phải chui vào phân vùng "Mặt tiền" `#pageBody` (vùng giao diện đang cho user thấy) để tìm đúng các ô Input và đổ dữ liệu vào.

## 🏁 YÊU CẦU CHO CODER

1. Chạy lệnh: `clasp push` để đẩy bản cập nhật `settings.html` lên.
2. Báo User lên Google Apps Script tạo deployment **New Version** lần cuối để cập nhật.
