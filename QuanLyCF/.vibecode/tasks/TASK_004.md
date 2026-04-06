# TASK #004: Kho Hàng — Sản Phẩm & Danh Mục
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 50 phút
**Phụ thuộc:** TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng trang quản lý Sản Phẩm (menu đồ uống): xem danh sách, thêm mới, sửa, đổi trạng thái. Bao gồm cả quản lý Danh Mục. Đây là nền tảng cho QR Menu và Recipe.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Products.gs` với: `getProducts(token)`, `createProduct(token, data)`, `updateProduct(token, id, data)`, `getCategories(token)`, `createCategory(token, data)`
- [ ] Tạo `src/pages/components/inventory.js` phần Sản Phẩm — render bảng danh sách sản phẩm
- [ ] Danh sách sản phẩm: bảng với cột Tên, Danh Mục, Giá Bán, Trạng Thái, Hành Động (Sửa / Đổi trạng thái)
- [ ] Filter theo danh mục và tìm kiếm theo tên
- [ ] Modal/form Thêm/Sửa sản phẩm: Tên, Danh Mục (dropdown), Giá bán, Link ảnh, Trạng thái
- [ ] Nút đổi trạng thái (active ↔ paused ↔ out_of_stock) inline
- [ ] Phân quyền: chỉ admin/manager mới thấy nút Thêm/Sửa

### Không làm (DO NOT):
- ❌ Không làm Recipe trong task này (TASK_006)
- ❌ Không upload ảnh — chỉ nhập URL ảnh (Google Drive public link)
- ❌ Không làm NVL thô/tinh chế (TASK_005)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Products.gs                       ← CRUD sản phẩm, danh mục
src/pages/components/inventory.js     ← UI sản phẩm (sẽ mở rộng ở task sau)
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Products.gs:

```javascript
function getProducts(token) {
  if (!validateSession(token)) return { error: 'UNAUTHORIZED' };
  const products = getSheetData('PRODUCTS');
  const categories = getSheetData('CATEGORIES');
  // Join category name vào product
  return { data: products.map(p => ({
    ...p,
    category_name: (categories.find(c => c.category_id === p.category_id) || {}).name || ''
  }))};
}

function createProduct(token, data) {
  if (!validateSession(token)) return { error: 'UNAUTHORIZED' };
  const id = generateId('PRD');
  const now = new Date().toISOString();
  appendRow('PRODUCTS', [id, data.name, data.category_id, data.price, data.image_url || '', data.status || 'active', now]);
  return { success: true, product_id: id };
}

function updateProduct(token, product_id, data) {
  const user = validateSession(token);
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) return { error: 'FORBIDDEN' };
  const sheet = getSheet('PRODUCTS');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === product_id) {
      if (data.name !== undefined) sheet.getRange(i+1, 2).setValue(data.name);
      if (data.category_id !== undefined) sheet.getRange(i+1, 3).setValue(data.category_id);
      if (data.price !== undefined) sheet.getRange(i+1, 4).setValue(data.price);
      if (data.image_url !== undefined) sheet.getRange(i+1, 5).setValue(data.image_url);
      if (data.status !== undefined) sheet.getRange(i+1, 6).setValue(data.status);
      return { success: true };
    }
  }
  return { error: 'NOT_FOUND' };
}
```

### UI pattern — bảng sản phẩm:
```html
<div class="page-header">
  <h2>Sản Phẩm</h2>
  <button class="btn-primary" id="btnAddProduct">+ Thêm Sản Phẩm</button>
</div>
<div class="filter-bar">
  <input type="text" id="searchProduct" placeholder="Tìm sản phẩm...">
  <select id="filterCategory"><option value="">Tất cả danh mục</option></select>
</div>
<table class="data-table">
  <thead><tr><th>Tên</th><th>Danh Mục</th><th>Giá</th><th>Trạng Thái</th><th></th></tr></thead>
  <tbody id="productTableBody"></tbody>
</table>
```

---

## 🏁 DEFINITION OF DONE

- [ ] Click "Sản Phẩm" sidebar → load danh sách đúng từ Sheets
- [ ] Thêm sản phẩm mới → xuất hiện ngay trong danh sách
- [ ] Sửa sản phẩm → cập nhật đúng trong Sheets
- [ ] Đổi trạng thái → cập nhật ngay, badge màu thay đổi
- [ ] Filter danh mục và search tên hoạt động client-side
- [ ] Viewer không thấy nút Thêm/Sửa

---

## 📌 GHI CHÚ CHO CODER

> Status badge: active=xanh, paused=vàng, out_of_stock=đỏ
> Form Thêm/Sửa dùng modal overlay (không navigate trang)
