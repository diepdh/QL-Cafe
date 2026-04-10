# TASK REVIEW: TASK_015
## Khôi Phục Module Quản Lý Sản Phẩm (Products UI)
**Reviewer:** Antigravity
**Review time:** 2026-04-10
**Verdict:** ❌ FIX REQUIRED

---

## 📊 DEFINITION OF DONE — VERDICT

| # | Definition of Done | Status | Ghi chú |
|---|-------------------|--------|---------|
| 1 | Click vào menu "Sản Phẩm" hiện ra đúng lưới giao diện. | ❌ FAIL | Sẽ bị crash màn hình trắng do `productsTemplate` không tồn tại trong DOM. |
| 2 | Dữ liệu fetch từ Google Sheets (`PRODUCTS`) hiển thị đúng. | ✅ PASS | Đã logic mapping dữ liệu tốt. |
| 3 | Nút "Thêm Sản Phẩm" mở Modal và có Select List chọn danh mục. | ✅ PASS | Đã dựng hoàn chỉnh HTML cho phần này. |
| 4 | Thêm mới và Sửa sản phẩm thành công. | ✅ PASS | Logic `onsubmit` đã bind đủ data và gọi API. |
| 5 | File template được nhúng sạch sẽ ở cuối `app.html`. | ❌ FAIL | Coder quên hoàn toàn bước nhúng component. |

**DoD Score:** 3/5 passed

---

## ✅ NHỮNG GÌ LÀM TỐT

• Code chia component `products.html` rất sạch sẽ, tách biệt modal và table.
• Xử lý fallback cho ảnh bị hỏng (`onerror="this.src=..."`) là một chi tiết UX rất tử tế.
• `app.html` đã được bổ sung case `else if (id === 'products')` trong logic Router rất chính xác.

---

## ❌ VẤN ĐỀ CẦN XỬ LÝ

### 🔴 CRITICAL

#### Issue 1: Thiếu Include Component dẫn đến Crash Ứng dụng
- **File:** `src/pages/app.html`
- **Vấn đề:** Ở cuối file `app.html` (khoảng dòng 1074), Coder đã quên không chèn câu lệnh include file HTML. Khi Click tab Sản phẩm, JS cố đọc `document.getElementById('productsTemplate').innerHTML` sẽ ném ra lỗi `Cannot read properties of null` và gây kẹt ứng dụng (trắng xoá hoặc đứng im).
- **Tại sao critical:** Ngăn chặn hoàn toàn việc hiển thị trang, vi phạm nghiêm trọng DoD.
- **Hướng sửa:** Phải bổ sung dòng `<?!= include('pages/components/products') ?>` vào danh sách các thẻ include ở cuối file `app.html` (trước `</body>`).
