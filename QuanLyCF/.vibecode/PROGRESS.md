# 📊 PROGRESS — QuanLyCF
**Bắt đầu:** 2026-03-26
**Cập nhật lần cuối:** 2026-04-11

---

## Tổng Quan

| Metric | Giá trị |
|--------|---------|
| Tổng tasks | 22 |
| Hoàn thành | 22 |
| Đang làm | 0 |
| Pending | 0 |
| Fix iterations | 5 |

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

| Task | Tên | Status | Dep | Ưu tiên |
|------|-----|--------|-----|---------|
| 001 | Setup Google Sheets (14 Sheets + Schema + Seed) | ✅ DONE | — | P0 |
| 002 | Auth System + App Shell + Login Page | ✅ DONE | 001 | P0 |
| 003 | Dashboard (KPI Cards + Chart 7 ngày) | ✅ DONE | 002 | P0 |
| 004 | Kho: Sản Phẩm & Danh Mục | ✅ DONE | 002 | P0 |
| 005 | Kho: NVL Thô, NVL Tinh Chế, Nhập Hàng, NCC | ✅ DONE | 004 | P0 |
| 006 | Recipe Management (Công Thức) | ✅ DONE | 004,005 | P0 |
| 007 | Sơ Chế (NVL thô → NVL tinh chế) | ✅ DONE | 005 | P0 |
| 008 | QR Menu (Menu Công Khai + Tạo Đơn QR) | ✅ DONE | 004,002 | P0 |
| 009 | POS + Danh Sách Đơn + Hoàn Tất Đơn + Trừ Kho | ✅ DONE | 006,008 | P0 |
| 010 | Hồ Sơ Nhân Viên & Quản Lý User | ✅ DONE | 002 | P1 |
| 011 | Chấm Công (Nút VÀO CA / RA CA + Bảng Tháng) | ✅ DONE | 010 | P1 |
| 012 | Thu Chi | ✅ DONE | 002 | P1 |
| 013 | Báo Cáo Doanh Thu (Filter + Chart + Top SP) | ✅ DONE | 009,003 | P1 |
| 014 | Cài Đặt (QR Bàn + Thông Tin Quán + Ca) | ✅ DONE | 002 | P1 |

---

## Phase 3 — MOBILE RESPONSIVE ✅ DONE (4/4)

| Task | Tên | Status | Dep | Ghi chú |
|------|-----|--------|-----|---------|
| M01 | CSS Responsive: Layout Shell + Sidebar Drawer | ✅ DONE | 014 | Sidebar drawer + overlay |
| M02 | Bottom Navigation Bar (Mobile) | ✅ DONE | M01 | 5 tab + phân quyền role |
| M03 | Fix Grid Layouts + POS 2-Tab Mobile | ✅ DONE | M02 | POS 2-tab + grid overrides |
| M_FIX | Fix CSS selectors + base rules (sau review) | ✅ DONE | M01–M03 | PASS sau 1 lần review |

---

## Phase 4 — MAINTENANCE & FIXES ✅ DONE (4/4)

| Task | Tên | Status | Dep | Iterations | Ghi chú |
|------|-----|--------|-----|------------|---------|
| 015 | Khôi phục Module Sản phẩm (UI/Backend) | ✅ DONE | 014 | 2 | Fix lỗi missing include sau review |
| 016 | Chuẩn hóa Try-Catch & Error Handling | ✅ DONE | 015 | 1 | Backend & Frontend error patterns |
| 017 | GAS OAuth Scopes & Diagnostic Endpoint | ✅ DONE | 016 | 1 | Fix permission crash trên V8 |
| 018 | Fix V8 Date Serialization Bug | ✅ DONE | 017 | 1 | Chuyển Date native sang String |
| 019 | Fix Settings Form Submission Crash | ✅ DONE | 018 | 1 | Inline onsubmit + scoped querySelector |
| 020 | Fix Settings Data Display | ✅ DONE | 019 | 1 | Use activeContainer.querySelector for settings data |
| 021 | Fix HTML Time Input Rejection (Format HH:mm) | ✅ DONE | 020 | 1 | Add parseTime helper to ensure HH:mm format |

---

## Decisions Log

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 2026-03-25 | Platform: GAS + Google Sheets | Zero cost, Google ecosystem |
| 2026-03-25 | No JS framework | GAS giới hạn bundle, Vanilla đủ dùng |
| 2026-03-25 | Trừ kho khi hoàn tất đơn | Tránh trừ nhầm khi hủy |
| 2026-03-25 | Tab Sơ Chế riêng | Ghi log rõ ràng, tránh nhầm lẫn |
| 2026-03-25 | Server timestamp chấm công | Không nhập tay, không gian lận |
| 2026-04-06 | Bottom Nav 5 tab + Sidebar Drawer | Mobile-first: nav dễ chạm + truy cập đủ menu |
| 2026-04-10 | Sử dụng clasp để đồng bộ code | Chuyên nghiệp hơn copy-paste, tránh sai sót file |
| 2026-04-10 | Ép kiểu String() khi so sánh ID | Tránh lỗi so sánh Number vs String từ Sheets |
| 2026-04-11 | Chuyển Date native sang String | GAS V8 silently trả về null khi gửi Date object qua client |
