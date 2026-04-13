# 🧠 LESSONS LEARNED: QuanLyCF
## Vibecode v5.0 — Maintenance Sprint
**Dự án:** Quản Lý Quán Cafe (SaaS GAS/Sheets)
**Hoàn thành:** 2026-04-11

---

## 🔨 LESSONS CHO CODER (Execution)

### 🔴 CÁC CÁI BẪY CỰC NGUY HIỂM TRÊN GAS V8

#### 1. Lỗi Serialize Date (Silent Null)
- **Vấn đề:** Khi dùng `google.script.run`, nếu Server trả về một Object/Array có chứa đối tượng `Date` nguyên bản (Native JS Date), Engine V8 đôi khi sẽ chặn lại và trả về `null` cho Client mà KHÔNG báo lỗi.
- **Cách tránh:** Luôn chuyển đổi `Date` thành `String` ở Backend trước khi return.
- **Pattern chuẩn:**
```javascript
if (val instanceof Date) {
  val = Utilities.formatDate(val, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
}
```

#### 2. Lỗi Runtime Permission (ExecuteAs: User Deploying)
- **Vấn đề:** Khi Web App cấu hình chạy dưới quyền người Deploy (`executeAs: USER_DEPLOYING`), GAS yêu cầu khai báo tường minh `oauthScopes` trong `appsscript.json`. Nếu thiếu, các hàm như `SpreadsheetApp.openById()` sẽ crash ngay lập tức ở mức Runtime, khiến Frontend nhận về `null`.
- **Cách tránh:** Luôn khai báo đầy đủ các Scopes cần thiết trong Manifest file.

#### 3. Lỗi so sánh ID (Number vs String)
- **Vấn đề:** Google Sheets thỉnh thoảng tự định dạng các ID chỉ có số (như `101`) thành kiểu Number. Khi code dùng `===` để so sánh với String từ Frontend (`"101"`), phép so sánh sẽ trả về `false`.
- **Cách tránh:** Luôn ép kiểu `String()` cho cả hai vế trước khi so sánh ID.

### ✅ PATTERN KHUYÊN DÙNG

#### Backend Error Handling
Luôn bọc toàn bộ thân hàm trong `try-catch` và trả về một Object có key `error`. Tuyệt đối không để hàm crash tự do.
```javascript
function getMyData(token) {
  try {
    // ... logic ...
    return { success: true, data: result };
  } catch(e) {
    return { error: 'TênHàm lỗi: ' + e.message };
  }
}
```

#### Frontend Resilience
Sử dụng cả `withSuccessHandler` (để check `{error: ...}`) và `withFailureHandler` (để check lỗi mạng/timeout).
```javascript
google.script.run
  .withSuccessHandler(res => {
    if (!res || res.error) {
      showError(res ? res.error : 'Lỗi không xác định');
      return;
    }
    render(res);
  })
  .withFailureHandler(err => showError('Lỗi kết nối: ' + err.message))
  .backendFunction();
```

---

## 🚀 CẢI TIẾN QUY TRÌNH

- **Deployment:** Sử dụng công cụ **clasp** giúp việc đồng bộ 22+ file HTML/GS trở nên chính xác 100%, loại bỏ hoàn toàn lỗi "quên copy file" hoặc "copy đè nhầm" khi làm việc với hệ thống Component hóa của GAS.
- **Diagnostics:** Mỗi dự án GAS nên có một endpoint `?page=diagnostic` để kiểm tra nhanh quyền truy cập Spreadsheet và Version của code đã được Deploy chưa.

---
*"Mỗi bug là một viên gạch xây nên hệ thống vững chắc hơn."*
