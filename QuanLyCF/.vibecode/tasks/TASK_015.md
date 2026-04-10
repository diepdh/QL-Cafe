# TASK #015: Khôi Phục Module Quản Lý Sản Phẩm (Products UI)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-10
**Ưu tiên:** P0 (Kỳ vọng hoạt động ngay)
**Ước tính:** 20 phút
**Phụ thuộc:** Không có

---

## 🎯 MỤC TIÊU

Trong quá trình refactor UI (tách components), module giao diện "Sản Phẩm" (`products.html` và `productsTemplate`) đã bị thất lạc. Task này yêu cầu Coder tạo lại màn hình Quản lý Sản Phẩm (kèm thêm/sửa, modal và phân quyền) và gắn lại vào `app.html` để đảm bảo chu trình quản lý Dữ liệu phần mềm hoạt động trơn tru.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo file component `src/pages/components/products.html`.
- [ ] Tạo giao diện bảng danh sách sản phẩm gồm các cột: Tên, Danh mục, Giá, Trạng thái, Hành động (Nút Sửa).
- [ ] Tạo Modal Thêm/Sửa sản phẩm (`productModal`).
- [ ] Viết hàm `loadProductsPage()` để fetch dữ liệu từ `Products.gs` (`getProducts()`).
- [ ] Tích hợp lại vào thẻ `<script>` dưới cùng của `app.html` và gắn vào logic `navigateTo('products')`.
- [ ] Thêm nút bật tắt Modal và gọi các hàm API (`createProduct`, `updateProduct`) có sẵn trong backend.

### Không làm (DO NOT):
- ❌ Không sửa đổi backend `Products.gs` vì mã nguồn backend vẫn nguyên vẹn và đang hoạt động.
- ❌ Không viết trực tiếp CSS cục bộ bên trong component nếu có thể tái sử dụng các class `.qcf-table` và `.modal-overlay` có sẵn.

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/products.html        ← Template và Logic của trang Quản lý Sản phẩm
```

### Sửa đổi:
```
src/pages/app.html                        ← Include file `.html` mới và sửa CSS nếu cần thiết, thêm map `id === 'products'`
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Template `productsTemplate`
Giao diện quản lý Sản phẩm phải tuân thủ layout có sẵn (các template khác như `rawMaterialsTemplate` hay `suppliersTemplate`). Nó nên bao gồm:
1. Nút "+ Thêm Sản phẩm" ở trên cùng (Chỉ hiển thị với user không phải là `viewer`).
2. Thanh `<input>` để lọc và tìm kiếm (có thể xài `filterTable`).
3. Một Modal chứa Form: Tên, Chọn Danh mục (lấy từ backend qua `getCategories` hoặc gọi song song), Giá (number), Hình ảnh (text url), Trạng thái (Select: active/inactive).

**Behavior:**
- Khi `id === 'products'`, `body.innerHTML = document.getElementById('productsTemplate').innerHTML;` và gọi `loadProductsPage()`.
- Danh mục (Categories) có thể cần được fetch thông qua `google.script.run...getCategories()` mỗi khi bấm Thêm mới hoặc có thể lưu sẵn trong `STATE.categories`.

---

## 🏁 DEFINITION OF DONE

Task được coi là HOÀN THÀNH khi:

- [ ] Click vào menu "Sản Phẩm" hiện ra đúng lưới giao diện.
- [ ] Dữ liệu fetch từ Google Sheets (`PRODUCTS`) hiển thị đúng với các sản phẩm đang có.
- [ ] Nút "Thêm Sản Phẩm" mở Modal và có Select List chọn danh mục.
- [ ] Thêm mới và Sửa sản phẩm thành công (báo alert, đóng Modal, reload lại list).
- [ ] File template được nhúng sạch sẽ ở cuối `app.html` (`<?!= include('pages/components/products') ?>`).
