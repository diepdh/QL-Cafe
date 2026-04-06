# 📦 CODER PACK: [Tên dự án]
## Vibecode v5.0 — Tài liệu kỹ thuật cho Coder
**Tạo bởi:** Brain
**Ngày:** [YYYY-MM-DD]

---

> ⚠️ TÀI LIỆU NÀY LÀ NGUỒN THAM CHIẾU KỸ THUẬT DUY NHẤT.
> Mọi quyết định kỹ thuật không có trong đây → HỎI BRAIN.

---

## 🚀 SETUP & KHỞI ĐỘNG

### Tạo project mới

```bash
npx create-next-app@latest [project-name] \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd [project-name]
```

### Cài dependencies bắt buộc

```bash
# UI & Styling
npm install [package1] [package2]

# Animation (nếu dùng Framer Motion)
npm install framer-motion

# Icons
npm install lucide-react

# [Thêm theo tech stack của project]
```

### Khởi động development

```bash
npm run dev
# → http://localhost:3000
```

---

## ⚙️ CONFIGURATION FILES

### tailwind.config.js

```javascript
// Paste config đầy đủ tại đây
// Bao gồm: colors, fonts, custom values từ Design System trong Blueprint
const { fontFamily } = require("tailwindcss/fonts")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "[PRIMARY_HEX]",
          // ...
        },
        // ... từ Design System
      },
      fontFamily: {
        heading: ["[Heading Font]", ...fontFamily.sans],
        body: ["[Body Font]", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
```

### globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  :root {
    --background: [hex];
    --foreground: [hex];
    /* ... */
  }

  body {
    @apply bg-background text-foreground font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
}

/* Custom component classes */
@layer components {
  .btn-primary {
    @apply [classes];
  }
  /* ... */
}
```

### .env.local.example

```env
# Copy file này thành .env.local và điền giá trị thực
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# [Thêm env vars theo tech stack]
```

---

## 🧩 CONVENTIONS & PATTERNS

### Component Pattern (bắt buộc dùng)

```tsx
// Template cho mọi component
"use client" // Chỉ thêm nếu cần client-side hooks

import { type FC } from "react"

// ─── Types ──────────────────────────────────────────────
interface [ComponentName]Props {
  // Props ở đây
}

// ─── Constants ──────────────────────────────────────────
// (Chỉ nếu có)

// ─── Component ──────────────────────────────────────────
const [ComponentName]: FC<[ComponentName]Props> = ({ /* props */ }) => {
  return (
    <div>
      {/* ... */}
    </div>
  )
}

export default [ComponentName]
```

### Page Pattern (Next.js App Router)

```tsx
// src/app/[route]/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "[Page Title] | [Site Name]",
  description: "[Description]",
}

export default function [PageName]Page() {
  return (
    <main>
      {/* Sections */}
    </main>
  )
}
```

### Data Fetching Pattern

```tsx
// Server Component (default trong App Router)
async function getData() {
  // fetch, no useEffect needed
}

// Client Component (khi cần interactivity)
"use client"
import { useState, useEffect } from "react"
```

### Animation Pattern (Framer Motion — nếu dùng)

```tsx
import { motion } from "framer-motion"

// Fade in từ dưới lên — dùng cho sections
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// Stagger children — dùng cho lists/grids
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}
```

---

## 📦 SHARED COMPONENTS (Cần tạo sớm)

Các components này cần có từ Task đầu tiên vì được dùng ở nhiều nơi:

### Button Component

```
Location: src/components/ui/Button.tsx
Variants: primary | secondary | outline | ghost
Sizes: sm | md | lg
Props: variant, size, disabled, loading, onClick, children, className
```

### [Component khác theo project]

```
Location: [path]
Variants: [...]
Props: [...]
```

---

## 🎨 DESIGN TOKENS (Shorthand cho Coder)

```
Colors (Tailwind classes):
  primary:    bg-primary / text-primary / border-primary
  secondary:  bg-secondary / text-secondary
  accent:     bg-accent / text-accent
  muted:      text-muted-foreground / bg-muted

Typography:
  heading:    font-heading
  body:       font-body (default)

Spacing (dùng nhất quán):
  section padding:  py-16 md:py-24
  container:        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  card padding:     p-6
  gap between items: gap-4 (sm) / gap-6 (md) / gap-8 (lg)
```

---

## 📋 TASK EXECUTION CHECKLIST

Trước khi bắt đầu mỗi task, xác nhận:

```
□ Đã đọc BLUEPRINT.md phần liên quan
□ Đã đọc TASK file đầy đủ
□ Đã kiểm tra PROGRESS.md — biết context từ task trước
□ Hiểu rõ Definition of Done
□ Không có blocker trước khi bắt đầu
```

Sau khi hoàn thành mỗi task:

```
□ npm run build → không có lỗi
□ npm run dev → chạy được
□ Kiểm tra responsive nếu là UI task
□ Viết TASK_REPORT.md đầy đủ
```

---

## ⚠️ NHỮNG LỖI THƯỜNG GẶP & CÁCH TRÁNH

```
1. "use client" không cần thiết
   → Chỉ thêm khi dùng hooks hoặc event handlers
   → Server components nhanh hơn và SEO tốt hơn

2. Import không đúng path
   → Dùng @/* alias: import { Button } from "@/components/ui/Button"
   → Không dùng relative paths dài: ../../../../components

3. Tailwind classes không hoạt động
   → Kiểm tra tailwind.config.js content paths
   → Không dùng dynamic class strings: className={`bg-${color}`}
   → Dùng: cn() utility hoặc explicit classes

4. Hydration mismatch
   → Không dùng Date() trực tiếp trong JSX
   → Không render random values trong server component

5. Image không hiển thị
   → Dùng next/image, không dùng <img> thuần
   → Thêm domain vào next.config.js nếu từ external URL
```

---

*Tài liệu này được tạo bởi Brain dựa trên Blueprint đã duyệt.*
*Coder không tự sửa file này. Phát hiện sai sót → báo cáo trong TASK_REPORT.*
