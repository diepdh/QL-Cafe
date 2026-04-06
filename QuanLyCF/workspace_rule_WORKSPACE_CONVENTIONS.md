# WORKSPACE CONVENTIONS (Template) — Vibecode v5
**Mục tiêu:** Chuẩn hóa `cấu trúc thư mục`, `đường dẫn tham chiếu`, `naming`, và `format báo cáo` để Brain/Coder/Reviewer phối hợp nhất quán trong một workspace.

**Phạm vi:** Đây là **workspace rule**. Khi khởi tạo dự án, Brain copy/đặt file này vào `.vibecode/WORKSPACE_CONVENTIONS.md` và điền theo dự án.

---

## 1) Thứ Tự Ưu Tiên Rule

1. Task file (DoD/constraints trong `.vibecode/tasks/TASK_*.md`)
2. `.vibecode/BLUEPRINT.md`
3. `.vibecode/CODER_PACK.md`
4. `.vibecode/WORKSPACE_CONVENTIONS.md` (file này)
5. Global contracts (brain/coder/reviewer)

---

## 2) Cấu Trúc Thư Mục Chuẩn (Baseline)

Bắt buộc có:
```
[project-root]/
└── .vibecode/
    ├── BLUEPRINT.md
    ├── CONTRACT.md
    ├── CODER_PACK.md
    ├── SKILL_REQUIREMENTS.md
    ├── WORKSPACE_CONVENTIONS.md
    ├── PROGRESS.md
    ├── FINAL_REPORT.md
    ├── LESSONS.md
    └── tasks/
        ├── TASK_001.md
        ├── TASK_001_REPORT.md
        ├── TASK_001_REVIEW.md
        └── ...
```

Khuyến nghị theo loại dự án (Brain chọn và ghi rõ “đã dùng”):

**Software/Web:**
```
docs/
scripts/
data/
assets/
```

**Research/Paper:**
```
draft/
notes/
references/
figures/
data/
outputs/
```

Quy tắc:
- Nếu dự án không dùng một thư mục khuyến nghị → không tạo cho đủ “đẹp”.
- Không đổi cấu trúc thư mục sau khi Blueprint đã APPROVED, trừ khi có task yêu cầu.

---

## 3) Quy Ước Naming (Bắt Buộc)

### 3.1 Tasks (Vibecode)
- Task file: `.vibecode/tasks/TASK_001.md` (3 chữ số, zero-pad).
- Report: `.vibecode/tasks/TASK_001_REPORT.md`
- Review: `.vibecode/tasks/TASK_001_REVIEW.md`
- Fix iteration:
  - Nếu cần file riêng: `.vibecode/tasks/TASK_001_FIX.md`, `.vibecode/tasks/TASK_001_FIX_2.md`
  - Hoặc dùng cùng TASK_001.md và tăng `Iterations` trong `PROGRESS.md` (Brain quyết định 1 cách và giữ nhất quán)

### 3.2 Docs/Notes (Research-friendly)
- Draft: `draft/Paper_v1.md`, `draft/Paper_v2.md`
- Notes: `notes/Source_Summary.md`, `notes/Data_Verification.md`
- Inventory: `notes/Figure_Table_Inventory.md`

### 3.3 Figures/Tables/Assets
- Hình: `figures/Fig_3_1_...png` (dùng `_` thay vì khoảng trắng; không dấu; ASCII nếu có thể)
- Bảng: `tables/Table_4_2_...csv` hoặc embed trong `notes/`

---

## 4) Quy Ước Đường Dẫn & Tham Chiếu

Trong mọi TASK/REPORT/REVIEW:
- Luôn tham chiếu file bằng **workspace-relative path** (ví dụ `draft/Paper_v1.md`).
- Nếu review lỗi cụ thể, ghi thêm vị trí: `path/to/file.md#L120` (nếu hệ thống hỗ trợ line) hoặc “Section: 3.2”.
- Khi yêu cầu Coder sửa, phải chỉ rõ “Where” (file + section) để tránh đoán.

---

## 5) Format Báo Cáo (Bắt Buộc)

Coder/Executer phải trả `RESULT REPORT` tối thiểu:
- Objective met: yes/no + lý do ngắn
- Files changed/created: danh sách path
- Commands/tests run: lệnh + kết quả (hoặc lý do không chạy)
- Notes/assumptions: nếu có
- Risks/known gaps: nếu có

Reviewer phải trả:
- Bảng DoD verdict (PASS/FAIL từng mục)
- Verdict cuối: PASS / FIX REQUIRED / BLOCKED (NEED INFO)
- Issues có “Where / Why / How to fix”

---

## 6) Chuẩn Hóa Nội Dung (Dùng Cho Research/Paper)

Nếu dự án là paper/research:
- Không tự tạo số liệu, kết quả, hoặc claim không có nguồn.
- Số liệu phải có trace:
  - `notes/Data_Verification.md` (trích dẫn từ thesis/dataset/appendix)
  - Hoặc “Source: DOI/URL + trang/bảng”
- Tất cả TODO phải có owner:
  - `TODO (Brain): ...`
  - `TODO (Coder): ...`

---

## 7) Encoding & An Toàn Văn Bản

- Markdown: dùng **UTF-8 with BOM** để tránh lỗi tiếng Việt/ký tự đặc biệt trên Windows/PowerShell.
- Không copy/paste làm “mojibake”. Nếu phát hiện lỗi encoding → fix ngay trước khi tiếp tục.

---

## 8) Những Thứ Cần Xin Phê Duyệt Trước Khi Làm

Coder phải dừng và xin Brain/Human nếu:
- Thêm dependency mới
- Đổi public API/behavior
- Đổi cấu trúc thư mục/chuyển file hàng loạt
- Thay đổi vượt scope task/DoD

