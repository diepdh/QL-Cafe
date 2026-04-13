# TASK #017: Fix Root Cause — GAS OAuth Scope + Diagnostic Endpoint
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-10
**Ưu tiên:** P0 (Critical — toàn bộ data API trả về null)
**Ước tính:** 20 phút
**Phụ thuộc:** TASK_016 (PASS — frontend đã sẵn sàng)

---

## 🎯 ROOT CAUSE ĐÃ XÁC ĐỊNH

Sau điều tra, có **2 lỗi gốc rễ** cùng tồn tại:

### Lỗi #1 — `appsscript.json` thiếu OAuth Scopes (CRITICAL)

File `src/appsscript.json` hiện tại:
```json
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_DEPLOYING"
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

**Thiếu trường `oauthScopes`** — GAS V8 với `executeAs: USER_DEPLOYING` yêu cầu khai báo rõ ràng OAuth scopes. Nếu không khai báo, khi code gọi `SpreadsheetApp.openById()` hoặc `PropertiesService.getScriptProperties()`, GAS ném **Runtime-level exception** (không phải Script-level) → `try-catch` không bắt được → `withSuccessHandler(null)` bị trigger → frontend nhận `null` → hiện "Không xác định".

### Lỗi #2 — Cần diagnostic endpoint để xác nhận deployment

Không có cách nào biết code mới đã lên server hay chưa vì không có version marker.

---

## 📋 YÊU CẦU CHI TIẾT

### Step 1: Thêm OAuth Scopes vào `appsscript.json`

```json
{
  "timeZone": "Asia/Ho_Chi_Minh",
  "dependencies": {},
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/script.scriptapp"
  ],
  "webapp": {
    "access": "ANYONE",
    "executeAs": "USER_DEPLOYING"
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```

**File:** `src/appsscript.json`

### Step 2: Thêm Diagnostic Endpoint vào `Code.gs`

Thêm vào cuối `Code.gs`:

```javascript
/**
 * [DIAGNOSTIC] Endpoint để kiểm tra deployment và API health
 * Truy cập: https://script.google.com/.../exec?page=diagnostic
 */
function runDiagnostic() {
  const results = { version: 'TASK_017', timestamp: new Date().toISOString() };
  try {
    const ss = SpreadsheetApp.openById('1El4U6sCqolDR33A5o0_Z68IL8TOfBH09GQuK610SwUk');
    results.spreadsheet_access = 'OK';
    results.sheets = ss.getSheets().map(s => s.getName());
  } catch(e) {
    results.spreadsheet_access = 'FAILED: ' + e.message;
  }
  try {
    PropertiesService.getScriptProperties().setProperty('_diag_test', '1');
    results.properties_access = 'OK';
  } catch(e) {
    results.properties_access = 'FAILED: ' + e.message;
  }
  return results;
}
```

**VÀ** thêm handler trong `doGet`:

```javascript
// Thêm vào trước dòng "if (page === 'menu')" trong hàm doGet
if (page === 'diagnostic') {
  const diagResult = runDiagnostic();
  return ContentService.createTextOutput(JSON.stringify(diagResult, null, 2))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

### Step 3: Push và Deploy

**Bắt buộc thực hiện đúng thứ tự:**

```
1. clasp push
2. Mở GAS Editor: https://script.google.com/
3. Deploy > Manage Deployments > Edit (deployment đang dùng) > New Version > Deploy
4. Copy URL > Thêm ?page=diagnostic vào cuối URL để kiểm tra
```

Kết quả diagnostic phải trả về JSON:
```json
{
  "version": "TASK_017",
  "spreadsheet_access": "OK",
  "properties_access": "OK"
}
```

Nếu thấy "FAILED" → báo cáo lỗi cụ thể để Brain xử lý tiếp.

---

## 📁 FILES CẦN SỬA

```
src/appsscript.json    ← THÊM oauthScopes (thay đổi chính)
src/Code.gs            ← THÊM runDiagnostic() + doGet handler
```

> [!WARNING]
> Chỉ sửa 2 file trên, KHÔNG động vào các file .gs khác hay .html khác.

---

## 🏁 DEFINITION OF DONE

- [ ] `src/appsscript.json` có trường `oauthScopes` đầy đủ.
- [ ] `src/Code.gs` có hàm `runDiagnostic()` và doGet xử lý `?page=diagnostic`.
- [ ] Sau khi `clasp push` + Deploy mới, truy cập `?page=diagnostic` trả về JSON với `spreadsheet_access: "OK"`.
- [ ] Sau khi deploy mới, tab Sản Phẩm hiển thị dữ liệu (hoặc thông báo lỗi CÓ NỘI DUNG, không phải "Không xác định").
- [ ] Báo cáo TASK_017_REPORT ghi rõ kết quả diagnostic JSON đã nhận được.

---

## ⚠️ LƯU Ý CHO CODER

> [!CAUTION]
> Sau khi thêm `oauthScopes`, lần deploy đầu tiên GAS sẽ yêu cầu **xác nhận lại quyền (Re-authorize)**. Anh cần đăng nhập lại và chấp nhận quyền mới. Đây là bình thường.

> [!NOTE]
> Nếu kết quả diagnostic vẫn báo `spreadsheet_access: "FAILED"` sau khi đã Re-authorize, lỗi có thể do Spreadsheet ID sai hoặc tài khoản Google deploy không có quyền truy cập spreadsheet đó.
