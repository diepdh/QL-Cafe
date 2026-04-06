# TASK #001: Setup Google Sheets Database (14 Sheets + Schema)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 45 phút
**Phụ thuộc:** Không có

---

## 🎯 MỤC TIÊU

Tạo Google Spreadsheet với đầy đủ 14 sheets theo đúng schema đã định nghĩa trong CODER_PACK, bao gồm header columns và dữ liệu seed mẫu. Đây là nền tảng database cho toàn bộ ứng dụng.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo Google Spreadsheet mới, đặt tên "QuanLyCF-DB"
- [ ] Tạo đủ 14 sheets với tên chính xác: `CONFIG`, `USERS`, `STAFF`, `CATEGORIES`, `PRODUCTS`, `RAW_MATERIALS`, `REFINED_MATERIALS`, `RECIPES`, `ORDERS`, `ORDER_ITEMS`, `PROCUREMENT`, `SUPPLIERS`, `PROCESSING_LOG`, `ATTENDANCE`, `CASHFLOW`
- [ ] Tạo **header row (row 1)** cho mỗi sheet theo đúng schema trong CODER_PACK
- [ ] Seed dữ liệu mẫu vào CONFIG (tên quán, ca làm việc, bàn B01-B05)
- [ ] Seed 1 user admin vào USERS: username=`admin`, password=`12345678` (plain text tạm thời), role=`admin`
- [ ] Seed 3 categories mẫu: Cà Phê, Trà, Nước Ép
- [ ] Seed 3 sản phẩm mẫu và 3 NVL thô / 2 NVL tinh chế / 1 recipe mẫu
- [ ] Tạo file `src/Utils.gs` với SPREADSHEET_ID đã điền và các helper functions: `getSheet()`, `getSheetData()`, `generateId()`

### Không làm (DO NOT):
- ❌ Không tạo GAS Web App hay HTML files (task sau)
- ❌ Không implement logic business (task sau)
- ❌ Không tạo sheet nào ngoài 14 sheets đã liệt kê

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Utils.gs    ← SPREADSHEET_ID + helper functions (getSheet, getSheetData, generateId)
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Utils.gs cần implement:

```javascript
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';

function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function generateId(prefix) {
  const date = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + '-' + date + '-' + rand;
}

function appendRow(sheetName, rowData) {
  const sheet = getSheet(sheetName);
  sheet.appendRow(rowData);
}

function findRowByField(sheetName, fieldName, value) {
  const data = getSheetData(sheetName);
  return data.find(row => row[fieldName] === value) || null;
}
```

### Dữ liệu seed CATEGORIES:
```
category_id | name      | sort_order
CAT-001     | Cà Phê    | 1
CAT-002     | Trà       | 2
CAT-003     | Nước Ép   | 3
```

### Dữ liệu seed PRODUCTS:
```
product_id | name            | category_id | price  | status
PRD-001    | Cà Phê Sữa Đá   | CAT-001     | 35000  | active
PRD-002    | Trà Đào          | CAT-002     | 30000  | active
PRD-003    | Nước Cam Ép      | CAT-003     | 40000  | active
```

---

## 🏁 DEFINITION OF DONE

- [ ] Spreadsheet tồn tại, có thể mở qua link
- [ ] Đúng 14 sheets, đúng tên (case sensitive)
- [ ] Mỗi sheet có header row đúng theo schema CODER_PACK
- [ ] CONFIG có đủ key: cafe_name, shift_morning/afternoon/evening, tables
- [ ] USERS có 1 dòng admin
- [ ] `src/Utils.gs` tạo xong, SPREADSHEET_ID đã điền, có thể `getSheetData('CONFIG')` không lỗi
- [ ] Ghi SPREADSHEET_ID vào TASK_001_REPORT để Brain và task sau dùng

---

## 📌 GHI CHÚ CHO CODER

> SPREADSHEET_ID lấy từ URL: `https://docs.google.com/spreadsheets/d/**[ID_NÀY]**/edit`
> Ghi ID vào cả Report để các task sau tham chiếu.
> Password hash sẽ làm đúng ở TASK_002 (Auth). Task này dùng plain text tạm.
