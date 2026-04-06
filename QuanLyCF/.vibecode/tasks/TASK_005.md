# TASK #005: Kho Hàng — NVL Thô, NVL Tinh Chế & Nhập Hàng
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 55 phút
**Phụ thuộc:** TASK_004

---

## 🎯 MỤC TIÊU

Xây dựng các trang quản lý NVL Thô, NVL Tinh Chế, Nhà Cung Cấp và Nhập Hàng. Đây là nền tảng cho luồng sơ chế và tự động trừ kho.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Inventory.gs` với: `getRawMaterials(token)`, `createRawMaterial(token, data)`, `updateRawMaterial(token, id, data)`, `getRefinedMaterials(token)`, `createRefinedMaterial(token, data)`, `updateRefinedMaterial(token, id, data)`, `getSuppliers(token)`, `createSupplier(token, data)`, `createProcurement(token, data)` 
- [ ] Mở rộng `inventory.js`: thêm render cho NVL thô, NVL tinh chế, NCC, nhập hàng
- [ ] Trang NVL Thô: bảng danh sách, cột Tên, Đơn Vị, Tồn Kho, Tồn Tối Thiểu, NCC; badge cảnh báo đỏ nếu tồn <= min
- [ ] Trang NVL Tinh Chế: tương tự nhưng không có cột NCC
- [ ] Trang Nhà Cung Cấp: Tên, SĐT, Ghi chú
- [ ] Trang Nhập Hàng: form tạo phiếu nhập (chọn NVL thô, số lượng, giá, ngày, NCC) + danh sách phiếu nhập
- [ ] Tạo phiếu nhập → cộng tồn kho vào RAW_MATERIALS tương ứng

### Không làm (DO NOT):
- ❌ Không làm Sơ Chế (TASK_007)
- ❌ Không làm Recipe (TASK_006)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Inventory.gs    ← CRUD NVL thô, tinh chế, NCC, nhập hàng
```

### Sửa đổi:
```
src/pages/components/inventory.js  ← Thêm sections NVL thô, tinh chế, NCC, nhập hàng
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Inventory.gs — createProcurement() (cập nhật tồn kho):

```javascript
function createProcurement(token, data) {
  const user = validateSession(token);
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) return { error: 'FORBIDDEN' };
  
  // Ghi phiếu nhập
  const id = generateId('PCR');
  appendRow('PROCUREMENT', [id, data.material_id, data.quantity, data.unit_price, data.supplier_id, data.date || new Date().toISOString()]);
  
  // Cập nhật tồn kho RAW_MATERIALS
  const sheet = getSheet('RAW_MATERIALS');
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.material_id) {
      const currentStock = Number(values[i][3]) || 0;
      sheet.getRange(i+1, 4).setValue(currentStock + Number(data.quantity));
      break;
    }
  }
  return { success: true, procurement_id: id };
}
```

### Cập nhật tồn kho helper:

```javascript
function updateStock(sheetName, idField, id, qtyField, delta) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf(idField) + 1;
  const qtyCol = headers.indexOf(qtyField) + 1;
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol-1] === id) {
      const current = Number(values[i][qtyCol-1]) || 0;
      sheet.getRange(i+1, qtyCol).setValue(current + delta);
      return true;
    }
  }
  return false;
}
```

---

## 🏁 DEFINITION OF DONE

- [ ] Trang NVL Thô tải đúng danh sách, badge cảnh báo hiển thị nếu tồn <= min
- [ ] Trang NVL Tinh Chế tương tự
- [ ] Thêm NVL mới → xuất hiện trong danh sách
- [ ] Tạo phiếu nhập hàng → tồn kho NVL thô tương ứng tăng đúng số lượng
- [ ] Trang NCC: thêm/xem danh sách hoạt động

---

## 📌 GHI CHÚ CHO CODER

> `deductStock()` (trừ kho khi hoàn tất đơn) sẽ được implement ở TASK_009, không làm ở đây.
> Cảnh báo tồn kho: `stock_qty <= min_stock` → badge đỏ "Sắp hết".
