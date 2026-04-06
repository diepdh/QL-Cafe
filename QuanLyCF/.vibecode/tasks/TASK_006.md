# TASK #006: Recipe Management (Công Thức Sản Phẩm)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 40 phút
**Phụ thuộc:** TASK_004, TASK_005

---

## 🎯 MỤC TIÊU

Xây dựng trang Công Thức (Recipe): gắn NVL tinh chế với từng sản phẩm, định nghĩa lượng tiêu thụ. Đây là cơ sở để hệ thống tự động trừ kho khi đơn hoàn tất.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `src/Products.gs`: `getRecipes(token)`, `getRecipeByProduct(token, product_id)`, `saveRecipe(token, product_id, ingredients)` — ingredients là array [{refined_id, quantity, unit}]
- [ ] Tạo `src/pages/components/recipes.js` — UI quản lý recipe
- [ ] Trang Recipe: danh sách sản phẩm (trái), click vào 1 sản phẩm → show recipe của sản phẩm đó (phải)
- [ ] Form thêm NVL tinh chế vào recipe: dropdown NVL tinh chế + input số lượng + đơn vị
- [ ] Có thể thêm nhiều dòng NVL tinh chế cho 1 sản phẩm
- [ ] Xóa dòng NVL trong recipe
- [ ] Lưu recipe → ghi vào sheet RECIPES (xóa cũ, ghi mới cho product_id đó)

### Không làm (DO NOT):
- ❌ Không làm logic trừ kho tự động (TASK_009)
- ❌ Không hỗ trợ nhiều size — 1 recipe chung cho mỗi sản phẩm

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/recipes.js    ← UI quản lý recipe
```

### Sửa đổi:
```
src/Products.gs    ← Thêm getRecipes, getRecipeByProduct, saveRecipe
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Products.gs — saveRecipe():

```javascript
function saveRecipe(token, product_id, ingredients) {
  const user = validateSession(token);
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) return { error: 'FORBIDDEN' };
  
  const sheet = getSheet('RECIPES');
  const values = sheet.getDataRange().getValues();
  
  // Xóa recipe cũ của product này (từ dưới lên để tránh lệch index)
  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][1] === product_id) {
      sheet.deleteRow(i + 1);
    }
  }
  
  // Ghi recipe mới
  ingredients.forEach(ing => {
    const id = generateId('RCP');
    sheet.appendRow([id, product_id, ing.refined_id, ing.quantity, ing.unit]);
  });
  
  return { success: true };
}
```

### UI layout recipe (2 cột):
```
┌─────────────────┬──────────────────────────────────┐
│ Danh sách SP    │ Recipe: Cà Phê Sữa Đá             │
│ [Cà Phê Sữa Đá]│ ┌──────────────┬────────┬──────┐  │
│ [Trà Đào]      │ │ NVL Tinh Chế │ Số lượng│ Đvị  │  │
│ [Nước Cam Ép]  │ │ Cốt cà phê   │ 30     │ ml   │  │
│ ...            │ │ Sữa tươi     │ 100    │ ml   │  │
│                │ └──────────────┴────────┴──────┘  │
│                │ [+ Thêm NVL]          [Lưu Recipe]│
└─────────────────┴──────────────────────────────────┘
```

---

## 🏁 DEFINITION OF DONE

- [ ] Click "Công Thức" sidebar → trang hiển thị danh sách sản phẩm bên trái
- [ ] Click vào sản phẩm → xem recipe hiện tại (nếu có)
- [ ] Thêm NVL tinh chế vào recipe → dropdown load đúng từ REFINED_MATERIALS
- [ ] Lưu → kiểm tra RECIPES sheet có dữ liệu đúng
- [ ] Xóa 1 dòng NVL → cập nhật đúng
- [ ] Sản phẩm chưa có recipe → hiển thị thông báo "Chưa có công thức"

---

## 📌 GHI CHÚ CHO CODER

> Một sản phẩm = nhiều dòng trong RECIPES (mỗi dòng 1 NVL tinh chế).
> Khi Save: xóa toàn bộ recipe cũ của product_id đó rồi ghi mới.
