# TASK #012: Thu Chi
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P1
**Ước tính:** 35 phút
**Phụ thuộc:** TASK_002

---

## 🎯 MỤC TIÊU

Xây dựng module Thu Chi: ghi nhận các khoản thu nhập ngoài bán hàng và chi phí vận hành (điện, nước, lương, thuê mặt bằng…). Hiển thị tổng hợp dòng tiền theo tháng.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Tạo `src/Cashflow.gs` với: `getCashflow(token, year, month)`, `createCashflow(token, data)`
- [ ] Tạo `src/pages/components/cashflow.js` — UI thu chi
- [ ] Form thêm khoản thu/chi: loại (Thu/Chi), danh mục (dropdown + tự nhập), số tiền, ghi chú, ngày
- [ ] Danh mục mặc định sẵn: Thu: Bán hàng, Khác | Chi: Điện nước, Thuê mặt bằng, Lương, Nhập hàng, Vật tư, Khác
- [ ] Bảng danh sách theo tháng: ngày, loại, danh mục, số tiền, ghi chú
- [ ] Tổng hợp: Tổng Thu − Tổng Chi = Dòng tiền ròng (hiển thị to, màu xanh/đỏ)
- [ ] Filter chọn tháng/năm

### Không làm (DO NOT):
- ❌ Không làm biểu đồ thu chi phức tạp (chỉ số liệu tổng hợp đủ)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/Cashflow.gs                       ← CRUD thu chi
src/pages/components/cashflow.js      ← UI thu chi
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Cashflow.gs:

```javascript
function getCashflow(token, year, month) {
  if (!validateSession(token)) return { error: 'UNAUTHORIZED' };
  
  const all = getSheetData('CASHFLOW');
  const filtered = all.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
  });
  
  const totalIncome  = filtered.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = filtered.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
  
  return { data: filtered, totalIncome, totalExpense, netCashflow: totalIncome - totalExpense };
}
```

---

## 🏁 DEFINITION OF DONE

- [ ] Form thêm khoản thu/chi hoạt động, ghi đúng vào CASHFLOW sheet
- [ ] Bảng danh sách lọc theo tháng đúng
- [ ] Tổng thu / chi / ròng hiển thị đúng
- [ ] Dòng tiền ròng âm → hiển thị màu đỏ; dương → xanh

---

## 📌 GHI CHÚ CHO CODER

> Doanh thu bán hàng không tự động ghi vào CASHFLOW — đó là từ ORDERS.
> Thu chi chỉ là các khoản ngoài (chi phí vận hành + thu nhập phụ).
