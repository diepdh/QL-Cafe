# WORKSPACE CONVENTIONS — QuanLyCF
**Dự án:** Phần Mềm Quản Lý Quán Cafe
**Brain:** Antigravity (AI)
**Cập nhật:** 2026-03-26

---

## 1) Thứ Tự Ưu Tiên Rule

1. Task file (DoD/constraints trong `.vibecode/tasks/TASK_*.md`)
2. `.vibecode/BLUEPRINT.md`
3. `.vibecode/CODER_PACK.md`
4. `.vibecode/WORKSPACE_CONVENTIONS.md` (file này)
5. Global Coder Contract

---

## 2) Cấu Trúc Thư Mục

```
QuanLyCF/
├── .vibecode/
│   ├── BLUEPRINT.md
│   ├── CONTRACT.md
│   ├── CODER_PACK.md
│   ├── SKILL_REQUIREMENTS.md
│   ├── WORKSPACE_CONVENTIONS.md
│   ├── PROGRESS.md
│   ├── FINAL_REPORT.md
│   ├── LESSONS.md
│   └── tasks/
│       ├── TASK_001.md
│       ├── TASK_001_REPORT.md
│       ├── TASK_001_REVIEW.md
│       └── ...
│
└── src/
    ├── *.gs                   ← Apps Script backend files
    └── pages/
        ├── *.html             ← HTML templates
        └── components/
            └── *.js           ← JS modules
```

---

## 3) Naming Conventions

### 3.1 Tasks
- Task file: `.vibecode/tasks/TASK_001.md` (3 chữ số, zero-pad)
- Report: `TASK_001_REPORT.md`
- Review: `TASK_001_REVIEW.md`
- Fix: `TASK_001_FIX.md`, `TASK_001_FIX_2.md`

### 3.2 Source Files
- GAS backend: `PascalCase.gs` (ví dụ: `Orders.gs`, `Inventory.gs`)
- HTML pages: `kebab-case.html` (ví dụ: `qr-menu.html`)
- JS components: `camelCase.js` (ví dụ: `dashboard.js`)
- Sheet names: `UPPER_SNAKE_CASE` (ví dụ: `ORDER_ITEMS`)
- ID format: `PREFIX-NNN` (ví dụ: `ORD-001`, `PRD-001`, `STF-001`)

### 3.3 Sheet Column Naming
- Tất cả column header dùng `snake_case` tiếng Anh
- ID columns luôn là cột đầu tiên
- Timestamps: `created_at`, `updated_at`, `completed_at`

---

## 4) Đường Dẫn Tham Chiếu

- Luôn dùng workspace-relative path: `src/Orders.gs`, `.vibecode/tasks/TASK_001.md`
- Khi báo lỗi: ghi rõ file + function + dòng: `src/Orders.gs::completeOrder()#L45`

---

## 5) Format Báo Cáo (Bắt Buộc)

Coder trả về `RESULT REPORT`:
```
RESULT REPORT
- Objective met: yes/no + lý do
- Files changed/created: [danh sách path]
- Commands/tests run: [lệnh + kết quả]
- Notes/assumptions: [nếu có]
- Risks/known gaps: [nếu có]
```

---

## 6) GAS-Specific Rules

- Mỗi `.gs` file tối đa 300 dòng — tách file nếu vượt
- Dùng `LockService` khi ghi vào ORDERS, ATTENDANCE (tránh race condition)
- ID generation: `Utils.generateId(prefix)` — không hardcode ID
- Mọi function public (được gọi từ frontend) phải validate session token trước
- Exception của QR Menu: route `page=menu` là public, bỏ qua auth check

---

## 7) Encoding

- File markdown: UTF-8
- Tránh ký tự đặc biệt trong tên file (dùng `-` thay khoảng trắng)

---

## 8) Cần Xin Phê Duyệt Trước

Coder dừng và báo Brain nếu:
- Thêm sheet mới ngoài 14 sheets đã định nghĩa
- Đổi schema (thêm/xóa/đổi tên column) của sheet hiện có
- Thêm thư viện/CDN ngoài đã liệt kê trong Blueprint
- Thay đổi vượt scope task/DoD
