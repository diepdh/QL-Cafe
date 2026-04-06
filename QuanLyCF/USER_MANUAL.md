# 📖 HƯỚNG DẪN SỬ DỤNG — QuanLyCF

Chào mừng bạn đến với hệ thống quản lý **QuanLyCF**. Dưới đây là quy trình vận hành cơ bản để bạn làm chủ ứng dụng một cách nhanh nhất.

---

## 1. Thiết lập ban đầu (Dành cho Admin)
Sau khi đăng nhập lần đầu bằng tài khoản `admin`, hãy thực hiện các bước sau:
1.  **Cài Đặt:** Vào menu **Hệ thống > Cài Đặt**.
    - Cập nhật **Thông tin Quán** (Tên, Địa chỉ...).
    - Thiết lập **Ca làm việc** (Sáng, Chiều, Tối).
    - Nhập **Danh sách bàn** (ví dụ: `B01, B02, B03`). Hệ thống sẽ tự tạo mã QR tương ứng.
2.  **Nguyên Liệu:** Vào menu **Kho hàng > NVL Thô**. Thêm danh sách nguyên liệu bạn thường nhập (Cafe hạt, Sữa đặc, Trà túi lọc...).
3.  **Sản Phẩm:** Vào menu **Kho hàng > Sản Phẩm**. Tạo menu đồ uống của quán (Cafe Đen, Cafe Sữa, Bạc Xỉu...).
4.  **Công Thức:** Đây là bước quan trọng. Vào menu **Kho hàng > Công Thức**. Chọn từng sản phẩm và thêm các nguyên liệu thành phần (ví dụ: Cafe Đen dùng 25g Cafe hạt). Điều này giúp hệ thống tự trừ kho khi bán hàng.

---

## 2. Quy trình vận hành hàng ngày

### A. Nhập kho & Sơ chế
- **Nhập hàng:** Khi mua nguyên liệu về, vào **Kho hàng > Nhập Hàng** để ghi nhận số lượng và đơn giá. Tồn kho NVL Thô sẽ tự tăng lên.
- **Sơ chế:** Nếu bạn cần pha sẵn cốt cafe hoặc ủ trà, vào **Kho hàng > Sơ Chế**. Ghi nhận lượng NVL Thô tiêu hao và lượng NVL Tinh Chế thu được (ví dụ: 500g Cafe hạt -> 1500ml Cốt cafe).

### B. Bán hàng (POS)
- **Tạo đơn tại quầy:** Vào menu **Bán hàng > Tạo Đơn**. Chọn món, nhập số lượng, thêm ghi chú (nếu có) và nhấn **Tạo Đơn Hàng**.
- **Khách đặt qua QR:** Khách quét mã QR tại bàn, chọn món và nhấn đặt hàng. Đơn sẽ hiện trong **Bán hàng > Danh Sách Đơn** với trạng thái *Pending*.
- **Hoàn tất đơn:** Khi đơn hàng đã xong, vào **Danh Sách Đơn**, nhấn **Hoàn Tất**. Lúc này hệ thống mới thực hiện **trừ tồn kho** nguyên liệu dựa trên công thức đã cài đặt.

### C. Quản lý Nhân sự
- **Chấm công:** Nhân viên vào làm chỉ cần vào menu **Nhân sự > Chấm Công** và nhấn **VÀO CA**. Khi hết ca nhấn **RA CA**. Hệ thống tự tính giờ làm.
- **Tính lương:** Quản lý có thể xem **Bảng công tháng** tại trang Chấm Công để biết tổng giờ làm và lương tạm tính của từng người.

---

## 3. Tài chính & Báo cáo
- **Thu Chi:** Ghi lại các khoản phí ngoài bán hàng như Tiền điện, Tiền nước, Lương (đã trả) tại menu **Tài chính > Thu Chi**.
- **Báo Cáo:** Xem hiệu quả kinh doanh tại menu **Tổng quan > Báo Cáo**. Bạn có thể chọn khoảng ngày bất kỳ để xem biểu đồ doanh thu, món bán chạy nhất và lượng nguyên liệu đã tiêu tốn.

---

## 4. Các lưu ý quan trọng
- ⚠️ **Trừ kho:** Chỉ khi bạn nhấn **Hoàn Tất** đơn hàng, kho mới bị trừ. Đơn hàng ở trạng thái *Pending* hoặc *Cancelled* sẽ không ảnh hưởng đến kho.
- ⚠️ **Phân quyền:** 
    - **Admin/Manager:** Toàn quyền.
    - **Cashier:** Tạo đơn, xem danh sách đơn, sơ chế, chấm công.
    - **Viewer:** Chỉ xem Dashboard và Sản phẩm.
- 🔄 **Làm mới dữ liệu:** Nếu có đơn hàng mới từ QR Menu mà bạn chưa thấy, hãy nhấn nút **Làm mới** hoặc chuyển sang trang khác rồi quay lại.
