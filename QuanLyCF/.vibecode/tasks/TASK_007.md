# TASK #007: Sơ Chế — Chuyển NVL Thô → NVL Tinh Chế
**Tạo bởi:** Brain
**Ngày tạo:** 2026-03-26
**Ưu tiên:** P0
**Ước tính:** 40 phút
**Phụ thuộc:** TASK_005

---

## 🎯 MỤC TIÊU

Xây dựng tab Sơ Chế: nhân viên tạo phiếu ghi nhận việc chế biến NVL thô thành NVL tinh chế. Hệ thống trừ tồn NVL thô và cộng tồn NVL tinh chế theo phiếu.

---

## 📋 YÊU CẦU CHI TIẾT

### Phải làm (MUST):
- [ ] Thêm vào `src/Inventory.gs`: `createProcessingLog(token, data)`, `getProcessingLogs(token)`
- [ ] `createProcessingLog`: kiểm tra NVL thô đủ tồn → nếu không đủ: block + trả lỗi; nếu đủ: trừ NVL thô, cộng NVL tinh chế, ghi vào PROCESSING_LOG
- [ ] Tạo `src/pages/components/processing.js` — UI tab Sơ Chế
- [ ] Form tạo phiếu sơ chế: dropdown NVL thô + số lượng tiêu hao → dropdown NVL tinh chế + số lượng thu được
- [ ] Sau khi tạo phiếu: hiển thị xác nhận + làm mới số liệu tồn kho
- [ ] Bảng lịch sử sơ chế: ngày, nhân viên, NVL thô dùng, NVL tinh chế thu được

### Không làm (DO NOT):
- ❌ Không cho phép sơ chế ngược (tinh chế → thô)
- ❌ Không làm batch nhiều NVL trong 1 phiếu (1 phiếu = 1 NVL thô → 1 NVL tinh chế)

---

## 📁 FILES CẦN TẠO / SỬA

### Tạo mới:
```
src/pages/components/processing.js    ← UI tab Sơ Chế
```

### Sửa đổi:
```
src/Inventory.gs    ← Thêm createProcessingLog, getProcessingLogs
```

---

## 🔧 HƯỚNG DẪN KỸ THUẬT

### Inventory.gs — createProcessingLog():

```javascript
function createProcessingLog(token, data) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  // Kiểm tra tồn NVL thô đủ không
  const rawMats = getSheetData('RAW_MATERIALS');
  const rawMat = rawMats.find(m => m.material_id === data.raw_material_id);
  if (!rawMat) return { error: 'NVL thô không tồn tại' };
  if (Number(rawMat.stock_qty) < Number(data.raw_qty_used)) {
    return { error: `Không đủ tồn kho. Hiện có: ${rawMat.stock_qty} ${rawMat.unit}` };
  }
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    // Trừ NVL thô
    updateStock('RAW_MATERIALS', 'material_id', data.raw_material_id, 'stock_qty', -Number(data.raw_qty_used));
    // Cộng NVL tinh chế
    updateStock('REFINED_MATERIALS', 'refined_id', data.refined_id, 'stock_qty', Number(data.refined_qty_produced));
    // Ghi log
    const id = generateId('LOG');
    appendRow('PROCESSING_LOG', [id, data.raw_material_id, data.raw_qty_used, data.refined_id, data.refined_qty_produced, user.staff_id, new Date().toISOString()]);
    return { success: true, log_id: id };
  } finally {
    lock.releaseLock();
  }
}
```

### UI form sơ chế:
```
Phiếu Sơ Chế Mới
─────────────────────────────────────────
NVL Thô tiêu hao:
  [Dropdown: Hạt cà phê (tồn: 500g)] [Nhập: 250] [Đơn vị: g]

NVL Tinh Chế thu được:
  [Dropdown: Cốt cà phê]             [Nhập: 750] [Đơn vị: ml]

                            [Xác Nhận Sơ Chế]
─────────────────────────────────────────
```

---

## 🏁 DEFINITION OF DONE

- [ ] Click "Sơ Chế" sidebar → hiển thị form + lịch sử
- [ ] Tạo phiếu với NVL thô đủ tồn → tồn NVL thô giảm, tồn NVL tinh chế tăng đúng
- [ ] Tạo phiếu với NVL thô KHÔNG đủ → hiển thị lỗi, không ghi gì
- [ ] Lịch sử sơ chế hiển thị đúng: ngày, NVL vào, NVL ra, nhân viên

---

## 📌 GHI CHÚ CHO CODER

> Phải dùng `LockService` để tránh race condition khi 2 nhân viên sơ chế cùng lúc.
> Ví dụ thực tế: "250g hạt cà phê" → "750ml cốt cà phê"
