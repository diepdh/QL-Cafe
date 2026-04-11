# TASK #016: Fix Lỗi Loading Tabs — Sản Phẩm, Công Thức, Sơ Chế
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-10
**Ưu tiên:** P0 (Critical — toàn bộ module Kho Hàng không dùng được)
**Ước tính:** 30 phút
**Phụ thuộc:** TASK_015 (đã PASS)

---

## 🎯 MỤC TIÊU

Hiện tại 3 tab đều hiển thị "Lỗi: Không xác định" thay vì dữ liệu. Nguyên nhân gốc rễ là các hàm backend (`.gs`) đang **ném exception không được bắt**, khiến GAS truyền `null` vào `withSuccessHandler` của frontend. Cần đồng thời:
1. Bảo vệ tất cả hàm backend liên quan bằng `try-catch`.
2. Sửa lỗi so sánh kiểu dữ liệu (Number vs String) khi JOIN bảng từ Google Sheets.
3. Đảm bảo frontend xử lý đúng kết quả trả về `null` hoặc lỗi object.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):

**Backend — `src/Products.gs`:**
- [ ] Bọc toàn bộ thân hàm `getProducts(token)` trong `try { ... } catch(e) { return { error: 'getProducts: ' + e.message }; }`.
- [ ] Bọc toàn bộ thân hàm `getCategories(token)` trong `try-catch` tương tự.
- [ ] Sửa so sánh ID trong JOIN: đổi `c.category_id === p.category_id` thành `String(c.category_id) === String(p.category_id)`.
- [ ] Thêm fallback: `const products = getSheetData('PRODUCTS') || [];`

**Backend — `src/Inventory.gs`:**
- [ ] Bọc toàn bộ thân hàm `getProcessingLogs(token)` trong `try-catch`.
- [ ] Thêm fallback `|| []` cho tất cả `getSheetData(...)` trong hàm đó.
- [ ] Sửa so sánh ID trong JOIN: dùng `String()` ép kiểu trước khi so sánh với `===`.
- [ ] Bọc toàn bộ thân hàm `getProcessingInitData(token)` trong `try-catch`.

**Backend — `src/Products.gs` (getRefinedMaterials):**
> [!NOTE]
> Hàm `getRefinedMaterials` có thể nằm trong `Inventory.gs`. Tìm và bọc `try-catch` cho hàm này.

- [ ] Tìm hàm `getRefinedMaterials(token)` và bọc trong `try-catch`.

**Frontend — `src/pages/components/products.html`:**
- [ ] Bổ sung kiểm tra `if (!products || products.error || !Array.isArray(products))` trước khi gọi `renderProductsTable(products)`.
- [ ] Khi `products.error === 'UNAUTHORIZED'` → gọi `handleLogout()`.  
- [ ] Khi có lỗi khác → hiển thị thông báo đỏ trong tbody, KHÔNG để trang trắng hoặc spinner.

**Frontend — `src/pages/components/processing.html`:**
- [ ] Bổ sung `withFailureHandler` và xử lý null/error cho `loadProcessingLogs()`.

**Frontend — `src/pages/components/recipes.html`:**
- [ ] Bổ sung `withFailureHandler` và xử lý null/error cho `loadRecipeProductList()`.

### Không làm (DO NOT):
- ❌ Không sửa backend `Auth.gs` hay `Utils.gs`.
- ❌ Không refactor hay đổi cấu trúc hàm, chỉ thêm `try-catch` và null-check.
- ❌ Không đổi tên sheet hoặc thay đổi schema dữ liệu.

---

## 📁 FILES CẦN SỬA

```
src/Products.gs          ← Bọc try-catch + sửa String() so sánh
src/Inventory.gs         ← Bọc try-catch getProcessingLogs + getProcessingInitData
src/pages/components/products.html    ← Null-check + error display
src/pages/components/processing.html  ← withFailureHandler + null-check
src/pages/components/recipes.html     ← withFailureHandler + null-check cho list sản phẩm
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Pattern chuẩn cho backend GAS:

```javascript
// ĐÂY LÀ PATTERN CHUẨN — áp dụng cho tất cả hàm backend
function getProducts(token) {
  try {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
    
    const products = getSheetData('PRODUCTS') || [];
    const categories = getSheetData('CATEGORIES') || [];
    
    return products.map(p => {
      // QUAN TRỌNG: dùng String() để tránh lỗi so sánh Number vs String
      const cat = categories.find(c => String(c.category_id) === String(p.category_id));
      return { ...p, category_name: cat ? cat.name : 'Chưa phân loại' };
    });
  } catch(e) {
    // LUÔN return object có key 'error', không bao giờ throw ra ngoài
    return { error: 'getProducts lỗi: ' + e.message };
  }
}
```

### Pattern chuẩn cho frontend xử lý lỗi:

```javascript
google.script.run
  .withSuccessHandler(data => {
    // LUÔN kiểm tra null và error trước khi dùng .map()
    if (!data || data.error) {
      if (data && data.error === 'UNAUTHORIZED') { handleLogout(); return; }
      const el = document.getElementById('...');
      if (el) el.innerHTML = '<tr><td>Lỗi: ' + (data && data.error || 'Không xác định') + '</td></tr>';
      return;
    }
    if (!Array.isArray(data)) {
      // data không phải array — không được gọi .map()
      return;
    }
    // An toàn mới render
    renderTable(data);
  })
  .withFailureHandler(err => {
    // Xử lý lỗi mạng hoặc GAS timeout
    const el = document.getElementById('...');
    if (el) el.innerHTML = '<tr><td colspan="..">Lỗi kết nối: ' + err.message + '</td></tr>';
  })
  .tenHamBackend(STATE.token);
```

---

## 🏁 DEFINITION OF DONE

Task được coi là HOÀN THÀNH khi:

- [ ] Tab "Sản Phẩm": Hiển thị danh sách sản phẩm HOẶC thông báo lỗi rõ ràng (màu đỏ, có nội dung lỗi cụ thể). Không còn spinner quay vô tận hay "Không xác định".
- [ ] Tab "Sơ Chế": Sau khi tạo phiếu, ấn OK, lịch sử sơ chế hiển thị. Không còn loading đứng im.
- [ ] Tab "Công Thức": Danh sách sản phẩm bên trái hiển thị. Khi click vào 1 sản phẩm có thể xem/sửa công thức.
- [ ] Mọi lỗi backend đều hiển thị thông báo nội dung lỗi cụ thể (không phải "Không xác định").
- [ ] Không có hàm backend nào có thể crash và trả về `null` mà không có message lỗi kèm theo.
- [ ] Báo cáo TASK_016_REPORT liệt kê chính xác các files đã sửa và diff ngắn gọn.

---

## ⚠️ LƯU Ý QUAN TRỌNG

> [!CAUTION]
> **Bắt buộc phải PUSH code lên Google Apps Script và Deploy lại Web App** sau khi sửa file .gs. Nếu chỉ lưu file local mà không push + deploy thì code cũ vẫn đang chạy và mọi fix trên frontend đều vô nghĩa.

Quy trình bắt buộc sau khi sửa xong:
1. Lưu tất cả file.
2. Push lên GAS (nếu dùng clasp: `clasp push`).
3. Vào Google Apps Script → Deploy → New Deployment → Web App.
4. Copy URL mới và test.
