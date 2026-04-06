# ─────────────────────────────────────────────────────────────
#   TEMPLATE: PROGRESS.md
#   Cập nhật bởi: Brain | Sau mỗi task PASS
# ─────────────────────────────────────────────────────────────

# 📊 PROGRESS: [Tên dự án]
**Cập nhật lần cuối:** [YYYY-MM-DD HH:MM]
**Brain:** [AI model]
**Coder:** [Tool name]

---

## 📈 TỔNG QUAN

```
Tổng tasks:     [X]
Hoàn thành:     [X] ████████░░ [X]%
Đang làm:       [X]
Chờ:            [X]
Blocker:        [X]
```

---

## 📋 TASK STATUS

| Task | Tên | Status | Iterations | Thời gian TT | Ghi chú |
|------|-----|--------|------------|--------------|---------|
| 001 | Project Setup | ✅ DONE | 1 | 20 phút | |
| 002 | Layout Shell | ✅ DONE | 2 | 45 phút | Fix responsive lần 2 |
| 003 | Hero Section | 🔄 IN PROGRESS | - | - | |
| 004 | Features Section | ⏳ PENDING | - | - | |
| 005 | [Task name] | ⏳ PENDING | - | - | |

**Legend:** ✅ DONE | 🔄 IN PROGRESS | ⏳ PENDING | 🚧 BLOCKER | ⏭️ SKIPPED

---

## 🔄 ACTIVE TASK

**Current:** TASK_003 — [Tên task]
**Assigned to:** Coder
**Started:** [HH:MM]
**Expected:** [HH:MM]

---

## 🚧 BLOCKERS HIỆN TẠI

*[Nếu không có: "Không có blocker."]*

| Task | Blocker | Cần từ | Status |
|------|---------|--------|--------|
| [NNN] | [Mô tả] | Human/Brain | 🔴 Chưa giải quyết |

---

## 📝 DECISION LOG

| Ngày | Task | Quyết định | Người quyết |
|------|------|-----------|------------|
| [date] | [NNN] | [Quyết định] | Brain/Human |

---
---
---

# ─────────────────────────────────────────────────────────────
#   TEMPLATE: FINAL_REPORT.md
#   Tạo bởi: Brain | Khi tất cả tasks PASS
# ─────────────────────────────────────────────────────────────

# 📄 FINAL REPORT: [Tên dự án]
## Vibecode v5.0
**Hoàn thành:** [YYYY-MM-DD]
**Tạo bởi:** Brain

---

## 🎉 TÓM TẮT THỰC HIỆN

| Metric | Giá trị |
|--------|---------|
| Tổng tasks | [X] |
| Tasks hoàn thành | [X/X] |
| Tasks bị skip | [X] |
| Tổng lần iteration (fix) | [X] |
| Thời gian ước tính | [X giờ] |
| Thời gian thực tế | [X giờ] |

---

## ✅ ĐÃ HOÀN THÀNH

### Files đã tạo

```
[project-root]/
├── [Liệt kê đầy đủ file structure thực tế]
│   ├── file1.tsx
│   └── file2.tsx
```

**Tổng số files:** [X files]

### Features đã implement

| Feature | Status | Ghi chú |
|---------|--------|---------|
| [Feature 1] | ✅ Done | |
| [Feature 2] | ✅ Done | |
| [Feature 3] | ⚠️ Partial | [Lý do] |

---

## ❌ KHÔNG HOÀN THÀNH / THAY ĐỔI SO VỚI BLUEPRINT

*[Nếu không có: "Tất cả deliverables trong Contract đã hoàn thành đúng như cam kết."]*

| Item | Lý do không hoàn thành | Đề xuất |
|------|------------------------|---------|
| [Feature X] | [Lý do cụ thể] | [Làm trong sprint tiếp theo] |

---

## 🔄 ITERATION HISTORY

| Task | Số lần fix | Nguyên nhân |
|------|-----------|-------------|
| TASK_002 | 2 | Responsive issue trên tablet |
| TASK_005 | 1 | Missing error state |

**Pattern issues (lặp lại nhiều lần):**
- [Pattern 1: e.g. Responsive thường bị bỏ sót trong lần đầu]
- [Pattern 2: e.g. Error handling thiếu ở async operations]

---

## 🚧 BLOCKER ĐÃ XỬ LÝ

| Task | Blocker | Giải pháp |
|------|---------|-----------|
| [NNN] | [Mô tả] | [Cách giải quyết] |

---

## 🚀 HƯỚNG DẪN CHẠY PROJECT

```bash
# 1. Clone / mở project
cd [project-path]

# 2. Cài dependencies
npm install

# 3. Setup environment
cp .env.local.example .env.local
# → Điền các giá trị cần thiết vào .env.local

# 4. Chạy development
npm run dev
# → http://localhost:3000

# 5. Build production (optional)
npm run build
npm run start
```

---

## 🔧 TECH STACK THỰC TẾ DÙNG

```
[Liệt kê stack thực tế — có thể khác Blueprint nếu có thay đổi được approve]
```

**Dependencies chính:**
```json
{
  "dependencies": {
    "[package]": "[version]"
  },
  "devDependencies": {
    "[package]": "[version]"
  }
}
```

---

## 📌 KNOWN ISSUES / TODO

*[Những vấn đề biết mà chưa fix, hoặc improvements cho tương lai:]*

| Priority | Issue | Loại | Đề xuất |
|----------|-------|------|---------|
| P1 | [Issue] | Bug/Improvement | [Cách fix] |
| P2 | [Issue] | Enhancement | [Cách làm] |

---

## 💡 ĐỀ XUẤT CHO PHIÊN BẢN TIẾP THEO

- [Đề xuất 1: e.g. Thêm dark mode]
- [Đề xuất 2: e.g. i18n support]

---

*Xem LESSONS.md để biết những bài học rút ra từ dự án này.*

---
---
---

# ─────────────────────────────────────────────────────────────
#   TEMPLATE: LESSONS.md
#   Cập nhật bởi: Brain + Coder | Sau khi hoàn thành dự án
# ─────────────────────────────────────────────────────────────

# 🧠 LESSONS LEARNED: [Tên dự án]
## Vibecode v5.0
**Dự án:** [Tên]
**Loại:** [Type]
**Hoàn thành:** [YYYY-MM-DD]

> File này là TÀI SẢN QUAN TRỌNG của hệ thống Vibecode.
> Brain và Coder đọc file này ở đầu mỗi dự án mới để không lặp lại sai lầm cũ.

---

## 📚 LESSONS CHO BRAIN (Planning & Orchestration)

### Về Task Decomposition

**✅ Làm tốt:**
- [Điều gì trong việc chia task đã hiệu quả]

**❌ Cần cải thiện:**
- [Điều gì chưa tốt — e.g. "Task 003 quá lớn, nên chia 2 tasks nhỏ hơn"]
- [Pattern để tránh lần sau]

**💡 Rule mới đề xuất:**
- [e.g. "UI tasks nên luôn có ít nhất 1 tiêu chí DoD về responsive"]

### Về Blueprint & Context

**✅ Làm tốt:**
- [e.g. "Phần Design System đủ chi tiết để Coder không cần đoán"]

**❌ Cần cải thiện:**
- [e.g. "Phần error states chưa được specify rõ → Coder tự đoán nhiều"]

**💡 Thêm vào BLUEPRINT template:**
- [e.g. "Thêm section Error States cho mỗi feature"]

### Về Điều Phối Loop

**✅ Làm tốt:**
- [e.g. "Detect blocker sớm ở Task 002 giúp tiết kiệm 30 phút"]

**❌ Cần cải thiện:**
- [e.g. "Nên check CODER_PACK trước khi giao task liên quan đến auth"]

---

## 🔨 LESSONS CHO CODER (Execution)

### Về Setup & Configuration

**✅ Pattern hoạt động tốt:**
```
[Code snippet hoặc approach đã verify là works]
```

**❌ Cái bẫy cần tránh:**
- **[Tên bẫy]:** [Mô tả vấn đề] → [Cách tránh]
- [e.g. "next/image domain config thường bị quên khi dùng external images"]

### Về [Tech cụ thể trong project — e.g. Supabase]

**Cách làm đúng:**
```
[Snippet / pattern đã confirm works]
```

**Cách làm sai (và đã gặp):**
```
[Snippet sai + lý do tại sao sai]
```

### Về Common Patterns

**Pattern: [Tên pattern]**
- **Dùng khi:** [Context]
- **Implementation:** [Brief description]
- **Lần đầu dùng trong project:** TASK_[NNN]

---

## 🔍 LESSONS CHO REVIEWER

**Hay bỏ sót khi review:**
- [e.g. "Responsive trên 768px thường bị bỏ qua"]
- [e.g. "Loading states trong async components"]

**False positive (FIX khi không cần):**
- [e.g. "Đừng flag code style nếu không ảnh hưởng functionality"]

---

## 📊 METRICS DỰ ÁN NÀY

```
Loại project:        [Type]
Tasks tổng:          [X]
Iteration rate:      [X lần fix / task trung bình]
Most fixed task:     TASK_[NNN] ([X lần] — vì [lý do])
Blocker count:       [X]
Thời gian:           [X giờ thực tế]
```

---

## 🚀 CẢI TIẾN CHO VIBECODE v5.x

*[Đề xuất thay đổi cho framework Vibecode dựa trên trải nghiệm dự án này:]*

| Component | Đề xuất cải tiến | Độ ưu tiên |
|-----------|-----------------|-----------|
| BRAIN PROMPT | [Thêm/sửa gì] | P0/P1/P2 |
| CODER PROMPT | [Thêm/sửa gì] | P0/P1/P2 |
| REVIEWER PROMPT | [Thêm/sửa gì] | P0/P1/P2 |
| BLUEPRINT template | [Thêm/sửa gì] | P0/P1/P2 |
| TASK template | [Thêm/sửa gì] | P0/P1/P2 |

---

*"Mỗi dự án là một cơ hội để hệ thống thông minh hơn."*
*— Vibecode v5.0 Philosophy*
