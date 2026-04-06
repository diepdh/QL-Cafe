# TASK #013: Báo Cáo Doanh Thu
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P1
**Ước tính:** 45 phút
**Phụ thuộc:** TASK_009, TASK_003

---

## 🎯 MỤC TIÊU

Xây dựng trang Báo Cáo Doanh Thu chi tiết: lọc theo ngày/tuần/tháng/quý, so sánh kỳ trước, top sản phẩm bán chạy, NVL tiêu thụ, lợi nhuận gộp ước tính.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `Reports.gs`: `getRevenueReport(token, dateFrom, dateTo)` trả về: doanh thu, số đơn, giá trị TB/đơn, top 5 SP, NVL tiêu thụ (từ PROCESSING_LOG), lợi nhuận ước tính
- [ ] Tạo `src/pages/components/reports.js` — UI báo cáo
- [ ] Filter: chọn khoảng ngày (from-to) hoặc phím tắt (Hôm nay / 7 ngày / Tháng này / Tháng trước)
- [ ] KPI row: Doanh thu, Số đơn, Giá trị TB, Lợi nhuận gộp (ước tính 40% doanh thu)
- [ ] Biểu đồ cột: doanh thu theo ngày trong khoảng filter (Chart.js)
- [ ] Bảng Top 5 sản phẩm bán chạy: tên, số lượng, doanh thu
- [ ] Bảng NVL tiêu thụ (từ PROCESSING_LOG): NVL thô + số lượng đã dùng trong kỳ

### Không làm (DO NOT):
- ❌ Không làm báo cáo nhân sự (task này chỉ doanh thu)
- ❌ Không làm AI nhận xét (scope không có)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/reports.js    ← UI báo cáo doanh thu
```

### Sửa đổi:
```
src/Reports.gs    ← Thêm getRevenueReport()
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Reports.gs — getRevenueReport():

```javascript
function getRevenueReport(token, dateFrom, dateTo) {
  if (!validateSession(token)) return { error: 'UNAUTHORIZED' };
  
  const from = new Date(dateFrom);
  const to   = new Date(dateTo);
  to.setHours(23, 59, 59);
  
  const orders = getSheetData('ORDERS').filter(o => {
    if (o.status !== 'completed') return false;
    const d = new Date(o.completed_at);
    return d >= from && d <= to;
  });
  
  const orderItems = getSheetData('ORDER_ITEMS');
  const products   = getSheetData('PRODUCTS');
  
  // Top sản phẩm
  const productSales = {};
  orders.forEach(o => {
    orderItems.filter(i => i.order_id === o.order_id).forEach(i => {
      if (!productSales[i.product_id]) productSales[i.product_id] = { qty: 0, revenue: 0 };
      const prod = products.find(p => p.product_id === i.product_id);
      productSales[i.product_id].qty += Number(i.quantity);
      productSales[i.product_id].revenue += Number(i.quantity) * Number(prod?.price || 0);
      productSales[i.product_id].name = prod?.name || i.product_id;
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  
  return {
    totalRevenue,
    orderCount: orders.length,
    avgOrderValue: orders.length ? totalRevenue / orders.length : 0,
    estimatedProfit: totalRevenue * 0.4,
    topProducts,
    orders
  };
}
```

---

## 🏁 DEFINITION OF DONE

- [ ] Trang Báo Cáo tải, filter "Tháng này" → KPI và biểu đồ hiển thị đúng
- [ ] Đổi filter "7 ngày" → data cập nhật đúng
- [ ] Top 5 sản phẩm hiển thị đúng số lượng và doanh thu
- [ ] Biểu đồ cột: đúng nhãn ngày và giá trị doanh thu
- [ ] Khi chưa có đơn → hiển thị "Không có dữ liệu" thay vì lỗi

---

## 📌 GHI CHÚ CHO CODER

> Lợi nhuận gộp = ước tính 40% doanh thu (chưa có tính giá vốn thực tế — đủ dùng).
> Biểu đồ cột dùng Chart.js `type: 'bar'` với labels = ngày và data = doanh thu ngày đó.
