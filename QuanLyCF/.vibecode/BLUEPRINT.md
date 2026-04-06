# 📘 BLUEPRINT: Quản Lý Quán Cafe
## SaaS App (Internal Tool) — Vibecode v5.0
**Ngày tạo:** 2026-03-26
**Status:** APPROVED
**Approved by:** Human — 2026-03-26

---

## 📋 PROJECT INFO

| Field | Value |
|-------|-------|
| Tên dự án | QuanLyCF — Phần Mềm Quản Lý Quán Cafe |
| Loại | SaaS App / Internal Management Tool |
| Mô tả ngắn | Ứng dụng web quản lý toàn diện cho quán cafe: order qua QR, kho NVL 3 lớp, công thức recipe, sơ chế, chấm công nhân viên, báo cáo doanh thu. |
| Target audience | Chủ quán cafe, quản lý, nhân viên thu ngân / pha chế |
| Primary goal | Tối ưu vận hành: khách tự order qua QR, tự động trừ kho, trực quan hóa kinh doanh |

---

## 🎯 MỤC TIÊU & THÀNH CÔNG

**Primary Goal:** Vận hành quán cafe hoàn toàn qua 1 app — từ order đến kho hàng, nhân viên, và báo cáo.

**Key Message:** Đơn giản, nhanh, không cần phần mềm phức tạp — chạy trên Google Sheets.

**Success Metrics:**
- Khách order qua QR thành công, đơn vào hệ thống không cần nhân viên nhập tay
- Tồn kho NVL tinh chế tự động cập nhật khi đơn hoàn tất
- Nhân viên chấm công bằng 1 nút bấm — manager xem bảng công cuối tháng

---

## 📐 STRUCTURE & PAGES

### Sitemap

```
QuanLyCF (Google Apps Script Web App)
├── /login                    ← Trang đăng nhập (tất cả user)
├── /app                      ← Shell chính (sau khi đăng nhập)
│   ├── /dashboard            ← Tổng quan kinh doanh
│   ├── /pos                  ← Tạo đơn hàng (POS)
│   ├── /orders               ← Danh sách đơn
│   ├── /products             ← Sản phẩm menu
│   ├── /raw-materials        ← NVL thô
│   ├── /refined-materials    ← NVL tinh chế
│   ├── /recipes              ← Công thức sản phẩm
│   ├── /procurement          ← Nhập hàng
│   ├── /processing           ← Sơ chế NVL
│   ├── /suppliers            ← Nhà cung cấp
│   ├── /staff                ← Hồ sơ nhân viên
│   ├── /attendance           ← Chấm công
│   ├── /cashflow             ← Thu chi
│   ├── /reports              ← Báo cáo doanh thu
│   └── /settings             ← Cài đặt, QR bàn, phân quyền
└── /menu?table=B01           ← Trang menu công khai (QR khách quét)
```

### Chi tiết Page/Section chính

#### Page: Dashboard (`/dashboard`)
**Mục đích:** Tổng quan kinh doanh thời gian thực

| Section | Nội dung | Component |
|---------|----------|-----------|
| KPI Cards | Doanh thu hôm nay, Lợi nhuận, Số đơn, NVL sắp hết | `KpiCard` |
| Biểu đồ | Doanh thu 7 ngày gần nhất (line chart) | `RevenueChart` |
| Stats Row | Tuần này, tháng này, công nợ, đơn tháng | `StatsBanner` |
| Đơn gần đây | Bảng 10 đơn mới nhất | `RecentOrdersTable` |

#### Page: QR Menu (`/menu?table=B01`) — PUBLIC
**Mục đích:** Khách quét QR → gọi món → tạo đơn tự động

| Section | Nội dung | Component |
|---------|----------|-----------|
| Header | Logo quán, tên bàn | `MenuHeader` |
| Filter | Lọc theo danh mục | `CategoryFilter` |
| Sản phẩm | Grid ảnh + tên + giá | `ProductGrid` |
| Giỏ hàng | Sản phẩm đã chọn + ghi chú | `CartPanel` |
| Ghi chú | Checkbox: ít đường / không đường / ít đá + textarea | `OrderNotes` |
| Đặt hàng | Nút xác nhận gửi đơn | `PlaceOrderButton` |

**Behavior đặc biệt:**
- Không cần đăng nhập
- Sau khi đặt hàng thành công → hiển thị màn hình xác nhận, reset giỏ
- Lấy table code từ query param `?table=B01`

#### Page: POS (`/pos`)
**Mục đích:** Nhân viên tạo đơn thủ công

| Section | Nội dung | Component |
|---------|----------|-----------|
| Tìm kiếm | Search sản phẩm theo tên / danh mục | `ProductSearch` |
| Danh sách đơn | Sản phẩm đã thêm, số lượng, ghi chú | `OrderBuilder` |
| Thanh toán | Giảm giá, phương thức, tổng tiền | `CheckoutPanel` |

#### Page: Chấm Công (`/attendance`)
**Mục đích:** Nhân viên chấm công, Manager xem bảng

| Section | Nội dung | Component |
|---------|----------|-----------|
| Trạng thái ca | Hiển thị đang trong ca / chưa vào ca | `ShiftStatus` |
| Nút bấm | 🟢 VÀO CA / 🔴 RA CA (to, nổi bật) | `ClockButton` |
| Bảng công tháng | Grid NV × ngày, tổng giờ, ước lương | `AttendanceTable` |

**Behavior đặc biệt:**
- Nhấn VÀO CA → server timestamp tự động ghi (không nhập tay)
- Nhấn RA CA → tính hours_worked = time_out − time_in
- Manager xem được toàn bộ; Nhân viên chỉ xem của mình

---

## 🎨 DESIGN SYSTEM

### Colors

```
Primary:     #7C3AED — Tím (Luxury/Premium — phù hợp cafe cao cấp)
Primary-Lt:  #A78BFA — Tím nhạt (hover states)
Secondary:   #10B981 — Xanh lá (success, tồn kho đủ)
Accent:      #F59E0B — Cam vàng (warning, cảnh báo NVL)
Background:  #F8FAFC — Xám nhạt (main bg)
Surface:     #FFFFFF — Trắng (card bg)
Sidebar:     #1E1B4B — Tím đậm (sidebar bg)
Text:        #1E293B — Đen xanh (primary text)
Text-Muted:  #64748B — Xám (secondary text)
Border:      #E2E8F0 — Xám nhạt (borders)
Error:       #EF4444 — Đỏ
Success:     #22C55E — Xanh
Warning:     #F59E0B — Vàng
```

### Typography

```
Heading font:  Be Vietnam Pro — Google Fonts (chữ Việt đẹp)
Body font:     Inter — Google Fonts

H1: 28px / 700 / 1.3
H2: 22px / 600 / 1.4
H3: 18px / 600 / 1.4
Body: 14px / 400 / 1.6
Small: 12px / 400 / 1.5
Button: 14px / 600
```

### Spacing Scale

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
```

### Borders & Radius

```
Border radius: 8px (cards), 6px (inputs), 24px (buttons pill), 50% (avatar)
Border color: #E2E8F0
Border width: 1px default, 2px focus
```

### Shadows

```
Card: 0 1px 3px rgba(0,0,0,0.08)
Dropdown: 0 4px 16px rgba(0,0,0,0.12)
Modal: 0 8px 32px rgba(0,0,0,0.16)
```

---

## 💻 TECH STACK (ĐÃ CHỐT)

```
Platform:       Google Apps Script (GAS) — Web App deploy
Database:       Google Sheets (14 sheets)
Frontend:       HTML5 + Vanilla CSS + Vanilla JavaScript (ES6+)
Charts:         Chart.js (CDN)
QR Generator:   api.qrserver.com (free API)
Auth:           Custom session (token trong PropertiesService GAS)
Responsive:     CSS Flexbox + Grid (không dùng framework)
Font:           Google Fonts (Be Vietnam Pro + Inter)
```

**QUAN TRỌNG:** Tech stack này ĐÃ ĐƯỢC CHỐT. Không thay đổi mà không có sự đồng ý của Human và Brain.

---

## 📁 FILE STRUCTURE

```
QuanLyCF/
├── .vibecode/                        ← Vibecode system files
│   ├── BLUEPRINT.md
│   ├── CONTRACT.md
│   ├── CODER_PACK.md
│   ├── SKILL_REQUIREMENTS.md
│   ├── WORKSPACE_CONVENTIONS.md
│   ├── PROGRESS.md
│   └── tasks/
│       ├── TASK_001.md
│       └── ...
│
└── src/                              ← Source code GAS project
    ├── Code.gs                       ← doGet(), doPost(), router
    ├── Auth.gs                       ← Login, session, phân quyền
    ├── Orders.gs                     ← Tạo đơn, hoàn tất, trừ kho
    ├── Inventory.gs                  ← NVL thô, NVL tinh chế, sơ chế
    ├── Products.gs                   ← CRUD sản phẩm, recipe
    ├── Staff.gs                      ← Hồ sơ NV, chấm công, lương
    ├── Reports.gs                    ← Doanh thu, lợi nhuận
    ├── Cashflow.gs                   ← Thu chi
    ├── Utils.gs                      ← generateId(), formatDate(), v.v.
    ├── Config.gs                     ← Đọc/ghi CONFIG sheet
    │
    └── pages/                        ← HTML templates
        ├── index.html                ← Login page
        ├── app.html                  ← App shell (sidebar + content)
        ├── menu.html                 ← QR Menu page (public)
        └── components/              ← JS modules cho từng trang
            ├── dashboard.js
            ├── orders.js
            ├── inventory.js
            ├── recipes.js
            ├── processing.js
            ├── staff.js
            ├── attendance.js
            ├── cashflow.js
            └── reports.js
```

---

## 🗄️ DATABASE SCHEMA (Google Sheets)

### Danh Sách 14 Sheets

| Sheet | Mục đích |
|-------|----------|
| `CONFIG` | Cài đặt chung: tên quán, logo, ca làm việc, danh sách bàn |
| `USERS` | Tài khoản + hash password + role |
| `STAFF` | Hồ sơ nhân viên + lương cơ bản |
| `CATEGORIES` | Danh mục sản phẩm |
| `PRODUCTS` | Menu đồ uống |
| `RAW_MATERIALS` | NVL thô + tồn kho |
| `REFINED_MATERIALS` | NVL tinh chế + tồn kho |
| `RECIPES` | Công thức: product_id → refined_material_id + qty |
| `ORDERS` | Header đơn hàng |
| `ORDER_ITEMS` | Chi tiết đơn (dòng sản phẩm) |
| `PROCUREMENT` | Phiếu nhập hàng NVL thô |
| `SUPPLIERS` | Nhà cung cấp |
| `PROCESSING_LOG` | Lịch sử sơ chế |
| `ATTENDANCE` | Chấm công: staff_id, date, time_in, time_out |
| `CASHFLOW` | Thu chi |

---

## 🔧 FEATURES & BEHAVIOR

### Feature: QR Order
**Mô tả:** Khách quét QR tại bàn → chọn món → đặt hàng → đơn tự động vào hệ thống.
**User flow:**
1. Khách quét QR bàn → mở trang `/menu?table=B01`
2. Chọn món, tích ghi chú (ít đường / không đường / ít đá)
3. Nhấn "Đặt hàng" → POST đến GAS backend
4. Đơn tạo trong ORDERS với `source="qr"`, `status="pending"`
5. Nhân viên xem đơn mới trên màn hình POS / Danh sách đơn
6. Pha chế xong → nhấn "Hoàn tất" → hệ thống trừ kho NVL tinh chế

**Edge cases:**
- Sản phẩm hết hàng (`status="out_of_stock"`) → ẩn khỏi menu QR
- Gửi đơn trống → validate client-side, show error

### Feature: Recipe & Tự Động Trừ Kho
**Mô tả:** Khi đơn hoàn tất, hệ thống tự động trừ NVL tinh chế theo công thức.
**User flow:**
1. Đơn chuyển `status="completed"`
2. `Orders.gs::completeOrder()` gọi `Inventory.gs::deductStock(order_id)`
3. Lấy ORDER_ITEMS → lấy RECIPES → trừ REFINED_MATERIALS
4. Nếu tồn < `min_stock` → ghi flag cảnh báo → Dashboard hiển thị

### Feature: Sơ Chế
**Mô tả:** Nhân viên ghi phiếu chuyển NVL thô → NVL tinh chế.
**User flow:**
1. Nhân viên vào tab Sơ Chế → "Tạo phiếu"
2. Chọn NVL thô tiêu hao (ví dụ: 250g hạt cà phê)
3. Chọn NVL tinh chế thu được (ví dụ: 750ml cốt cà phê)
4. Xác nhận → hệ thống kiểm tra tồn NVL thô đủ không
5. Nếu đủ: trừ NVL thô, cộng NVL tinh chế, ghi vào PROCESSING_LOG

**Edge cases:**
- NVL thô không đủ → block, hiển thị lỗi rõ ràng

### Feature: Chấm Công
**Mô tả:** Nhân viên bấm nút VÀO CA / RA CA, server tự ghi timestamp.
**User flow:**
1. NV đăng nhập → vào trang `/attendance`
2. Nếu chưa vào ca: hiển thị nút 🟢 VÀO CA (xanh, to)
3. Bấm → `Staff.gs::clockIn()` ghi `time_in = new Date()` vào ATTENDANCE
4. Nút chuyển thành 🔴 RA CA
5. Cuối ca bấm RA CA → ghi `time_out`, tính `hours_worked`

**Edge cases:**
- Bấm VÀO CA khi đã vào ca → warning "Bạn đã vào ca từ [HH:MM]"
- Quên bấm RA CA → Manager sửa thủ công trong bảng quản lý

---

## 🌐 RESPONSIVE BEHAVIOR

```
Mobile  (< 640px):   Sidebar ẩn (toggle menu), font/nút to hơn
Tablet  (640-1024px): Sidebar thu gọn (icon only)
Desktop (> 1024px):  Sidebar đầy đủ, full layout
```

**Breakpoint-specific behaviors:**
- Navigation: Hamburger + drawer on mobile, full sidebar on desktop
- Nút VÀO CA / RA CA: chiếm full width trên mobile
- QR Menu: layout đơn cột trên mobile, 2 cột sản phẩm trên tablet+

---

## ✅ DEFINITION OF DONE (Toàn dự án)

```
□ QR Menu hoạt động: khách quét → gọi món → đơn vào hệ thống
□ POS: nhân viên tạo đơn thủ công thành công
□ Hoàn tất đơn → NVL tinh chế tự động trừ đúng theo recipe
□ Sơ chế: tạo phiếu → trừ NVL thô, cộng NVL tinh chế
□ Chấm công: bấm VÀO/RA CA → timestamp tự ghi đúng
□ Dashboard: KPI hiển thị đúng số thực từ Sheets
□ Responsive: dùng được trên điện thoại nhân viên
□ Phân quyền: Admin/Manager/Cashier/Viewer đúng tính năng
□ Không có JS error nghiêm trọng trên console
□ GAS Web App deploy thành công, truy cập qua URL
```

---

## ⚠️ KHÔNG BAO GỒM (Explicitly Excluded)

```
• Quản lý bàn (sơ đồ bàn, trạng thái bàn) — không cần theo yêu cầu
• Báo cáo VAT — chưa yêu cầu
• Quản lý bảo hành sản phẩm
• Quản lý Serial/IMEI
• Màn hình bếp riêng (Kitchen Display)
• Nhiều size sản phẩm (S/M/L) — recipe chung 1 size
• Payment gateway tích hợp (chỉ ghi nhận tiền mặt / chuyển khoản)
• Mobile native app (chỉ responsive web)
```

---

## 📝 NOTES & DECISIONS

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 2026-03-25 | Nền tảng: Google Sheets + Apps Script | Zero hosting cost, dễ maintain, client quen dùng Google |
| 2026-03-25 | Không dùng framework JS | Giảm complexity, GAS có giới hạn về bundle size |
| 2026-03-25 | Trừ kho khi đơn hoàn tất | Tránh trừ nhầm khi khách hủy |
| 2026-03-25 | Tab Sơ Chế riêng | Nhân viên cần ghi log tường minh khi pha mẻ NVL |
| 2026-03-25 | Chấm công: server timestamp | Tránh nhân viên nhập tay sai giờ |
| 2026-03-25 | Loại bỏ quản lý bàn | Quy trình: order → in bill → thanh toán ngay, không giữ bàn |

---

*Blueprint này là KHẾ ƯỚC giữa Brain, Coder và Human.*
*Thay đổi cấu trúc sau khi APPROVED cần Brain và Human đồng ý.*
