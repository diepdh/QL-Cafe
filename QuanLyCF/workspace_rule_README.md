# ═══════════════════════════════════════════════════════════════════════════════
#                         VIBECODE KIT v5.0
#                      📖 README — HƯỚNG DẪN SỬ DỤNG
#                      "The Orchestrator Edition"
# ═══════════════════════════════════════════════════════════════════════════════

## 🗂️ CẤU TRÚC BỘ FILE

```
vibecode-v5/
│
├── 📖 README.md                          ← File này — đọc đầu tiên
│
├── 🧠 VIBECODE-v5-BRAIN-PROMPT.md        ← Paste vào ChatGPT/Claude làm Brain
├── 🔨 VIBECODE-v5-CODER-PROMPT.md        ← Paste vào Gemini CLI/OpenCode làm Coder
├── 🔍 VIBECODE-v5-REVIEWER-PROMPT.md     ← Paste vào AI làm Reviewer
│
└── templates/                            ← Templates tạo trong .vibecode/ folder
    ├── BLUEPRINT.md                      ← Bản vẽ kiến trúc dự án
    ├── CODER_PACK.md                     ← Hướng dẫn kỹ thuật cho Coder
    ├── SKILL_REQUIREMENTS.md             ← Skills/tools Coder cần
    ├── WORKSPACE_CONVENTIONS.md          ← Cấu trúc thư mục, naming, format báo cáo (workspace rule)
    ├── TASK_TEMPLATES.md                 ← TASK + TASK_REPORT + TASK_REVIEW
    └── PROGRESS_REPORT_LESSONS.md        ← PROGRESS + FINAL_REPORT + LESSONS
```

---

## 👥 BA VAI TRÒ

| Role | Tool gợi ý | Nhiệm vụ |
|------|-----------|----------|
| 🧠 **Brain** | ChatGPT / Claude | Lên kế hoạch, điều phối, ra quyết định |
| 🔨 **Coder** | Gemini CLI / OpenCode / Claude Code | Thực thi code theo task |
| 🔍 **Reviewer** | ChatGPT / Claude | Kiểm tra chất lượng output |

---

## 🔄 QUY TRÌNH TỔNG QUAN

```
PHASE 1 — PLANNING (Anh + Brain)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Mô tả ý tưởng → Brain detect & đề xuất VISION
Step 2: Anh cung cấp CONTEXT → Brain điều chỉnh Vision
Step 3: Brain tạo BLUEPRINT → Anh review và APPROVED
Step 4: Brain tạo CONTRACT → Anh CONFIRM

     ↓ Anh CONFIRM → Phase 2 bắt đầu ↓

PHASE 2 — ORCHESTRATION (Semi-auto, anh approve từng step)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────┐
  │                                             │
  │  Brain viết TASK → Anh "RUN" → Coder làm  │
  │       ↓                                     │
  │  Coder viết REPORT → Brain đọc             │
  │       ↓                                     │
  │  Anh "REVIEW" → Reviewer kiểm tra          │
  │       ↓                                     │
  │  ✅ PASS → Task tiếp theo                   │
  │  ❌ FIX  → Brain viết fix → Coder sửa      │
  │                                             │
  └──────────── Lặp cho đến DONE ──────────────┘

  → Hoàn thành: Brain tạo FINAL_REPORT + LESSONS
```

---

## 🚀 CÁCH BẮT ĐẦU

### Bước 1: Setup Brain

```
1. Mở ChatGPT (hoặc AI bạn chọn)
2. Copy toàn bộ nội dung VIBECODE-v5-BRAIN-PROMPT.md
3. Paste vào chat mới
4. Mô tả ý tưởng dự án của bạn
   Ví dụ: "Tôi cần landing page bán khóa học Excel cho dân văn phòng"
```

### Bước 2: Setup Coder (khi Brain giao task đầu tiên)

```
1. Mở Gemini CLI hoặc OpenCode trong terminal
2. Copy toàn bộ VIBECODE-v5-CODER-PROMPT.md
3. Paste vào đầu conversation mới
4. Thêm: "Bây giờ hãy đọc file task tại: .vibecode/tasks/TASK_001.md"
```

### Bước 3: Setup Reviewer (khi cần review)

```
1. Mở AI reviewer (ChatGPT hoặc Claude)
2. Copy toàn bộ VIBECODE-v5-REVIEWER-PROMPT.md
3. Paste vào conversation mới
4. Thêm: "Hãy review TASK_001. Files context:
   - .vibecode/BLUEPRINT.md
   - .vibecode/tasks/TASK_001.md
   - .vibecode/tasks/TASK_001_REPORT.md"
```

---

## 📁 FILE STRUCTURE TRONG DỰ ÁN

Khi Brain bắt đầu Phase 2, tạo folder này trong project:

```
[your-project]/
└── .vibecode/
    ├── BLUEPRINT.md           ← Brain tạo sau bước 3
    ├── CODER_PACK.md          ← Brain tạo sau Contract confirmed
    ├── SKILL_REQUIREMENTS.md  ← Brain tạo sau Contract confirmed
    ├── WORKSPACE_CONVENTIONS.md ← Brain tạo sớm để chuẩn hóa folder/naming/report
    ├── PROGRESS.md            ← Brain cập nhật sau mỗi task
    ├── CONTRACT.md            ← Brain tạo bước 4
    ├── FINAL_REPORT.md        ← Brain tạo khi hoàn thành
    ├── LESSONS.md             ← Brain + Coder điền sau dự án
    └── tasks/
        ├── TASK_001.md
        ├── TASK_001_REPORT.md
        ├── TASK_001_REVIEW.md
        ├── TASK_002.md
        └── ...
```

---

## ⌨️ COMMANDS QUAN TRỌNG (Nói với Brain)

```
"RUN"      → Approve task, bắt đầu giao cho Coder
"REVIEW"   → Giao cho Reviewer sau khi Coder báo xong
"FIX"      → Brain viết fix task sau khi Reviewer yêu cầu
"NEXT"     → Sau khi task PASS, tiếp tục task kế tiếp
"SKIP"     → Bỏ qua task hiện tại
"DISCUSS"  → Thảo luận trước khi quyết định
"STATUS"   → Brain báo cáo progress hiện tại
"WRAP UP"  → Brain tạo FINAL_REPORT + LESSONS
```

---

## 🆚 SO SÁNH V4 vs V5

| | v4.0 | v5.0 |
|-|------|------|
| Coder pack | 1 prompt lớn | Nhiều TASK nhỏ, tuần tự |
| Review | Không có | Brain → Reviewer loop |
| Memory | Không có | LESSONS.md tích lũy |
| Handoff | Copy/paste thủ công | File-based .vibecode/ |
| Progress | Không track | PROGRESS.md realtime |
| Fix loop | Không có | Có, với iteration tracking |

---

## 💡 TIPS

1. **LESSONS.md là tài sản quan trọng nhất** — Đọc nó ở đầu mỗi dự án mới
2. **Chia task nhỏ hơn bạn nghĩ** — Task 15-30 phút tốt hơn task 2 giờ
3. **Brain nên đọc LESSONS.md** của dự án trước trước khi lên Blueprint
4. **Reviewer khác Brain** — Nếu có thể, dùng AI khác làm Reviewer để khách quan hơn
5. **Đừng skip FINAL_REPORT** — Nó giúp onboard người mới và resume dự án sau này

---

*Vibecode v5.0 — "The Orchestrator Edition"*
*Xây dựng để AI làm việc với AI, Human chỉ approve.*
