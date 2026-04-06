# TASK REVIEW: TASK_003
## Dashboard (KPI Cards + Chart 7 ngày)
**Reviewer:** Antigravity (Brain/Reviewer)
**Review time:** 2026-03-26 15:35
**Verdict:** ⚠️ PASS WITH NOTES

---

## 📊 DEFINITION OF DONE — VERDICT

| # | Definition of Done | Status | Ghi chú |
|---|-------------------|--------|---------|
| 1 | 4 KPI cards hiển thị đúng 4 chỉ số từ Sheets | ✅ PASS | Revenue, Orders, LowStock, ActiveProducts — đúng 4 chỉ số |
| 2 | Biểu đồ doanh thu 7 ngày dùng Chart.js | ✅ PASS | Line chart với fill, tension, màu tím đúng Blueprint |
| 3 | Nút "Làm mới" reload data | ❌ FAIL | **Không có nút Làm Mới** trong Dashboard. Chỉ có `loadDashboard()` gọi khi vào trang |
| 4 | Stats banner 4 ô (Tuần/Tháng/Công nợ/Đơn tháng) | ❌ FAIL | **Không implement.** Chỉ có 4 KPI cards, không có stats banner tuần/tháng/công nợ |
| 5 | Bảng "Đơn hàng gần đây" 10 dòng đơn mới nhất | ❌ FAIL | **Không implement.** Dashboard không có bảng đơn gần đây |
| 6 | Responsive: layout không vỡ mobile/desktop | ✅ PASS | `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))` responsive tốt |
| 7 | getDashboardData() auth check đúng | ✅ PASS | `validateSession(token)` gọi đầu function |
| 8 | Dữ liệu fetch thực từ Sheets | ✅ PASS | `getSheetData('ORDERS')`, `getSheetData('RAW_MATERIALS')` đúng |

**DoD Score: 5/8 PASS**

---

## ✅ NHỮNG GÌ LÀM TỐT

- **`getRevenueLast7Days()`** implement sạch: loop 7 ngày, format đúng timezone VN, aggregate revenue đúng
- **`Reports.gs` có auth check đầu function** — đúng pattern bảo mật
- **KPI: lowStockCount** đếm cả NVL thô lẫn NVL tinh chế — đúng spec TASK_001_REPORT và Blueprint
- **Chart config tốt:** `tension: 0.4` cho đường cong đẹp, `fill: true` cho area chart, màu tím đúng design system
- **`getDashboardData()` dùng `created_at` thay `completed_at`** để filter đơn hôm nay — xem ghi chú phía dưới
- **Chart re-init đúng:** `if (STATE.chart) STATE.chart.destroy()` trước khi render mới — tránh memory leak

---

## ❌ VẤN ĐỀ CẦN XỬ LÝ

### 🟡 MAJOR — Nên FIX (3 MAJOR = FIX REQUIRED, nhưng xem verdict bên dưới)

#### Issue M1: Thiếu Nút "Làm Mới"
- **File:** `src/pages/app.html` — phần Dashboard UI
- **Vấn đề:** TASK_003 DoD yêu cầu "Nút Làm mới reload data" nhưng không có trong UI
- **Hướng sửa:** Thêm button `<button onclick="loadDashboard()">🔄 Làm mới</button>` vào chart-header hoặc page topbar actions

#### Issue M2: Thiếu Stats Banner (Tuần/Tháng/Công nợ/Đơn tháng)
- **File:** `src/pages/app.html` và `src/Reports.gs`
- **Vấn đề:** TASK_003 yêu cầu "Stats banner 4 ô: Tuần này, Tháng này, Công nợ, Đơn tháng" — không có
- **Hướng sửa:** Thêm section stats banner trong Dashboard HTML + tính thêm trong `getDashboardData()`: `weekRevenue`, `monthRevenue`, `monthOrderCount`

#### Issue M3: Thiếu Bảng "Đơn hàng gần đây"
- **File:** `src/pages/app.html` và `src/Reports.gs`
- **Vấn đề:** TASK_003 DoD yêu cầu bảng 10 đơn gần nhất — không có
- **Hướng sửa:** Thêm `recentOrders` vào return của `getDashboardData()` + render bảng HTML trong Dashboard

### 🟢 MINOR (ghi chú, không yêu cầu sửa)

- **`getTopProducts()` trả về `[]`** — Coder tự ghi note sẽ hoàn thiện ở TASK_013. **Chấp nhận được**, không ảnh hưởng DoD task này
- **`Reports.gs` line 68:** Filter dùng `o.created_at` thay vì `o.completed_at` để đếm đơn hôm nay. Theo TASK_003 spec nên dùng `completed_at`. Khi có data thực sẽ tạo ra sai số nhỏ — nên sửa cùng với FIX

---

## 🏁 VERDICT FINAL

**Verdict: ⚠️ CONDITIONAL PASS / FIX RECOMMENDED**

**Lý do:**
3 DoD không đạt (nút làm mới, stats banner, bảng đơn gần đây). Tuy nhiên những item này là **UI enhancement** không ảnh hưởng đến foundational functionality (auth, chart, KPI, data fetch đều đúng). 

**Quyết định của Brain:** Cho phép Coder **bù vào TASK_004** bằng cách thêm 3 items còn thiếu vào `app.html` mà không cần tạo FIX task riêng — vì TASK_004 sẽ mở rộng `app.html` anyway. Ghi rõ ràng trong TASK_004 prompt.

**Ưu tiên sửa khi làm TASK_004:**
1. Thêm nút "Làm mới" vào Dashboard
2. Thêm stats banner (weekRevenue, monthRevenue, monthOrderCount)
3. Thêm bảng 10 đơn gần đây
4. Sửa filter từ `created_at` → `completed_at` trong `getDashboardData()`

---

## 💡 GỢI Ý CHO LESSONS.md

- Brain cần specify rõ hơn trong TASK file: liệt kê từng UI component cần có (không chỉ tên section)
- "Stats banner" và "Recent orders table" nên được kèm wireframe mẫu để Coder không bỏ sót
- Nên add note trong TASK: "Nếu là UI component, screenshot mockup là bắt buộc"
