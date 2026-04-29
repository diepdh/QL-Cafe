# Goal: Tang toc app QuanLyCF tren dien thoai

## Boi canh
Ung dung `QuanLyCF` la web app Google Apps Script + HTML/JS/CSS, duoc dung de quan ly quan cafe. Khi su dung tren dien thoai, app co bieu hien lag, phan hoi cham, scroll khong muot, va thao tac o cac man hinh nghiep vu chinh bi tre.

## Van de can giai quyet
Can xac dinh va uu tien dung cac diem nghen hieu nang tren mobile, sau do dua ra lo trinh cai thien co the ap dung an toan vao code hien tai. Uu tien cac thay doi ROI cao, rui ro thap, va co the rollout tung buoc.

## Muc tieu chinh
1. Giam do tre thao tac tren mobile o cac man hinh dung nhieu nhat.
2. Tang toc do render va giam giat/lag khi:
   - tim kiem san pham trong POS
   - them/xoa/tang/giam so luong mon trong gio hang POS
   - tai dashboard va bieu do doanh thu
   - loc/tim kiem trong cac bang du lieu
   - cham cong va chinh sua bang cong tren dien thoai
   - mo/chinh sua cong thuc co nhieu nguyen lieu
3. Xep thu tu uu tien theo man hinh su dung nhieu nhat:
   - POS
   - Dashboard
   - San pham va cac bang tim kiem
   - Cham cong
   - Cong thuc
4. Chuan bi blueprint co the tach thanh tasks de dua vao orchestrator o buoc sau.

## Cac diem nghen bat buoc phai duoc xet trong blueprint
- `filterTable()` dang dung `row.innerText` trong loop cho moi keystroke.
- POS cart dang full re-render moi lan doi so luong.
- `prompt()` tren trang cham cong block JS thread tren mobile.
- `appendChild()` trong loop o recipes co the gay nhieu reflow.
- Debounce cho search/filter van la quick win bat buoc.
- CSS mobile, chart rendering, va data reload giua cac tab can duoc xem xet nhu cac nguyen nhan muc cao.

## Pham vi uu tien
- Frontend trong `src/pages/app.html`
- `src/pages/components/orders.html`
- `src/pages/components/products.html`
- `src/pages/components/attendance.html`
- `src/pages/components/recipes.html`
- Co the mo rong sang `reports.html`, `staff.html` neu can
- Backend `.gs` chi sua neu co bang chung ro rang rang do tre den tu API/Sheets

## Rang buoc
- Khong lam thay doi nghiep vu quan ly cua app
- Khong pha vo luong QR menu, POS, don hang, bao cao, cham cong
- Uu tien thay doi nho, de review, de rollback
- Moi giai phap phai duoc phan loai ro:
  - quick wins an toan
  - medium refactors
  - advanced changes de sau
- Khong duoc dua claim hieu nang manh neu chua co cach test/xac minh

## Dau ra mong muon cua Phase A
1. `plan.md` mo ta cach Brain tiep can bai toan sau khi da tong hop feedback reviewer
2. `feedback_1.md` va `feedback_2.md` de phan bien doc lap
3. `blueprint.md` tong hop:
   - danh sach hotspot mobile performance da duoc xac nhan
   - nguyen nhan goc co kha nang cao
   - thu tu uu tien theo man hinh
   - task breakdown cu the cho orchestrator
   - pham vi file bi anh huong
   - cach test truoc/sau
   - tieu chi PASS/REVISE/BLOCK cho tung task

## Tieu chi thanh cong
- Co lo trinh toi uu ro rang, uu tien dung diem nghen lon nhat
- Co task breakdown nho, review duoc, rollback duoc
- Cac quick win co ROI cao duoc dua len truoc
- Blueprint du format de build `tasks.json` o buoc ke tiep
