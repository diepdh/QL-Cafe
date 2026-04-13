# TASK #019: Fix Settings Form Submission Crash
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-11
**Ưu tiên:** P1 (Form submit gây trắng trang)
**Ước tính:** 10 phút

---

## 🎯 CĂN NGUYÊN VẤN ĐỀ

Trên trang Cài Đặt (Tab Settings), khi bấm lưu, trang bị tải lại và hiện ra một màn hình trắng tinh, mất hết giao diện.

**Nguyên nhân:** Lỗi "kinh điển" của Single Page Application khi xử lý DOM Clone. 
1. Ứng dụng chứa một Template ẩn `<div id="settingsTemplate">` chứa các Form.
2. File `settings.html` chạy 1 lần khi load trang và đã gắn `onsubmit` trực tiếp vào ID của form ẩn này.
3. Khi người dùng bấm tab Cài Đặt, code lại copy chuỗi HTML (bằng `.innerHTML`) của Template đưa ra màn hình chính (`#pageBody`).
4. Chuỗi HTML được copy này tạo ra một cục DOM hoàn toàn mới. Dĩ nhiên là sự kiện `onsubmit` không hề được sao chép theo. 
5. Do không có `onsubmit = function { e.preventDefault(); }` bảo vệ, Form tuân theo hành vi mặc định của thẻ `<form>`, tức là Refresh toàn bộ trang và submit POST request về URL gốc. Dẫn tới màn hình trắng (do Apps Script không tìm thấy file).

## 📋 GIẢI PHÁP ĐÃ ÁP DỤNG TRÊN LOCAL

Brain đã edit các file sau:
1. `src/pages/app.html` (dòng 611, 620): Thay thế `<form>` thường thành `<form onsubmit="saveShopConfig(event)">` để ép sự kiện dính chặt vào chuẩn HTML thuần. Dù lệnh `.innerHTML` có copy bao nhiêu lần thì hàm click cũng luôn đi theo.
2. `src/pages/components/settings.html`: Định nghĩa hàm `saveShopConfig` và `saveShiftConfig`. Đồng thời sửa cách gọi `document.getElementById` bằng cách khoanh vùng trong vùng active (`document.getElementById('pageBody').querySelector(...)`) để tránh lấy nhầm dữ liệu của form ẩn chưa bị xóa.

## 🏁 YÊU CẦU CHO CODER

1. Push code mới nhất lên server. Lệnh: `clasp push`
2. Báo User lên Google Apps Script tạo deployment **New Version** để nhận bản update UI này.
3. User F5 và bấm "Lưu thông tin" bên tab Cài Đặt. Không còn bị trắng dọc đường nữa.
