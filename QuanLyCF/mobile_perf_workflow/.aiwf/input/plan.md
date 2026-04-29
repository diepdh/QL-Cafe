# Plan: Phase A cho bai toan toi uu mobile performance cua QuanLyCF

## 1. Muc tieu cua plan
Tao mot ke hoach thuc dung de bien bai toan "app bi lag tren dien thoai" thanh mot blueprint co the chia task cho workflow. Ke hoach nay da tong hop feedback reviewer va dieu chinh uu tien theo man hinh nghiep vu, khong chi theo nhom ky thuat.

## 2. Hieu biet workflow se ap dung
Theo `WINDOWS_WORKFLOW_FROM_SCRATCH.md` va `orchestrator.py`, workspace cho workflow can co:
- `.aiwf/input/goal.md`
- `.aiwf/input/plan.md`
- sau do bo sung `feedback_1.md`, `feedback_2.md`, `blueprint.md`
- khi co `blueprint.md`, se build `tasks.json` va `state.json`, roi moi chay orchestrator

Vi vay, dau ra cua buoc nay phai giup cho `blueprint.md` de parse va de chia task duoc.

## 3. Tong hop y kien da duoc xac nhan
7/7 gia thuyet ban dau deu duoc reviewer xac nhan. Ngoai ra, co 4 diem nghen nghiem trong da bi bo sot va phai dua vao nhom uu tien cao:
1. `filterTable()` dung `.innerText` trong loop cho moi keystroke, gay forced layout tren toan bo rows.
2. POS cart full re-render moi lan tang/giam so luong, thuc te la quick win chu khong nen day xuong nhom refactor sau.
3. `prompt()` trong `attendance.html` block JS thread tren mobile, gay trai nghiem te va de sua bang modal co san.
4. `appendChild()` trong loop o `recipes.html` tao nhieu reflow, co the sua bang `DocumentFragment`.

## 4. Nguyen tac uu tien moi
Thay vi xep theo ky thuat, blueprint se xep theo man hinh co tan suat su dung cao nhat:
1. POS
2. Dashboard
3. San pham va cac bang tim kiem
4. Cham cong
5. Cong thuc

Nguyen tac nay giup task rollout tao tac dong that som cho nguoi dung tren dien thoai.

## 5. Hotspots ky thuat can dua vao blueprint

### Nhom POS
- Search san pham khong debounce
- Loc san pham dang render lai grid
- Gio hang POS full re-render moi lan doi quantity
- Co the co chi phi CSS/paint cao o vung thao tac nhieu

### Nhom Dashboard
- Render Chart.js tren mobile
- Tai dashboard va update KPI co the gay jank neu khong defer hop ly

### Nhom San pham va bang du lieu
- `filterTable()` dung `innerText` tren moi row o moi lan go phim
- Chua co co che search token/data-search de giam layout thrash

### Nhom Cham cong
- `prompt()` khi sua bang cong
- `alert()`/`confirm()` van con ton tai, can danh dau de xem xet trong rollout sau

### Nhom Cong thuc
- `appendChild()` trong loop khi render nhieu dong nguyen lieu
- Co the gop DOM update bang `DocumentFragment`

## 6. Dieu chinh pham vi file bi anh huong
Danh sach chinh thuc trong blueprint can bao gom:
- `src/pages/app.html`
- `src/pages/components/orders.html`
- `src/pages/components/products.html`
- `src/pages/components/attendance.html`
- `src/pages/components/recipes.html`

Co the mo rong them neu task can, nhung 5 file tren la tam chinh cua bai toan mobile performance hien tai.

## 7. Chien luoc tao blueprint
Blueprint se duoc to chuc theo 4 lop:

### Lop A: Final goal va guardrails
- Mo ta muc tieu chung
- Bao dam khong thay doi nghiep vu
- Bao dam moi task co rollback path ro rang

### Lop B: Task breakdown theo ROI va theo man hinh
- Nhom quick wins ROI cao len truoc
- Nhom refactor muc vua ra sau
- Moi task co allowed files, dependencies, DOD, machine checks

### Lop C: Test strategy
- Test tren mobile viewport
- Test thao tac tim kiem, scroll, them mon, cham cong, cong thuc
- Co baseline va smoke test sau moi task

### Lop D: Escalation rules
- BLOCK neu thay doi can sua backend hoac doi nghiep vu
- REVISE neu toi uu gay sai hanh vi UI
- PASS khi khong doi logic nghiep vu va co dau hieu giam re-render/jank ro rang

## 8. Dinh huong task sau nay
Blueprint nen tach thanh cac task rieng nhu sau:
1. Quick win cho search/filter va `filterTable`
2. Quick win cho POS cart va POS product render
3. Quick win cho mobile CSS va dashboard/chart
4. Quick win cho attendance + recipes
5. Refactor tiep theo neu van con bottleneck

## 9. Ket qua can co sau buoc nay
Sau khi cap nhat `goal.md` va `plan.md`, can co them `blueprint.md` voi:
- format parse duoc boi `build_tasks_from_blueprint.py`
- task breakdown du ro de khoi tao orchestrator
- uu tien da duoc dieu chinh theo feedback reviewer
