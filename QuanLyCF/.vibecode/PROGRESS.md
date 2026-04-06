# 📊 PROGRESS — QuanLyCF
**Bắt đầu:** 2026-03-26
**Cập nhật lần cuối:** 2026-04-06

---

## Tổng Quan

| Metric | Giá trị |
|--------|---------|
| Tổng tasks | 18 |
| Hoàn thành | 18 |
| Đang làm | 0 |
| Pending | 0 |
| Fix iterations | 2 |

---

## Phase 1 — PLANNING ✅ DONE

| Step | Nội dung | Status |
|------|----------|--------|
| Vision | Phân tích app mẫu, xác định loại project | ✅ DONE |
| Context | Anh cung cấp yêu cầu: QR order, recipe, sơ chế, chấm công | ✅ DONE |
| Blueprint | `.vibecode/BLUEPRINT.md` tạo xong | ✅ DONE |
| Contract | `.vibecode/CONTRACT.md` tạo xong | ✅ DONE |

---

## Phase 2 — ORCHESTRATION ✅ DONE (14/14)

| Task | Tên | Sprint | Status | Dep | Ưu tiên |
|------|-----|--------|--------|-----|---------|
| 001 | Setup Google Sheets (14 Sheets + Schema + Seed) | S1 | ✅ DONE | — | P0 |
| 002 | Auth System + App Shell + Login Page | S1 | ✅ DONE | 001 | P0 |
| 003 | Dashboard (KPI Cards + Chart 7 ngày) | S1 | ✅ DONE | 002 | P0 |
| 004 | Kho: Sản Phẩm & Danh Mục | S2 | ✅ DONE | 002 | P0 |
| 005 | Kho: NVL Thô, NVL Tinh Chế, Nhập Hàng, NCC | S2 | ✅ DONE | 004 | P0 |
| 006 | Recipe Management (Công Thức) | S2 | ✅ DONE | 004,005 | P0 |
| 007 | Sơ Chế (NVL thô → NVL tinh chế) | S2 | ✅ DONE | 005 | P0 |
| 008 | QR Menu (Menu Công Khai + Tạo Đơn QR) | S3 | ✅ DONE | 004,002 | P0 |
| 009 | POS + Danh Sách Đơn + Hoàn Tất Đơn + Trừ Kho | S3 | ✅ DONE | 006,008 | P0 |
| 010 | Hồ Sơ Nhân Viên & Quản Lý User | S4 | ✅ DONE | 002 | P1 |
| 011 | Chấm Công (Nút VÀO CA / RA CA + Bảng Tháng) | S4 | ✅ DONE | 010 | P1 |
| 012 | Thu Chi | S5 | ✅ DONE | 002 | P1 |
| 013 | Báo Cáo Doanh Thu (Filter + Chart + Top SP) | S5 | ✅ DONE | 009,003 | P1 |
| 014 | Cài Đặt (QR Bàn + Thông Tin Quán + Ca) | S5 | ✅ DONE | 002 | P1 |

---

## Phase 3 — MOBILE RESPONSIVE ✅ DONE (4/4)

| Task | Tên | Sprint | Status | Dep | Iterations | Ghi chú |
|------|-----|--------|--------|-----|------------|---------|
| M01 | CSS Responsive: Layout Shell + Sidebar Drawer | Mobile | ✅ DONE | 014 | 1 | Sidebar drawer + overlay |
| M02 | Bottom Navigation Bar (Mobile) | Mobile | ✅ DONE | M01 | 1 | 5 tab + phân quyền role |
| M03 | Fix Grid Layouts + POS 2-Tab Mobile | Mobile | ✅ DONE | M02 | 1 | POS 2-tab + grid overrides |
| M_FIX | Fix CSS selectors + base rules (sau review) | Mobile | ✅ DONE | M01–M03 | 1 | PASS sau 1 lần review |

---

## Decisions Log

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 2026-03-25 | Platform: GAS + Google Sheets | Zero cost, Google ecosystem |
| 2026-03-25 | No JS framework | GAS giới hạn bundle, Vanilla đủ dùng |
| 2026-03-25 | Trừ kho khi hoàn tất đơn | Tránh trừ nhầm khi hủy |
| 2026-03-25 | Tab Sơ Chế riêng | Ghi log rõ ràng, tránh nhầm lẫn |
| 2026-03-25 | Server timestamp chấm công | Không nhập tay, không gian lận |
| 2026-03-25 | Loại bỏ quản lý bàn | Order → in bill → thanh toán ngay |
| 2026-04-06 | Bottom Nav 5 tab + Sidebar Drawer | Mobile-first: nav dễ chạm + truy cập đủ menu |
| 2026-04-06 | POS mobile dùng 2-tab pattern | UX tốt hơn stack dọc, không cần scroll dài |
| 2026-04-06 | CSS selector target #pageBody | Template HTML được inject vào #pageBody khi navigate, không phải #templateId |
