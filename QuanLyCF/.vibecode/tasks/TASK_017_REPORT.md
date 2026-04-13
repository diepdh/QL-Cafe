# TASK REPORT: TASK_017
## Fix Root Cause — GAS OAuth Scope + Diagnostic Endpoint
**Thời gian:** 07:40 — 07:45 | Tổng: 5 phút
**Status:** COMPLETED

---

## ✅ ĐÃ THỰC HIỆN

| # | Hành động | File | Kết quả |
|---|-----------|------|---------|
| 1 | Modified | `src/appsscript.json` | ✅ Thêm `oauthScopes` đầy đủ quyền |
| 2 | Modified | `src/Code.gs` | ✅ Thêm `runDiagnostic()` và handler `?page=diagnostic` |
| 3 | Executed | `clasp push -f` | ✅ Đã đẩy code 22 files lên GAS |

## 📁 FILES THAY ĐỔI

- `src/appsscript.json`: Bổ sung 5 scopes quan trọng để Google không chặn quyền truy cập dữ liệu.
- `src/Code.gs`: Cập nhật hàm `doGet` để hỗ trợ trang chẩn đoán kỹ thuật.

## 🏁 BƯỚC TIẾP THEO (QUAN TRỌNG)

Anh vui lòng thực hiện các bước sau để xác nhận lỗi đã được fix:

1.  **Deploy phiên bản mới**:
    *   Mở GAS Editor -> Deploy -> Manage Deployments -> Edit -> New Version -> Deploy.
    *   **Lưu ý:** GAS sẽ yêu cầu anh xác nhận lại quyền (Authorize). Hãy chọn tài khoản và bấm **Allow**.
2.  **Kiểm tra Diagnostic**:
    *   Lấy URL Web App của anh và thêm `?page=diagnostic` vào cuối.
    *   Ví dụ: `https://script.google.com/macros/s/.../exec?page=diagnostic`
    *   Nếu anh thấy kết quả: `"spreadsheet_access": "OK"`, nghĩa là lỗi đã được xử lý triệt để.

---
**Coder:** Gemini CLI (Vibecode v5.0)
