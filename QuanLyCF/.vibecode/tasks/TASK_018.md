# TASK #018: Fix V8 Serialization Bug (Silent null)
**Tạo bởi:** Brain
**Ngày tạo:** 2026-04-11
**Ưu tiên:** P0 (Critical - Backend API trả về null)
**Ước tính:** 10 phút

---

## 🎯 ROOT CAUSE THỨ 2 ĐÃ XÁC ĐỊNH

Dù các lỗi Permission đã sửa ở `TASK_017` và API đã có dữ liệu, nhưng frontend vẫn báo "Không xác định". Nguyên nhân cuối cùng là **Lỗi Serialize Date của Google Apps Script V8**:

Khi bạn đọc dữ liệu từ Sheets bằng `getDataRange().getValues()`, các ô có định dạng Ngày/Giờ sẽ được trả về dưới dạng Java/JS `Date` object native. Khi các hàm `.gs` gửi mảng chứa `Date` này qua cầu ngầm `google.script.run` về client, Engine V8 của GAS thỉnh thoảng sẽ **chặn lại (silently drop)** vì nó không thể Serialize các Date object phức tạp qua JSON over-the-wire. Hệ quả là nó lẳng lặng trả về `null` thay vì ném ra một Error cản lại (`withFailureHandler` không trigger mà `withSuccessHandler` lại nhận `null`).

Đó là lý do tất cả logic đúng, Try-Catch đúng nhưng kết quả vẫn bằng 0.

## 📋 YÊU CẦU CHI TIẾT

Brain đã chuẩn bị sẵn file sửa đổi trong `Utils.gs`. Coder cần:

### Step 1: Xác nhận code trong `src/Utils.gs`

Đảm bảo vòng lặp đọc `getSheetData` đã có đoạn mã chặn dòng:

```javascript
    headers.forEach((h, i) => {
      let val = row[i];
      // Workaround cho GAS V8: google.script.run sẽ lẳng lặng trả về null nếu gửi object có chứa Date native!
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
      }
      obj[h] = val;
    });
```

*(Brain đã edit ghi đè vào file trên local. Coder chỉ cần verify file `Utils.gs` có chứa nó).*

### Step 2: Push và Deploy Lần Cuối

Thực hiện:
```bash
1. clasp push
```

**Nhắn User tiến hành Deploy Version Mới:**
- Coder thông báo cho User vào Apps Script tạo một deployment **New Version** mới nhất để đưa bản vá V8 Serialize lên server.

---

## 🏁 DEFINITION OF DONE
- [x] Date format workaround có mặt trong `Utils.gs`.
- [ ] Code đẩy lên GAS thành công (clasp push).
- [ ] Nhắn User tạo New Version và F5 lại trang Web App chính thức.

---

> [!TIP]
> Đây là một "gotcha" cực kỳ kinh điển trong lập trình App Script SPA. Các hàm trả về client luôn luôn phải filter Native Dates thành Strings.
