# 📊 CẤU HÌNH GOOGLE SHEETS — QuanLyCF-DB

Anh hãy tạo các sheet sau trong Google Spreadsheet **"QuanLyCF-DB"** và copy nội dung tương ứng vào **Dòng 1 (Headers)**. Sau đó thêm dữ liệu Seed (nếu có).

---

## 1. Sheet: `CONFIG`
**Headers (Row 1):**
`key` | `value`

**Seed Data:**
- `cafe_name` | `Tên Quán Cafe`
- `cafe_logo_url` | `(để trống)`
- `shift_morning` | `07:00-13:00`
- `shift_afternoon` | `13:00-19:00`
- `shift_evening` | `19:00-23:00`
- `tables` | `B01,B02,B03,B04,B05`

---

## 2. Sheet: `USERS`
**Headers (Row 1):**
`user_id` | `username` | `password_hash` | `role` | `staff_id`

**Seed Data:**
`USR-001` | `admin` | `12345678` | `admin` | `STF-001`

---

## 3. Sheet: `STAFF`
**Headers (Row 1):**
`staff_id` | `full_name` | `phone` | `email` | `position` | `start_date` | `hourly_rate` | `status`

**Seed Data:**
`STF-001` | `Quản Trị Viên` | `0900000000` | `admin@example.com` | `manager` | `2026-03-26` | `50000` | `active`

---

## 4. Sheet: `CATEGORIES`
**Headers (Row 1):**
`category_id` | `name` | `sort_order`

**Seed Data:**
- `CAT-001` | `Cà Phê` | `1`
- `CAT-002` | `Trà` | `2`
- `CAT-003` | `Nước Ép` | `3`

---

## 5. Sheet: `PRODUCTS`
**Headers (Row 1):**
`product_id` | `name` | `category_id` | `price` | `image_url` | `status` | `created_at`

**Seed Data:**
- `PRD-001` | `Cà Phê Sữa Đá` | `CAT-001` | `35000` | | `active` | `2026-03-26`
- `PRD-002` | `Trà Đào` | `CAT-002` | `30000` | | `active` | `2026-03-26`
- `PRD-003` | `Nước Cam Ép` | `CAT-003` | `40000` | | `active` | `2026-03-26`

---

## 6. Sheet: `RAW_MATERIALS`
**Headers (Row 1):**
`material_id` | `name` | `unit` | `stock_qty` | `min_stock` | `supplier_id`

**Seed Data:**
`RAW-001` | `Hạt Cà Phê` | `g` | `10000` | `2000` | `SUP-001`

---

## 7. Sheet: `REFINED_MATERIALS`
**Headers (Row 1):**
`refined_id` | `name` | `unit` | `stock_qty` | `min_stock`

**Seed Data:**
`REF-001` | `Cốt Cà Phê` | `ml` | `5000` | `1000`

---

## 8. Sheet: `RECIPES`
**Headers (Row 1):**
`recipe_id` | `product_id` | `refined_id` | `quantity` | `unit`

**Seed Data:**
`REC-001` | `PRD-001` | `REF-001` | `50` | `ml`

---

## 9. Sheet: `ORDERS`
**Headers (Row 1):**
`order_id` | `table_code` | `source` | `status` | `payment_method` | `subtotal` | `discount` | `total` | `staff_id` | `created_at` | `completed_at`

---

## 10. Sheet: `ORDER_ITEMS`
**Headers (Row 1):**
`item_id` | `order_id` | `product_id` | `quantity` | `note`

---

## 11. Sheet: `PROCUREMENT`
**Headers (Row 1):**
`procurement_id` | `material_id` | `quantity` | `unit_price` | `supplier_id` | `date`

---

## 12. Sheet: `SUPPLIERS`
**Headers (Row 1):**
`supplier_id` | `name` | `phone` | `note`

**Seed Data:**
`SUP-001` | `Nhà Cung Cấp A` | `0911111111` | `Chuyên cà phê hạt`

---

## 13. Sheet: `PROCESSING_LOG`
**Headers (Row 1):**
`log_id` | `raw_material_id` | `raw_qty_used` | `refined_id` | `refined_qty_produced` | `staff_id` | `created_at`

---

## 14. Sheet: `ATTENDANCE`
**Headers (Row 1):**
`attendance_id` | `staff_id` | `date` | `shift` | `time_in` | `time_out` | `hours_worked` | `note` | `edited_by`

---

## 15. Sheet: `CASHFLOW`
**Headers (Row 1):**
`cashflow_id` | `type` | `category` | `amount` | `note` | `date`
