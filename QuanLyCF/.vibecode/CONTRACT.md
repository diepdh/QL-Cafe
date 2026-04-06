# 📜 CONTRACT: QuanLyCF — Phần Mềm Quản Lý Quán Cafe
## Vibecode v5.0 — Được ký ngày 2026-03-26

---

## ✅ DELIVERABLES

| # | Item | Chi tiết | Ưu tiên |
|---|------|----------|---------|
| 1 | GAS Web App deploy | URL truy cập được, login hoạt động | P0 |
| 2 | QR Order System | Khách quét QR → gọi món → đơn vào hệ thống | P0 |
| 3 | POS (Tạo đơn thủ công) | NV tạo đơn, hoàn tất, trừ kho tự động | P0 |
| 4 | Kho 3 lớp | CRUD NVL thô, NVL tinh chế, Sản phẩm menu | P0 |
| 5 | Recipe & Tự động trừ kho | Khi đơn hoàn tất → trừ NVL tinh chế theo recipe | P0 |
| 6 | Sơ chế | Tab sơ chế: NVL thô → NVL tinh chế, ghi log | P0 |
| 7 | Nhân viên & Chấm công | Hồ sơ NV, nút VÀO/RA CA với server timestamp | P1 |
| 8 | Thu Chi | Ghi nhận dòng tiền ra/vào | P1 |
| 9 | Dashboard & Báo cáo | KPI, biểu đồ doanh thu, top sản phẩm, NVL tiêu thụ | P1 |
| 10 | Phân quyền | 4 cấp: Admin / Manager / Cashier / Viewer | P0 |
| 11 | Responsive | Chạy được trên desktop và điện thoại nhân viên | P0 |
| 12 | QR Generator | Tạo/in QR từng bàn trong Cài Đặt | P1 |

---

## 🛠️ TECH STACK (ĐÃ CHỐT — KHÔNG ĐỔI)

```
• Platform:    Google Apps Script (GAS) — Web App
• Database:    Google Sheets (14 sheets)
• Frontend:    HTML5 + Vanilla CSS + Vanilla JavaScript (ES6+)
• Charts:      Chart.js (CDN)
• QR:          api.qrserver.com (free API, không cần key)
• Auth:        Custom session token (PropertiesService GAS)
• Font:        Google Fonts — Be Vietnam Pro + Inter
```

---

## ⚠️ KHÔNG BAO GỒM (Explicitly Excluded)

```
• Quản lý bàn / sơ đồ bàn
• Báo cáo VAT / xuất hóa đơn VAT
• Quản lý bảo hành / Serial / IMEI
• Màn hình bếp riêng (Kitchen Display Screen)
• Nhiều size sản phẩm (S/M/L)
• Payment gateway tích hợp (chỉ ghi nhận cash/transfer)
• Mobile native app
• Multi-tenant (nhiều quán)
```

---

## 📏 DEFINITION OF DONE (Toàn dự án)

```
□ GAS Web App deploy thành công, truy cập qua URL
□ Login/Logout hoạt động, session expire sau 8 giờ
□ QR Menu: khách quét → chọn món → gửi → đơn vào ORDERS
□ POS: nhân viên tạo đơn thủ công → hoàn tất → trừ kho đúng
□ Recipe: trừ đúng NVL tinh chế theo công thức khi đơn hoàn tất
□ Sơ chế: tạo phiếu → trừ NVL thô, cộng NVL tinh chế, ghi log
□ Chấm công: nút VÀO/RA CA → timestamp server tự ghi, không nhập tay
□ Dashboard: KPI tính đúng từ dữ liệu Sheets thực
□ Phân quyền: 4 role đúng tính năng, Viewer không thấy nút edit
□ Responsive: layout không vỡ trên mobile 375px và desktop 1440px
□ Không có JS error nghiêm trọng trên console Chrome
□ LockService được dùng khi ghi ORDERS và ATTENDANCE
```

---

## 🗓️ KẾ HOẠCH BUILD (5 Sprints)

| Sprint | Nội dung | Tasks dự kiến |
|--------|----------|--------------|
| S1 | Setup nền tảng: Sheets, Auth, App Shell, Sidebar | TASK_001 – 003 |
| S2 | Kho hàng: Products, NVL thô/tinh chế, Recipe, Sơ chế | TASK_004 – 007 |
| S3 | Orders: POS, QR Menu, Hoàn tất đơn + trừ kho | TASK_008 – 011 |
| S4 | Nhân sự: Hồ sơ NV, Chấm công, Báo cáo tháng | TASK_012 – 014 |
| S5 | Tài chính + Báo cáo + Dashboard + QR Generator | TASK_015 – 018 |

---

## ✅ XÁC NHẬN

> Human reply **"CONFIRM"** → Brain bắt đầu PHASE 2: ORCHESTRATION
> (Viết TASK_001 và các file hỗ trợ Coder)

---

*Ký bởi: Brain (Antigravity AI) — 2026-03-26*
*Đại diện Human: Anh (Chủ dự án)*
