# Plan

## Hien trang

- Nut `+ Them NCC` o `src/pages/app.html` dang goi `openSupplierModal()` nhung trong code hien tai khong co dinh nghia ham nay, cung khong thay modal/form NCC tuong ung.
- Backend da co `createSupplier()` va `getSuppliers()` trong `src/Inventory.gs`, nen van de NCC la thieu frontend wiring, khong phai thieu backend hoan toan.
- Backend da co `createCategory()` va `getCategories()` trong `src/Products.gs`, nhung UI `products.html` hien chi cho chon danh muc co san, chua co flow tao danh muc moi.
- `RECIPES` hien dang co schema: `recipe_id | product_id | refined_id | quantity | unit`, va frontend/backend cong thuc chi lam viec voi `refined_id`.
- Nhu vay, support dong thoi NVL tho + NVL tinh che la thay doi du lieu va hop dong API, lon hon hai bug con lai.

## Cach chia task

### Task 1 - Sua flow Them NCC
- Muc tieu: bien nut `+ Them NCC` thanh flow tao NCC hoat dong duoc.
- Scope: modal/form, open/close modal, submit `createSupplier`, reload bang NCC, refresh cac select lien quan.
- Rui ro: thap.

### Task 2 - Them flow Tao danh muc san pham
- Muc tieu: quan ly co the tao category moi ngay trong giao dien san pham.
- Scope: them nut/modal/category create flow, goi `createCategory`, refresh category filter va product modal.
- Rui ro: thap-vua.

### Task 3 - Mo rong cong thuc ho tro NVL tho + NVL tinh che
- Muc tieu: moi dong cong thuc co the chon loai nguyen lieu va item tu danh sach tuong ung.
- Scope: doi schema `RECIPES`, doi `Products.gs`, doi `recipes.html`, cap nhat tai lieu sheet setup neu can.
- Rui ro: cao hon do co migration va backward compatibility.

## Thu tu uu tien

1. Supplier add flow
2. Category add flow
3. Recipe mixed-material support

## Luu y review

- Task 1 va Task 2 nen duoc review theo tieu chi bugfix/CRUD, khong mo rong them tinh nang khac.
- Task 3 phai review theo tieu chi schema change: migration du lieu cu, API response shape, va kha nang doc duoc recipe cu.
