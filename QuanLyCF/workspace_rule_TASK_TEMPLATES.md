# ─────────────────────────────────────────────────────────────
#   TEMPLATE: TASK_[NNN].md
#   Người tạo: Brain | Người thực hiện: Coder
# ─────────────────────────────────────────────────────────────

# TASK #[NNN]: [Tên Task Ngắn Gọn]
**Tạo bởi:** Brain
**Ngày tạo:** [YYYY-MM-DD]
**Ưu tiên:** P0 / P1 / P2
**Ước tính:** [X phút]
**Phụ thuộc:** TASK_[NNN-1] / Không có

---

## 🎯 MỤC TIÊU

[1-2 câu mô tả rõ ràng task này làm gì và tại sao nó quan trọng tại thời điểm này trong quy trình.]

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] [Yêu cầu 1 — cụ thể, đo được]
- [ ] [Yêu cầu 2 — cụ thể, đo được]
- [ ] [Yêu cầu 3 — cụ thể, đo được]

### Không làm (DO NOT):
- ❌ [Điều không được làm 1 — e.g. không thêm animation chưa có trong Blueprint]
- ❌ [Điều không được làm 2]

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/components/[ComponentName].tsx    ← [Mô tả ngắn]
src/app/[route]/page.tsx              ← [Mô tả ngắn]
```

### Sửa đổi:
```
src/app/layout.tsx                    ← [Thay đổi gì]
```

### Không được đụng vào:
```
[File không được sửa]                 ← [Lý do]
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

[Cung cấp đủ context để Coder không cần đoán:]

### Component cần tạo: [ComponentName]

**Props:**
```typescript
interface [ComponentName]Props {
  [prop]: [type]   // [mô tả]
}
```

**Behavior:**
- [Behavior 1]
- [Behavior 2]

**Tham khảo trong CODER_PACK:** [Section name]

### Data / Content mẫu:

```typescript
// Dùng data này khi build UI
const [dataName] = [
  {
    id: 1,
    [field]: "[value]",
    // ...
  },
  // ...
]
```

---

## 🏁 DEFINITION OF DONE

Task được coi là HOÀN THÀNH khi:

- [ ] [DoD 1 — cụ thể, kiểm tra được]
- [ ] [DoD 2 — cụ thể, kiểm tra được]
- [ ] [DoD 3 — cụ thể, kiểm tra được]
- [ ] `npm run build` không có lỗi
- [ ] Component render đúng ở 375px, 768px, 1440px (nếu là UI task)

---

## 📌 GHI CHÚ CHO CODER

> [Thông tin thêm Brain muốn Coder biết: context đặc biệt, potential gotchas, tham khảo cụ thể trong Blueprint...]

---
---
---

# ─────────────────────────────────────────────────────────────
#   TEMPLATE: TASK_[NNN]_REPORT.md
#   Người tạo: Coder | Người đọc: Brain
# ─────────────────────────────────────────────────────────────

# TASK REPORT: TASK_[NNN]
## [Tên task — copy từ TASK file]
**Thực hiện bởi:** [Tên AI model/tool]
**Bắt đầu:** [HH:MM]
**Kết thúc:** [HH:MM]
**Tổng thời gian:** [X phút]
**Status:** ✅ COMPLETED / ⚠️ COMPLETED_WITH_NOTES / 🚧 BLOCKER

---

## ✅ ĐÃ THỰC HIỆN

| # | Hành động | File | Kết quả |
|---|-----------|------|---------|
| 1 | Created | `src/components/X.tsx` | ✅ |
| 2 | Modified | `src/app/page.tsx` | ✅ |
| 3 | Installed | `package-name` | ✅ |

---

## 📁 FILES THAY ĐỔI

**Tạo mới:**
- `path/to/file1.tsx` — [mô tả ngắn gọn]
- `path/to/file2.ts` — [mô tả ngắn gọn]

**Sửa đổi:**
- `path/to/file3.tsx` — [mô tả thay đổi]

**Xóa:**
- (không có) / [file đã xóa và lý do]

**Package mới (nếu có):**
- `package-name@version` — [lý do cần]

---

## ✅ DEFINITION OF DONE CHECKLIST

| DoD | Status | Ghi chú |
|-----|--------|---------|
| [DoD 1 từ TASK] | ✅ / ❌ | [lý do nếu không đạt] |
| [DoD 2 từ TASK] | ✅ / ❌ | [lý do nếu không đạt] |
| npm run build | ✅ / ❌ | [lỗi nếu có] |
| Responsive check | ✅ / ❌ | [breakpoint nào lỗi nếu có] |

---

## ⚠️ VẤN ĐỀ GẶP PHẢI

*[Nếu không có vấn đề: "Không có vấn đề đáng chú ý trong task này."]*

### Vấn đề 1: [Tên ngắn gọn]
- **Gặp phải:** [mô tả cụ thể]
- **Đã giải quyết bằng:** [cách giải quyết]

### Vấn đề 2: [Tên ngắn gọn]
- **Gặp phải:** [mô tả]
- **Chưa giải quyết được:** [lý do — nếu là blocker, xem phần BLOCKER]

---

## 💭 GIẢ ĐỊNH ĐÃ ĐƯA RA

*[Những quyết định tôi tự đưa ra vì TASK không chỉ định rõ:]*

- **[Assumption 1]:** [Tôi làm X vì Y. Nếu sai, cần điều chỉnh Z.]
- *[Hoặc: "Không có assumption đặc biệt — làm theo đúng TASK."]*

---

## 🧠 GHI CHÚ CHO BRAIN

*[Thông tin quan trọng Brain cần biết để lên kế hoạch task tiếp theo:]*

- [Ghi chú 1]
- [Ghi chú 2]
- *[Hoặc: "Không có ghi chú đặc biệt."]*

---

## 🚧 BLOCKER

**Status:** 🚧 CÓ BLOCKER / ✅ KHÔNG CÓ BLOCKER

*[Nếu không có blocker: Bỏ qua phần này.]*

**Vấn đề:** [Mô tả blocker rõ ràng]
**Nguyên nhân:** [Phân tích tại sao bị block]
**Cần từ Brain/Human:** [Thông tin hoặc quyết định cụ thể cần để tiếp tục]
**Files bị ảnh hưởng:** [Liệt kê files chưa hoàn thành]
**Có thể tiếp tục task khác không?** [Có / Không — và task nào]

---
---
---

# ─────────────────────────────────────────────────────────────
#   TEMPLATE: TASK_[NNN]_REVIEW.md
#   Người tạo: Reviewer | Người đọc: Brain
# ─────────────────────────────────────────────────────────────

# TASK REVIEW: TASK_[NNN]
## [Tên task]
**Reviewer:** [AI Model name]
**Ngày review:** [YYYY-MM-DD HH:MM]
**Verdict:** ✅ PASS / ❌ FIX REQUIRED

---

## 📊 DEFINITION OF DONE — VERDICT

| # | Definition of Done | Status | Ghi chú |
|---|-------------------|--------|---------|
| 1 | [DoD 1] | ✅ PASS / ❌ FAIL | [lý do nếu FAIL] |
| 2 | [DoD 2] | ✅ PASS / ❌ FAIL | [lý do nếu FAIL] |
| 3 | [DoD 3] | ✅ PASS / ❌ FAIL | [lý do nếu FAIL] |

**DoD Score:** [X/Y passed]

---

## ✅ NHỮNG GÌ CODER LÀM TỐT

*[Luôn có section này — cụ thể và chân thực, không phải lời khen chung chung]*

- [Điều tốt cụ thể 1]
- [Điều tốt cụ thể 2]

---

## ❌ VẤN ĐỀ CẦN XỬ LÝ

*[Nếu PASS: "Không có vấn đề nghiêm trọng cần sửa."]*

### 🔴 CRITICAL (bắt buộc FIX)

#### Issue C1: [Tên ngắn gọn]
- **File:** `path/to/file.tsx` *(line X nếu biết)*
- **Vấn đề:** [Mô tả rõ ràng vấn đề là gì]
- **Tại sao critical:** [Giải thích impact]
- **Hướng sửa:** [Approach đề xuất — không phải code cụ thể]

### 🟡 MAJOR (nên FIX)

#### Issue M1: [Tên ngắn gọn]
- **File:** `path/to/file.tsx`
- **Vấn đề:** [Mô tả]
- **Hướng sửa:** [Đề xuất]

### 🟢 MINOR (ghi chú, không yêu cầu sửa ngay)

- **[Minor 1]:** [mô tả ngắn — e.g. có thể extract thành custom hook]
- **[Minor 2]:** [mô tả ngắn]

---

## 🏁 VERDICT FINAL

**Verdict:** ✅ PASS / ❌ FIX REQUIRED

**Lý do:**
[1-3 câu giải thích verdict một cách rõ ràng]

**Nếu FIX — ưu tiên sửa theo thứ tự:**
1. [Vấn đề nghiêm trọng nhất]
2. [Vấn đề thứ hai]

---

## 💡 GỢI Ý CHO LESSONS.md

*[Patterns hoặc bài học nên được ghi lại để cải thiện các lần sau:]*

- [Gợi ý 1: e.g. "Cần specify responsive behavior rõ hơn trong TASK file"]
- [Gợi ý 2]
- *[Hoặc: "Không có gợi ý đặc biệt lần này."]*
