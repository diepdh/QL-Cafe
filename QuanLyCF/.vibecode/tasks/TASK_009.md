# TASK #009: POS + Danh Sách Đơn + Hoàn Tất Đơn (Trừ Kho Tự Động)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 60 phút
**Phụ thuộc:** TASK_006, TASK_008

---

## 🎯 MỤC TIÊU

Xây dựng POS (nhân viên tạo đơn thủ công), trang danh sách đơn hàng, và chức năng hoàn tất đơn kèm tự động trừ NVL tinh chế theo recipe. Đây là luồng nghiệp vụ cốt lõi.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `Orders.gs`: `getOrders(token, filters)`, `completeOrder(token, order_id, payment_method)`, `cancelOrder(token, order_id)`
- [ ] `completeOrder`: cập nhật status → "completed", ghi completed_at, gọi `deductStock(order_id)`
- [ ] Thêm vào `Inventory.gs`: `deductStock(order_id)` — đọc ORDER_ITEMS → đọc RECIPES → trừ REFINED_MATERIALS
- [ ] Tạo `src/pages/components/orders.js` — POS UI và danh sách đơn
- [ ] POS UI: tìm kiếm sản phẩm, add vào đơn, nhập số lượng, ghi chú, chọn bàn, giảm giá, chọn phương thức thanh toán, tạo đơn
- [ ] Trang danh sách đơn: bảng với filter ngày + status, xem chi tiết đơn
- [ ] Từ danh sách đơn: nút "Hoàn Tất" (cho đơn pending) → trừ kho + cập nhật status
- [ ] Nút "Hủy Đơn" cho đơn pending

### Không làm (DO NOT):
- ❌ Không in hóa đơn thực (ở task sau nếu cần)
- ❌ Không làm tách/gộp bàn (đã loại khỏi scope)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/orders.js    ← POS UI + danh sách đơn
```

### Sửa đổi:
```
src/Orders.gs     ← Thêm getOrders, completeOrder, cancelOrder
src/Inventory.gs  ← Thêm deductStock(order_id)
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Inventory.gs — deductStock():

```javascript
function deductStock(order_id) {
  const orderItems = getSheetData('ORDER_ITEMS').filter(i => i.order_id === order_id);
  const recipes = getSheetData('RECIPES');
  
  orderItems.forEach(item => {
    const itemRecipes = recipes.filter(r => r.product_id === item.product_id);
    itemRecipes.forEach(r => {
      const totalQty = Number(r.quantity) * Number(item.quantity);
      updateStock('REFINED_MATERIALS', 'refined_id', r.refined_id, 'stock_qty', -totalQty);
    });
  });
}
```

### Orders.gs — completeOrder():

```javascript
function completeOrder(token, order_id, payment_method) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    const sheet = getSheet('ORDERS');
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const statusCol = headers.indexOf('status') + 1;
    const payCol = headers.indexOf('payment_method') + 1;
    const completedCol = headers.indexOf('completed_at') + 1;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === order_id && values[i][statusCol-1] === 'pending') {
        sheet.getRange(i+1, statusCol).setValue('completed');
        sheet.getRange(i+1, payCol).setValue(payment_method);
        sheet.getRange(i+1, completedCol).setValue(new Date().toISOString());
        deductStock(order_id); // Trừ kho NVL tinh chế
        return { success: true };
      }
    }
    return { error: 'Không tìm thấy đơn hoặc đơn không ở trạng thái pending' };
  } finally {
    lock.releaseLock();
  }
}
```

### POS Layout:
```
┌──────────────────────────┬────────────────────────┐
│ Tìm kiếm sản phẩm...     │ ĐƠN HÀNG               │
│ [Filter danh mục]        │ Bàn: [B01 ▼]            │
│ ─────────────────────────│ ─────────────────────── │
│ [Cà Phê Sữa Đá  35,000đ]│ Cà Phê Sữa Đá ×2       │
│ [Trà Đào        30,000đ ]│ Ít đường               │
│ [Nước Cam Ép   40,000đ] │ 70,000đ                 │
│                          │ ─────────────────────── │
│                          │ Tổng: 70,000đ           │
│                          │ Giảm giá: [___]         │
│                          │ TT: [Tiền mặt ▼]        │
│                          │ [Tạo Đơn]               │
└──────────────────────────┴────────────────────────┘
```

---

## 🏁 DEFINITION OF DONE

- [ ] POS: tạo đơn thủ công thành công → đơn xuất hiện trong ORDERS + ORDER_ITEMS
- [ ] Danh sách đơn: hiển thị đầy đủ, filter ngày và status hoạt động
- [ ] "Hoàn Tất" đơn → status chuyển "completed", REFINED_MATERIALS giảm đúng theo recipe
- [ ] Hoàn tất đơn có 2 sản phẩm → cả 2 recipe đều được trừ kho
- [ ] "Hủy Đơn" → status = "cancelled", KHÔNG trừ kho
- [ ] LockService được dùng trong completeOrder và createOrder

---

## 📌 GHI CHÚ CHO CODER

> `deductStock` không có auth check riêng vì nó chỉ được gọi từ `completeOrder` (đã auth).
> Nếu NVL tinh chế tồn kho âm (hết hàng mà vẫn bán) — cho phép âm, chỉ cảnh báo.
> Phương thức thanh toán: "Tiền mặt" / "Chuyển khoản".
