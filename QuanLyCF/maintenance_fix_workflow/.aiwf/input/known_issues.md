# Known Issues - Maintenance Fix Workflow

> Tai lieu nay ghi lai cac loi lap lai trong workflow sua chuc nang (`T001` tro di) de tranh block oan va retry vo ich.

---

## Issue #1 - Workspace con phai dung path `../src/...` trong machine checks

### Mo ta
Workflow nay chay tu `QuanLyCF/maintenance_fix_workflow`, khong phai tu repo root `QuanLyCF`. Neu machine checks dung path kieu `QuanLyCF/src/...` thi PowerShell se tim sai thanh:

```text
.../QuanLyCF/maintenance_fix_workflow/QuanLyCF/src/...
```

va fail voi `PathNotFound`.

### Cach nhan biet
- `test_output.txt` bao `Cannot find path`
- Duong dan loi co dang `maintenance_fix_workflow\\QuanLyCF\\src\\...`

### Cach xu ly chuan
- Dung `../src/...` va `../SHEETS_SETUP.md` trong checks.
- Sau khi sua checks, chay lai truc tiep command tu `tasks.json`.

### Phong tranh
- Moi workflow con ben trong repo goc phai viet checks theo path tu workspace den repo root.

---

## Issue #2 - Sau khi manual rescue task truoc, diff task sau se la cumulative diff

### Mo ta
Khi `T001` duoc manual rescue ma khong co commit/reset diff, den `T002` reviewer se thay ca diff cua `T001` va `T002` cung luc. Neu reviewer chi nhin `git diff` ma khong doi chieu `coder_report.txt`, task sau de bi block oan vi "ngoai scope".

### Cach nhan biet
- `git diff --name-only` co file cua task truoc
- `coder_report.txt` cua task hien tai chi liet ke file dung scope
- Machine checks cua task hien tai pass, nhung reviewer van block vi file ngoai allowed scope

### Cach xu ly chuan
1. Doc `coder_report.txt` cua task hien tai.
2. Doi chieu voi `allowed_files`.
3. Neu coder chi sua dung scope, con file ngoai scope la di san task truoc da duoc rescue.
4. Manual rescue neu DoD con lai da dat.

### Phong tranh
- Sau moi manual rescue, uu tien commit/stage sach neu workflow cho phep.
- Neu khong commit, reviewer phai duoc nhac ro rang diff la cumulative.

---

## Issue #3 - `coder_report.txt` co gia tri audit cao hon `git diff` khi nghi ngo scope creep

### Mo ta
Trong workflow nay, `T002` bi block du machine checks pass va implementation category nam trong `products.html`, chi vi `git diff` van con `app.html` va `Inventory.gs` tu `T001`.

### Cach nhan biet
- `review.json` noi scope creep
- `coder_report.txt` chi liet ke file dung scope
- `test_output.txt` deu pass

### Cach xu ly chuan
- Neu `coder_report.txt` va checks cung ung ho task hien tai, uu tien chung hon `git diff` tich luy.

### Phong tranh
- Reviewer can kiem tra ca:
  - `allowed_files`
  - `coder_report.txt`
  - `git diff --name-only`
  thay vi dua vao 1 nguon duy nhat.

---

## Issue #4 - Machine checks pass khong dong nghia reviewer se tu PASS neu DoD co yeu cau evidence

### Mo ta
`T002` co machine checks pass nhung reviewer van note thieu bang chung regression cho `getCategories()` va `loadProductsList()`. Day khong phai bug code ro rang, ma la thieu evidence ngoai pattern check.

### Cach nhan biet
- `test_output.txt` PASS
- `review.json` van fail 1 DoD kieu "chua co bang chung runtime/regression"

### Cach xu ly chuan
- Neu logic code ro rang va khong co issue cu the, co the manual rescue.
- Tot hon nua: bo sung trong task checks sat hon voi integration path can reviewer quan tam.

### Phong tranh
- Khi DoD noi toi "khong lam hong flow hien tai", can them machine check hoac reviewer note cu the cho integration points quan trong.

---

## Issue #5 - T003 co rui ro "header-only migration" lam sai recipe cu

### Mo ta
Task cong thuc khac voi T001/T002 o cho day la thay doi schema. Neu coder chi doi header `RECIPES` tu:

```text
recipe_id | product_id | refined_id | quantity | unit
```

thanh:

```text
recipe_id | product_id | material_type | material_id | quantity | unit
```

ma khong migrate cac row cu, thi du lieu cu se bi lech nghia theo cot moi.

### Cach nhan biet
- `Products.gs` co doan rewrite header bang `setValues([newHeaders])`
- `review.json` noi den `compatibility`, `legacy`, `old schema`, hoac `row cu bi lech cot`
- `getRecipeByProduct()` co fallback nhung fallback chi dung neu row cu van gan voi header cu hoac da migrate dung

### Cach xu ly chuan
1. Khong chap nhan header-only migration.
2. Chon 1 trong 2 huong:
   - migrate toan bo row cu sang schema moi truoc khi save tiep
   - ho tro dual-schema that su, khong rewrite header tu dong
3. Yeu cau evidence cho row cu chi co `refined_id`: render dung, save lai dung, khong doi nham `quantity` thanh `material_id`.

### Phong tranh
- Trong T003, DoD phai noi ro `row cu van render/save dung`.
- Machine check nen canh bao khi thay pattern rewrite header ma khong co dau hieu migration/legacy handling.
- Neu reviewer thay diff ngoai recipe/docs thi coi do la scope violation that, khong manual rescue nhu T001/T002.

---

## Checklist

| # | Cau hoi | Neu YES |
|---|---|---|
| 1 | Check dang chay trong workspace con? | Dung `../src/...` thay vi `QuanLyCF/src/...` |
| 2 | `git diff` co file cua task truoc? | Kha nang cao la cumulative diff |
| 3 | `coder_report.txt` chi liet ke file dung scope? | Can nhac manual rescue thay vi block |
| 4 | Machine checks PASS nhung reviewer van doi evidence? | Xem lai DoD integration va can nhac bo sung check sat hon |
