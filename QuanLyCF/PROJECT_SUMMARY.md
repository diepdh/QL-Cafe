# 📊 PROJECT SUMMARY — QuanLyCF (v1.0)

Dự án **QuanLyCF** là hệ thống quản lý quán cà phê tinh gọn, chạy trên nền tảng **Google Apps Script** và **Google Sheets**, giúp tối ưu hóa quy trình từ nhập kho, sơ chế, bán hàng (QR & POS) đến quản lý nhân sự và báo cáo tài chính.

---

## 1. Tổng quan dự án
- **Mục tiêu:** Chuyển đổi số hoạt động vận hành quán cà phê, loại bỏ ghi chép thủ công, kiểm soát tồn kho tự động.
- **Kỹ thuật (Tech Stack):**
  - **Backend:** Google Apps Script (JavaScript ES6+).
  - **Database:** Google Sheets (14 bảng dữ liệu).
  - **Frontend:** HTML5, Vanilla CSS, JavaScript (tách component).
  - **Thư viện:** FontAwesome (Icons), Chart.js (Biểu đồ), Google Fonts (Inter, Be Vietnam Pro).
- **Kiến trúc:** 
  - **Client-Server:** Giao tiếp qua `google.script.run`.
  - **Security:** Session-based token (lưu tại SessionStorage), phân quyền 4 mức (Admin, Manager, Cashier, Viewer).
  - **Concurrency:** Sử dụng `LockService` để chống tranh chấp dữ liệu khi nhiều người cùng thao tác.

---

## 2. Danh sách 14 Tasks & Kết quả
1.  **TASK_001:** Thiết lập cấu hình 14 Sheets và Schema dữ liệu. ✅ Hoàn thành.
2.  **TASK_002:** Hệ thống Auth (Login/Logout) và khung ứng dụng (App Shell). ✅ Hoàn thành.
3.  **TASK_003:** Dashboard tổng quan với KPI Cards và Biểu đồ doanh thu 7 ngày. ✅ Hoàn thành.
4.  **TASK_004:** Quản lý Sản Phẩm và Danh Mục (CRUD). ✅ Hoàn thành.
5.  **TASK_005:** Quản lý Kho (NVL Thô, NVL Tinh Chế, Nhà Cung Cấp, Nhập Hàng). ✅ Hoàn thành.
6.  **TASK_006:** Quản lý Công Thức (Recipes) — liên kết SP với NVL Tinh Chế. ✅ Hoàn thành.
7.  **TASK_007:** Module Sơ Chế (Chuyển đổi NVL Thô -> NVL Tinh Chế, trừ tồn kho tương ứng). ✅ Hoàn thành.
8.  **TASK_008:** QR Menu công khai dành cho khách hàng đặt món tại bàn. ✅ Hoàn thành.
9.  **TASK_009:** Giao diện POS nội bộ và logic Trừ Kho tự động khi hoàn tất đơn. ✅ Hoàn thành.
10. **TASK_010:** Quản lý Hồ sơ nhân viên và Tự động tạo tài khoản người dùng. ✅ Hoàn thành.
11. **TASK_011:** Hệ thống Chấm Công (Vào ca/Ra ca) bằng Server Timestamp và Bảng lương. ✅ Hoàn thành.
12. **TASK_012:** Quản lý Thu Chi ngoài bán hàng (Chi phí vận hành). ✅ Hoàn thành.
13. **TASK_013:** Báo cáo doanh thu chi tiết, Top sản phẩm và Tiêu thụ nguyên liệu. ✅ Hoàn thành.
14. **TASK_014:** Cài đặt thông tin quán, Cấu hình ca làm việc và Xuất mã QR bàn. ✅ Hoàn thành.

---

## 3. Danh sách Files dự án

### Backend (.gs)
- `Code.gs`: Router chính và phục vụ trang Web.
- `Auth.gs`: Xử lý đăng nhập, session và phân quyền.
- `Inventory.gs`: Quản lý kho, sơ chế, nhập hàng, trừ kho.
- `Products.gs`: Quản lý sản phẩm, danh mục và công thức.
- `Orders.gs`: Xử lý tạo đơn (QR/POS) và hoàn tất đơn hàng.
- `Staff.gs`: Quản lý nhân viên và chấm công.
- `Cashflow.gs`: Quản lý thu chi.
- `Reports.gs`: Tổng hợp dữ liệu báo cáo và Dashboard.
- `Config.gs`: Quản lý cấu hình hệ thống và QR Code.
- `Utils.gs`: Các hàm helper (CRUD, ID Generation...).

### Frontend (.html)
- `pages/app.html`: Shell chính của ứng dụng (Admin/Staff).
- `pages/menu.html`: Trang menu công khai cho khách hàng.
- `pages/components/recipes.html`: Logic quản lý công thức.
- `pages/components/processing.html`: Logic sơ chế NVL.
- `pages/components/orders.html`: Logic POS và Danh sách đơn.
- `pages/components/staff.html`: Logic quản lý nhân viên.
- `pages/components/attendance.html`: Logic chấm công.
- `pages/components/cashflow.html`: Logic thu chi.
- `pages/components/reports.html`: Logic báo cáo doanh thu.
- `pages/components/settings.html`: Logic cài đặt hệ thống.

---

## 4. Hướng dẫn Deploy (Triển khai)
1.  **Tạo Google Sheets:** Tạo một bảng tính mới và copy ID của bảng tính vào biến `SPREADSHEET_ID` trong `src/Utils.gs`.
2.  **Tạo cấu trúc file:** Trong trình soạn thảo Apps Script, tạo các file `.gs` và `.html` theo đúng cấu trúc trên.
3.  **Cài đặt Trigger:** Đảm bảo hàm `doGet` đã sẵn sàng.
4.  **Deploy:** Chọn **Deploy > New Deployment**.
    - Loại: **Web App**.
    - Execute as: **Me**.
    - Who has access: **Anyone** (Để khách có thể xem QR Menu).
5.  **Cấp quyền:** Nhấn **Review Permissions** và cho phép Script truy cập vào Spreadsheet của bạn.

---

## 5. Tài khoản & Đăng nhập
- **Tài khoản mặc định:** `admin` / `123456`.
- **Lần đầu sử dụng:** Đăng nhập bằng tài khoản admin, vào mục **Cài Đặt** để cập nhật thông tin quán và danh sách bàn. Sau đó vào mục **Nhân Viên** để tạo hồ sơ cho đội ngũ của bạn.

---

## 6. Known Limitations (Hạn chế)
- **Real-time:** Hệ thống chưa tự động thông báo đơn hàng mới (cần nhấn Làm mới hoặc chuyển trang để cập nhật).
- **In ấn:** Chưa hỗ trợ kết nối trực tiếp với máy in hóa đơn nhiệt (chỉ có thể in trang web qua trình duyệt).
- **Offline:** Ứng dụng yêu cầu kết nối internet liên tục để hoạt động.
- **Dữ liệu lớn:** Khi số lượng đơn hàng lên đến hàng chục nghìn, tốc độ load báo cáo có thể chậm lại (cần tối ưu bằng cách lưu trữ theo năm ở phiên bản sau).
