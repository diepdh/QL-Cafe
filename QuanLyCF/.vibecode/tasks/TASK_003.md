# TASK #003: Dashboard Page (KPI + Chart)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 45 phút
**Phụ thuộc:** TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng trang Dashboard với 4 KPI cards, biểu đồ doanh thu 7 ngày, stats banner (tuần/tháng/công nợ/đơn tháng) và bảng đơn hàng gần đây. Data lấy thực từ Google Sheets.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Reports.gs` với function `getDashboardData(token)` trả về: doanh thu hôm nay, lợi nhuận hôm nay, số đơn hôm nay, số NVL sắp hết, doanh thu 7 ngày (array), doanh thu tuần/tháng, công nợ (= 0 tạm), đơn tháng, 10 đơn gần nhất
- [ ] Tạo `src/pages/components/dashboard.js` — render dashboard HTML và gọi `getDashboardData`
- [ ] 4 KPI Cards: Doanh Thu Hôm Nay, Lợi Nhuận, Số Đơn, Sắp Hết Hàng (số đỏ nếu > 0)
- [ ] Line chart doanh thu 7 ngày dùng Chart.js (CDN)
- [ ] Stats banner 4 ô: Tuần này, Tháng này, Công nợ, Đơn tháng
- [ ] Bảng "Đơn hàng gần đây" — 10 dòng, cột: Mã đơn, Bàn, Tổng tiền, Trạng thái, Thời gian
- [ ] Nút "Làm mới" reload data

### Không làm (DO NOT):
- ❌ Không implement báo cáo chi tiết (TASK_017)
- ❌ Không làm filter theo kỳ (chỉ hôm nay + 7 ngày)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Reports.gs                      ← getDashboardData()
src/pages/components/dashboard.js   ← Render dashboard UI
```

### Sửa đổi:
```
src/pages/app.html                  ← Load Chart.js CDN, load dashboard.js
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Reports.gs — getDashboardData():

```javascript
function getDashboardData(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const orders = getSheetData('ORDERS');
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  
  const todayOrders = orders.filter(o => 
    o.status === 'completed' && 
    Utilities.formatDate(new Date(o.completed_at), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === today
  );
  
  // KPI
  const revenueToday = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);
  // Lợi nhuận tạm = doanh thu * 40% (sẽ tính chính xác theo giá vốn ở task sau)
  const profitToday = revenueToday * 0.4;
  const orderCount = todayOrders.length;
  
  // NVL sắp hết
  const rawMats = getSheetData('RAW_MATERIALS');
  const refinedMats = getSheetData('REFINED_MATERIALS');
  const lowStock = [...rawMats, ...refinedMats].filter(m => 
    Number(m.stock_qty) <= Number(m.min_stock)
  ).length;
  
  // 7 ngày gần nhất
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    const label = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'dd/MM');
    const dayRevenue = orders
      .filter(o => o.status === 'completed' && 
        Utilities.formatDate(new Date(o.completed_at), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === dateStr)
      .reduce((sum, o) => sum + Number(o.total), 0);
    last7Days.push({ label, value: dayRevenue });
  }
  
  // 10 đơn gần nhất
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
  
  return { revenueToday, profitToday, orderCount, lowStock, last7Days, recentOrders };
}
```

### Chart.js CDN (thêm vào app.html):
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### Dashboard KPI Card HTML pattern:
```html
<div class="kpi-card">
  <div class="kpi-icon">💰</div>
  <div class="kpi-body">
    <div class="kpi-label">Doanh Thu Hôm Nay</div>
    <div class="kpi-value" id="revenueToday">—</div>
  </div>
</div>
```

---

## 🏁 DEFINITION OF DONE

- [ ] Click "Dashboard" trên sidebar → trang dashboard hiển thị
- [ ] 4 KPI cards có giá trị thực từ Sheets (không hardcode)
- [ ] Line chart hiển thị đúng 7 label ngày + đường doanh thu
- [ ] Stats banner 4 ô hiển thị đúng
- [ ] Bảng đơn gần đây hiển thị (rỗng nếu chưa có đơn)
- [ ] Nút "Làm mới" reload được data
- [ ] Responsive: layout 2 cột trên desktop, 1 cột trên mobile

---

## 📌 GHI CHÚ CHO CODER

> Khi ORDERS sheet còn rỗng, các giá trị KPI = 0 là đúng — không lỗi.
> Định dạng tiền VNĐ: dùng `(value).toLocaleString('vi-VN') + ' đ'`
