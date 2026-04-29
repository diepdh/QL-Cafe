## Final Goal

Sua 3 van de chuc nang con ton trong `QuanLyCF` bang cac task nho, de coder thuc hien an toan:

- Khoi phuc nut `+ Them NCC` de tao nha cung cap moi duoc tu UI.
- Them chuc nang tao danh muc san pham moi tu giao dien quan ly san pham.
- Mo rong cong thuc pha che de ho tro dong thoi NVL tho va NVL tinh che.

## Global Guardrails

- Khong gop nhieu bug/feature vao mot task neu khong can thiet.
- Moi task chi sua file nam trong `Allowed Files`.
- Task 1 va Task 2 khong duoc nhan tien mo rong them CRUD khac neu khong can.
- Task 3 phai giu kha nang doc du lieu cong thuc cu hoac co migration ro rang.
- Neu task can doi schema sheet `RECIPES`, phai cap nhat tai lieu lien quan.
- Khong sua cac phan mobile performance da on dinh neu khong lien quan truc tiep.

## Escalation Conditions

- BLOCK neu task cong thuc can doi them schema ngoai `RECIPES` ma chua duoc chi ro.
- REVISE neu bugfix NCC/category lai keo theo thay doi UI/logic ngoai pham vi.
- REVISE neu task cong thuc lam mat kha nang doc recipe cu.
- PASS khi flow moi hoat dong dung nghiep vu va khong pha vo cac man hinh hien tai.

## Task Breakdown

### T001: Restore supplier creation flow from Suppliers screen

**Goal**

Sua man hinh Nha cung cap de nut `+ Them NCC` mo duoc modal/form va tao NCC thanh cong.

**Allowed Files**

- `src/pages/app.html`
- `src/Inventory.gs`

**Definition of Done**

- `openSupplierModal()` ton tai va duoc bam tu man hinh `suppliers`.
- Co modal hoac form hop le de nhap ten, so dien thoai, ghi chu NCC.
- Submit goi `createSupplier()` thanh cong va dong modal sau khi luu.
- Bang Nha cung cap duoc reload sau khi tao moi.
- Cac select NCC lien quan trong NVL tho/nhap hang co the load du lieu moi sau khi tao.
- Khong lam vo flow `loadSuppliers()` hien tai.

**Checks**

- `$p='../src/pages/app.html'; $t=Get-Content -Raw $p; if($t -notmatch 'openSupplierModal\\('){ throw 'missing openSupplierModal' }`
- `$p='../src/pages/app.html'; $t=Get-Content -Raw $p; if($t -notmatch 'supplierActions'){ throw 'missing supplierActions hook' }; if($t -notmatch 'supplierModal|sup_name|sup_phone|sup_note'){ throw 'missing supplier modal/form fields' }`
- `$p='../src/Inventory.gs'; $t=Get-Content -Raw $p; if($t -notmatch 'function createSupplier'){ throw 'missing createSupplier backend' }`
- `$p='../src/pages/app.html'; $t=Get-Content -Raw $p; if($t -notmatch 'openProcurementModal\\('){ throw 'missing openProcurementModal' }; if($t -notmatch 'pcr_supplier'){ throw 'missing procurement supplier select' }; if($t -notmatch 'getProcurementInitData\\(STATE.token\\)'){ throw 'missing procurement supplier refresh flow' }`

### T002: Add product category creation flow in product management

**Goal**

Them chuc nang tao danh muc san pham moi ngay trong giao dien quan ly san pham.

**Allowed Files**

- `src/pages/app.html`
- `src/pages/components/products.html`
- `src/Products.gs`

**Definition of Done**

- Co nut/entry point ro rang de tao category moi tu UI quan ly san pham.
- Co modal hoac form tao category moi.
- Submit goi `createCategory()` thanh cong.
- Sau khi tao category, ca `productCategoryFilter` va `prd_category` deu duoc refresh.
- Co the tiep tuc tao/sua san pham voi category moi ma khong reload tay toan app.
- Khong lam hong flow `getCategories()` va `loadProductsList()`.

**Checks**

- `$p='../src/Products.gs'; $t=Get-Content -Raw $p; if($t -notmatch 'function createCategory'){ throw 'missing createCategory backend' }`
- `$p='../src/pages/components/products.html'; $t=Get-Content -Raw $p; if($t -notmatch 'createCategory|openCategory'){ throw 'missing category create UI flow' }`
- `$p='../src/pages/components/products.html'; $t=Get-Content -Raw $p; if($t -notmatch 'loadProductCategories\\('){ throw 'missing category refresh flow' }`

### T003: Extend recipes to support both raw and refined materials

**Goal**

Mo rong cong thuc de moi dong nguyen lieu co the la NVL tho hoac NVL tinh che, nhung khong duoc lam sai du lieu cong thuc cu.

**Allowed Files**

- `src/pages/components/recipes.html`
- `src/Products.gs`
- `SHEETS_SETUP.md`

**Definition of Done**

- UI cong thuc cho phep chon loai nguyen lieu (`raw`/`refined`) cho tung dong.
- Khi chon `raw`, danh sach chon lay tu `RAW_MATERIALS`; khi chon `refined`, lay tu `REFINED_MATERIALS`.
- Backend `getRecipeByProduct()` tra ve du du lieu de render lai ca 2 loai.
- Backend `saveRecipe()` luu duoc ca 2 loai ma khong mat recipe cu.
- Co chien luoc compatibility ro rang cho du lieu cu chi co `refined_id`.
- Khong duoc chi doi header `RECIPES` ma bo qua migrate row cu; neu doi schema thi phai migrate row cu an toan hoac doc/ghi dual-schema thuc su.
- Row cu theo schema `recipe_id | product_id | refined_id | quantity | unit` van phai render dung va save lai khong bi lech cot.
- Diff cua T003 chi duoc nam trong file recipe/docs; neu con thay doi supplier/category thi task phai bi revise.
- Tai lieu `SHEETS_SETUP.md` duoc cap nhat neu schema `RECIPES` thay doi.

**Checks**

- `$p='../src/pages/components/recipes.html'; $t=Get-Content -Raw $p; if($t -notmatch 'raw|refined'){ throw 'recipe UI does not expose material type' }`
- `$p='../src/Products.gs'; $t=Get-Content -Raw $p; if($t -notmatch 'getRecipeByProduct' -or $t -notmatch 'saveRecipe'){ throw 'missing recipe backend functions' }`
- `$p='../src/Products.gs'; $t=Get-Content -Raw $p; if($t -notmatch 'raw_material_id|material_type|refined_id'){ throw 'recipe backend not updated for mixed materials' }`
- `$p='../src/Products.gs'; $t=Get-Content -Raw $p; if($t -match 'sheet\\.getRange\\(1, 1, 1, newHeaders\\.length\\)\\.setValues\\(\\[newHeaders\\]\\)' -and $t -notmatch 'migrat|legacy|old schema|dual-schema'){ throw 'unsafe header-only migration for RECIPES' }`
- `$p='../src/Products.gs'; $t=Get-Content -Raw $p; if($t -notmatch 'refined_id' -or $t -notmatch 'material_id' -or $t -notmatch 'material_type'){ throw 'missing legacy/new recipe compatibility markers' }`
- `$p='../SHEETS_SETUP.md'; $t=Get-Content -Raw $p; if($t -notmatch 'RECIPES'){ throw 'missing RECIPES docs' }`
