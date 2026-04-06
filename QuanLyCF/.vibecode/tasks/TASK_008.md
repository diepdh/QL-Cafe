# TASK #008: QR Order — Menu Công Khai & Tạo Đơn Tự Động
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 60 phút
**Phụ thuộc:** TASK_004, TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng trang menu công khai (không cần đăng nhập) để khách quét QR truy cập, chọn món, ghi chú và đặt hàng. Đơn tạo tự động vào hệ thống với `source="qr"`.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Orders.gs` với: `getPublicMenu()` (public, không cần token), `createOrder(token_or_null, data)` (chấp nhận cả QR—không token và POS—có token)
- [ ] Cập nhật `Code.gs`: route `page=menu` → serve `pages/menu.html`, truyền `table` param
- [ ] Tạo `src/pages/menu.html` — trang menu công khai đẹp, responsive mobile-first
- [ ] Menu hiển thị: ảnh món (hoặc placeholder), tên, giá, lọc theo danh mục
- [ ] Giỏ hàng (cart): hiển thị số lượng badge trên icon giỏ, panel trượt từ dưới/phải
- [ ] Ghi chú order: 3 checkbox nhanh (Ít đường / Không đường / Ít đá) + textarea "Ghi chú khác"
- [ ] Nút "Đặt Hàng" → POST tạo đơn → màn hình xác nhận thành công → reset giỏ
- [ ] Đơn tạo ra: `source="qr"`, `status="pending"`, `table_code` từ URL param

### Không làm (DO NOT):
- ❌ Không cần đăng nhập cho menu page
- ❌ Không hiển thị sản phẩm có `status != "active"`
- ❌ Không làm hoàn tất đơn / trừ kho ở đây (TASK_009)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Orders.gs          ← getPublicMenu(), createOrder()
src/pages/menu.html    ← Trang menu QR (public)
```

### Sửa đổi:
```
src/Code.gs            ← Thêm route menu → serve menu.html
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Orders.gs:

```javascript
// PUBLIC — không cần token
function getPublicMenu() {
  const products = getSheetData('PRODUCTS').filter(p => p.status === 'active');
  const categories = getSheetData('CATEGORIES');
  return { products, categories };
}

function createOrder(token, data) {
  // QR order: token = null, source = 'qr'
  // POS order: token = valid, source = 'pos'  
  if (data.source === 'pos') {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
  }
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    const orderId = generateId('ORD');
    const now = new Date().toISOString();
    appendRow('ORDERS', [
      orderId, data.table_code, data.source, 'pending',
      data.payment_method || '', data.subtotal, data.discount || 0,
      data.total, data.staff_id || '', now, ''
    ]);
    
    // Ghi ORDER_ITEMS
    data.items.forEach(item => {
      appendRow('ORDER_ITEMS', [generateId('ITM'), orderId, item.product_id, item.quantity, item.note || '']);
    });
    
    return { success: true, order_id: orderId };
  } finally {
    lock.releaseLock();
  }
}
```

### menu.html design:
- Background: trắng, mobile-first
- Header: logo quán + "Bàn B01" (từ URL param)
- Tab filter danh mục ngang (scroll horizontal)
- Grid sản phẩm: 2 cột trên mobile, 3 cột trên tablet
- Mỗi card: ảnh (nếu không có → placeholder gradient) + tên + giá + nút "+" 
- Sticky bottom: bar giỏ hàng "X món — Xem giỏ hàng"
- Giỏ hàng: slide-up panel, mỗi item có +/- số lượng
- Ghi chú section trong giỏ hàng

### Lấy table param từ URL:
```javascript
// Trong menu.html
const urlParams = new URLSearchParams(window.location.search);
const tableCode = urlParams.get('table') || 'Không xác định';
```

### Code.gs — cập nhật route menu:
```javascript
if (page === 'menu') {
  const template = HtmlService.createTemplateFromFile('pages/menu');
  template.tableCode = e.parameter.table || '';
  return template.evaluate()
    .setTitle('Menu — QuanLyCF')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
```

---

## 🏁 DEFINITION OF DONE

- [ ] Truy cập URL `...exec?page=menu&table=B01` → không cần đăng nhập, thấy menu
- [ ] Sản phẩm active hiển thị đúng, có thể add vào giỏ
- [ ] Sản phẩm `out_of_stock` hoặc `paused` không hiển thị
- [ ] Chọn món, tick ghi chú, nhấn Đặt hàng → đơn xuất hiện trong sheet ORDERS + ORDER_ITEMS
- [ ] Order có `source="qr"`, `status="pending"`, `table_code="B01"`
- [ ] Màn hình xác nhận sau khi đặt hàng thành công
- [ ] Trang hiển thị đẹp trên mobile 375px

---

## 📌 GHI CHÚ CHO CODER

> Đây là trang công khai nhất — ưu tiên UX mobile, thân thiện với người dùng không quen app.
> Menu phải load nhanh — chỉ 1 lần gọi `getPublicMenu()` khi load trang.
> Sau khi đặt hàng thành công: hiện thông báo "Đặt hàng thành công! Nhân viên sẽ mang ra cho bạn." rồi reset giỏ.
