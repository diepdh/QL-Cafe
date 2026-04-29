# Feedback 2: Danh gia ma nguon va De xuat Toi uu Mobile Performance

Sau khi review ma nguon trong `src/pages/app.html` va cac component (`products.html`, `orders.html`, `reports.html`, `pos`), toi co cac nhan xet sau de hoan thien blueprint:

## 1. Diem nghen hien tai (Bottlenecks)

### 1.1. Render DOM kem hieu qua
- **innerHTML Everywhere**: App su dung `innerHTML` de render toan bo bang va danh sach moi khi co thay doi (vi du: them mon vao gio hang POS, load lai danh sach san pham). Tren mobile, viec destroy va rebuild DOM node lien tuc gay lag va ton pin.
- **Re-render toan bo**: Ham `renderPosCart` render lai tat ca item trong gio hang ngay ca khi chi thay doi so luong cua 1 mon.

### 1.2. Thieu Debounce trong Tim kiem/Loc
- **Oninput Search**: Ham `filterTable` va `filterPosProducts` chay ngay lap tuc tren moi phim bam (`oninput`). Voi danh sach san pham lon, viec query DOM (`getElementsByTagName('tr')`) va filter JS tren tung phim se gay tinh trang "typing lag".

### 1.3. Xu ly du lieu tren Frontend
- **Filter JS tren tap du lieu lon**: Viec filter toan bo danh sach `STATE.products` moi khi chon danh muc (trong `filterProductsByCategory`) co the cai thien bang cach cache ket qua filter hoac toi uu ham filter.

### 1.4. Chart.js & Graphics
- **Responsive Charts**: Biểu đồ trong Dashboard va Reports tu dong resize theo window. Tren mot so thiet bi mobile cu, viec tinh toan lai canvas khi scroll hoac xoay man hinh co the gay giat.

## 2. De xuat Patch (Priority-based)

### Nhom 1: Quick Wins (An toan cao, hieu qua tuc thi)
- **Implement Debounce**: Ap dung debounce (khoang 250-300ms) cho tat ca cac o input search/filter.
- **Toi uu CSS Mobile**:
  - Dung `will-change: transform` cho sidebar.
  - Giam box-shadow va border-radius phuc tap tren mobile.
  - Su dung `content-visibility: auto` cho cac row trong bang dai (neu trinh duyet ho tro).
- **DOM Fragment**: Thay vi `innerHTML +=`, hay build chuoi HTML mot lan hoac dung `DocumentFragment` de append vao DOM (hien tai da dung `.join('')` la kha tot nhung van co the toi uu hon).

### Nhom 2: Refactor tam trung (Cai thien trai nghiem)
- **Partial Update cho Giỏ hàng POS**: Chi cap nhat row cu the khi thay doi so luong thay vi render lai ca gio hang.
- **Lazy Loading cho Tab**: Chi trigger `loadDashboard()` hoac `loadReports()` khi tab thuc su duoc hien thi, khong load truoc (hien tai `navigateTo` dang lam tot viec nay).
- **Cache ket qua API**: Lưu trữ kết quả `getProducts` hoac `getCategories` vao `STATE` va chi fetch lai khi thuc su can thiet (TTL 5-10 phut).

### Nhom 3: Nang cao (Neu can thiet)
- **Virtual Scrolling**: Neu danh sach don hang hoac san pham vuot qua 100-200 item, can can nhac Virtual Scrolling de chi render cac row dang hien thi tren man hinh.
- **Web Worker cho Search**: Neu logic tim kiem phuc tap, co the chuyen vao worker (nhung voi app nay thi debounce la du).

## 3. Nhan xet ve Blueprint (Input cho Brain)

Blueprint tiep theo nen tap trung vao:
1. **Task 1**: Thu vien helper (Utils) cho Debounce va DOM manipulation.
2. **Task 2**: Toi uu UI POS (gio hang va tim kiem).
3. **Task 3**: Toi uu he thong Table (filter va render).
4. **Task 4**: Cai thien CSS performance va Responsive Grid.
5. **Task 5**: Logic Caching frontend de giam so lan goi `google.script.run`.

## 4. Rui ro can luu y
- **Google Apps Script latency**: Do tre cua `google.script.run` la khong the tranh khoi. Can co UI feedback (loading spinner) tot hon va dung cache de che giau do tre nay.
- **Conflict CSS**: Cac thay doi responsive can test ky tren ca iOS (Safari) va Android (Chrome).

---
*Nguoi thuc hien: Gemini CLI*
