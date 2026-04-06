# 📘 BLUEPRINT: [Tên dự án]
## [Loại Project] — Vibecode v5.0
**Ngày tạo:** [YYYY-MM-DD]
**Status:** DRAFT / APPROVED
**Approved by:** Human — [ngày]

---

## 📋 PROJECT INFO

| Field | Value |
|-------|-------|
| Tên dự án | [Tên] |
| Loại | [Landing Page / SaaS App / Dashboard / Blog / Portfolio / E-commerce] |
| Mô tả ngắn | [1-2 câu] |
| Target audience | [Mô tả] |
| Primary goal | [Mục tiêu chính: thu leads / bán hàng / SaaS users / v.v.] |

---

## 🎯 MỤC TIÊU & THÀNH CÔNG

**Primary Goal:** [Goal cụ thể]
**Key Message:** [Thông điệp chính muốn truyền đạt]
**Success Metrics:** [Cách đo lường thành công — e.g. conversion rate, user signups]

---

## 📐 STRUCTURE & PAGES

### Sitemap

```
[PROJECT_NAME]/
├── / (Homepage / Landing)
│   └── [Sections liệt kê theo thứ tự]
├── /about (nếu có)
├── /[feature] (nếu có)
└── ...
```

### Chi tiết từng Page/Section

#### Page: [Tên page]
**Route:** `/[route]`
**Mục đích:** [Mục đích của page]

| Section | Nội dung | Component name |
|---------|----------|----------------|
| [Section 1] | [Mô tả] | `[ComponentName]` |
| [Section 2] | [Mô tả] | `[ComponentName]` |

**Behavior đặc biệt:**
- [Behavior 1 nếu có]
- [Hoặc: Không có behavior đặc biệt]

---

## 🎨 DESIGN SYSTEM

### Colors

```
Primary:     #[XXXXXX] — [Tên màu / Mục đích]
Secondary:   #[XXXXXX] — [Tên màu / Mục đích]
Accent:      #[XXXXXX] — [Tên màu / Mục đích]
Background:  #[XXXXXX] — [Light/Dark]
Text:        #[XXXXXX] — Primary text
Text Muted:  #[XXXXXX] — Secondary text
Border:      #[XXXXXX] — Borders/dividers
Error:       #EF4444   — Error states
Success:     #22C55E   — Success states
```

### Typography

```
Heading font:  [Font name] — Source: Google Fonts
Body font:     [Font name] — Source: Google Fonts

H1: [size]px / [weight] / [line-height]
H2: [size]px / [weight] / [line-height]
H3: [size]px / [weight] / [line-height]
Body: [size]px / [weight] / [line-height]
Small: [size]px / [weight] / [line-height]
```

### Spacing Scale (Tailwind)

```
xs:  4px  (p-1)
sm:  8px  (p-2)
md:  16px (p-4)
lg:  24px (p-6)
xl:  32px (p-8)
2xl: 48px (p-12)
3xl: 64px (p-16)
```

### Borders & Radius

```
Border radius: [e.g. rounded-lg (8px) for cards, rounded-full for buttons]
Border color: [color token]
Border width: [e.g. 1px default, 2px for focus states]
```

### Shadows

```
Card: [e.g. shadow-md]
Dropdown: [e.g. shadow-lg]
Modal: [e.g. shadow-2xl]
```

---

## 💻 TECH STACK (ĐÃ CHỐT)

```
Framework:      [e.g. Next.js 14 (App Router)]
Styling:        [e.g. Tailwind CSS v3]
UI Components:  [e.g. Shadcn/UI / Radix / tự viết]
Animation:      [e.g. Framer Motion / CSS / không có]
State:          [e.g. Zustand / Context API / React Query]
Backend/API:    [e.g. Supabase / Prisma + PostgreSQL / không có]
Auth:           [e.g. NextAuth.js / Clerk / không có]
Payment:        [e.g. Stripe / không có]
Deployment:     [e.g. Vercel / không xác định]
Node version:   [e.g. 18+]
Package manager:[e.g. npm / pnpm]
```

**QUAN TRỌNG:** Tech stack này ĐÃ ĐƯỢC CHỐT. Không thay đổi mà không có sự đồng ý của Human và Brain.

---

## 📁 FILE STRUCTURE

```
[project-root]/
├── .vibecode/                    ← Vibecode system files (không deploy)
│   ├── BLUEPRINT.md
│   ├── CODER_PACK.md
│   ├── SKILL_REQUIREMENTS.md
│   ├── PROGRESS.md
│   └── tasks/
├── src/
│   ├── app/                      ← Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [route]/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                   ← Base UI components (Shadcn)
│   │   ├── layout/               ← Header, Footer, Sidebar
│   │   └── [feature]/            ← Feature-specific components
│   ├── lib/
│   │   ├── utils.ts
│   │   └── [feature].ts
│   ├── hooks/                    ← Custom React hooks
│   ├── types/                    ← TypeScript types
│   ├── styles/
│   │   └── globals.css
│   └── constants/
│       └── index.ts
├── public/
│   ├── images/
│   └── fonts/ (nếu self-hosted)
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🔧 FEATURES & BEHAVIOR

### Feature: [Tên feature]
**Mô tả:** [Mô tả chi tiết]
**User flow:**
1. User làm [A]
2. System phản hồi [B]
3. User thấy [C]

**Edge cases:**
- [Edge case 1 và cách handle]
- [Edge case 2 và cách handle]

**Data model (nếu có):**
```typescript
type [Name] = {
  id: string
  [field]: [type]
}
```

---

## 🌐 RESPONSIVE BEHAVIOR

```
Mobile (< 640px):   [Mô tả layout]
Tablet (640-1024px): [Mô tả layout]
Desktop (> 1024px): [Mô tả layout]
```

**Breakpoint-specific behaviors:**
- Navigation: [e.g. Hamburger menu on mobile, full nav on desktop]
- Grid: [e.g. 1 col mobile, 2 col tablet, 3 col desktop]
- Typography scale: [e.g. H1 2xl mobile → 4xl desktop]

---

## 🔐 ENVIRONMENT VARIABLES

```env
# Bắt buộc
NEXT_PUBLIC_SITE_URL=

# Optional (tùy tech stack)
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## ✅ DEFINITION OF DONE (Toàn dự án)

```
□ Tất cả pages render không có lỗi console
□ Responsive trên 375px / 768px / 1440px
□ Không có TypeScript errors (nếu dùng TS)
□ npm run build hoàn thành không lỗi
□ npm run dev chạy được tại http://localhost:3000
□ [Tiêu chí specific theo project type]
□ [Tiêu chí specific theo project type]
```

---

## ⚠️ KHÔNG BAO GỒM (Explicitly Excluded)

```
• [Feature không làm trong scope này]
• [Tính năng để phiên bản sau]
• [Third-party integration không làm]
```

---

## 📝 NOTES & DECISIONS

[Ghi lại các quyết định quan trọng trong quá trình planning:]

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| [date] | [Quyết định] | [Lý do] |

---

*Blueprint này là KHẾ ƯỚC giữa Brain, Coder và Human.*
*Thay đổi cấu trúc sau khi APPROVED cần Brain và Human đồng ý.*
