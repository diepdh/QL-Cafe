# Blueprint: QuanLyCF Mobile Performance

## Final Goal
Toi uu trai nghiem mobile cua `QuanLyCF` ma khong thay doi nghiep vu quan ly hien tai. Uu tien giam lag o cac man hinh dung nhieu nhat theo thu tu: POS, Dashboard, San pham/cac bang tim kiem, Cham cong, Cong thuc. Ket qua mong muon la cac thao tac tren dien thoai muot hon, phan hoi nhanh hon, va cac thay doi duoc chia thanh task nho de orchestrator co the thuc thi va review an toan.

## Global Guardrails
- Khong thay doi logic nghiep vu cua POS, don hang, cham cong, cong thuc, bao cao.
- Khong sua backend `.gs` neu chua co bang chung ro rang rang backend la bottleneck.
- Moi task chi duoc sua file nam trong `Allowed Files`.
- Uu tien quick wins ROI cao, rui ro thap truoc; refactor sau.
- Khong dua claim hieu nang manh neu chua co cach test hoac dau hieu xac minh ro.
- Mọi thay doi UI phai hoat dong tren mobile viewport ma khong lam hong desktop.
- Neu thay doi mot hotspot co nguy co doi hanh vi, phai co duong rollback don gian.

## Escalation Conditions
- BLOCK neu task can thay doi schema Sheets, API contract, hoac logic nghiep vu backend.
- BLOCK neu task phat hien bottleneck chinh nam o `google.script.run`/Apps Script va can sua `.gs`.
- REVISE neu toi uu lam sai hanh vi hien tai cua POS, attendance, recipes, hoac dashboard.
- REVISE neu task khong dat smoke test tren mobile viewport.
- PASS khi thay doi giu nguyen logic nghiep vu va giam duoc re-render, forced layout, hoac blocking UI trong hotspot muc tieu.

## Problem Statement
App `QuanLyCF` dang bi lag tren dien thoai khi nguoi dung thao tac o cac man hinh nghiep vu chinh. Cac dau hieu no ro nhat la search/filter cham, gio hang POS phan hoi tre, dashboard co the giat khi render, thao tac cham cong dung `prompt()` block UI, va man hinh cong thuc co nguy co reflow nhieu khi them nhieu nguyen lieu.

## Confirmed Hotspots
- `src/pages/app.html`: `filterTable()` dang dung `row.innerText` trong loop tren moi keystroke.
- `src/pages/components/orders.html`: POS products search chua debounce; POS cart full re-render khi doi quantity.
- `src/pages/app.html`: dashboard render chart truc tiep, khong co guard/defer.
- `src/pages/components/attendance.html`: sua bang cong dang dung `prompt()`.
- `src/pages/components/recipes.html`: render nhieu dong ingredient bang `appendChild()` trong loop.

## Prioritization By Screen
1. POS
2. Dashboard
3. San pham va cac bang tim kiem
4. Cham cong
5. Cong thuc

## Test Strategy
- Test tren mobile viewport trong DevTools: 375px width va CPU throttle.
- Smoke test POS: tim san pham, them mon, tang/giam quantity, sua note, tao don.
- Smoke test Dashboard: mo dashboard, render KPI, render chart, chuyen tab qua lai.
- Smoke test Search/Table: go nhanh vao cac o tim kiem va xac nhan khong giat man hinh.
- Smoke test Attendance: vao/ra ca, mo sua bang cong, luu thay doi.
- Smoke test Recipes: mo cong thuc san pham, them nhieu dong nguyen lieu, luu cong thuc.

## Task Breakdown

### T001: Optimize shared search and table filtering for mobile
**Objective:** Loai bo hotspot co ROI cao nhat: `filterTable()` dung `innerText` trong loop, dong thoi them debounce cho cac input tim kiem/loc dung chung de giam forced layout va render storm tren mobile.

**Allowed Files:**
- `src/pages/app.html`
- `src/pages/components/products.html`

**Definition of Done:**
- [ ] `filterTable()` khong con dua vao `row.innerText` moi lan go phim; thay vao do su dung token tim kiem co the tai su dung duoc, nhu `data-search`.
- [ ] `filterTable()` doc token tim kiem tu row metadata on dinh, khong ep browser layout lai bang `innerText` trong vong lap filter.
- [ ] Cac o tim kiem bang du lieu chinh duoc debounce hoac co co che giam tan suat filter, toi thieu tren products va cac bang dung `filterTable()`.
- [ ] Hanh vi tim kiem van dung ket qua nhu truoc doi voi products/raw/refined/suppliers/procurement/staff.
- [ ] Neu them helper nhu `debouncedFilterTable`, helper do phai duoc dung thuc te boi input tim kiem chinh, khong chi duoc khai bao nhung khong duoc gan vao UI.
- [ ] Khong co thay doi nghiep vu hay giao dien bi vo tren desktop/mobile.

**Machine Checks:**
- `$p='QuanLyCF/src/pages/app.html'; $t=Get-Content -Raw $p; $start=$t.IndexOf('function filterTable'); $end=$t.IndexOf('function handleLogout'); if($start -lt 0 -or $end -lt 0){ throw 'filterTable section not found' }; $body=$t.Substring($start, $end-$start); if($body -notmatch 'function filterTable'){ throw 'missing filterTable' }; if($t -notmatch 'data-search'){ throw 'missing data-search' }; if($body -match 'innerText'){ throw 'innerText still present in filterTable' }`
- `$p='QuanLyCF/src/pages/app.html'; $t=Get-Content -Raw $p; if($t -notmatch 'function debouncedFilterTable'){ throw 'missing debouncedFilterTable' }`
- `$p='QuanLyCF/src/pages/components/products.html'; $t=Get-Content -Raw $p; if($t -notmatch 'debouncedFilterTable\('){ throw 'products search is not debounced' }`

**Dependencies:** None
**Estimated Time:** 45-60 min

### T002: Optimize POS search and cart rendering
**Objective:** Giam lag o man hinh su dung nhieu nhat bang cach debounce search POS, giam full re-render khong can thiet trong gio hang, va giu nguyen chinh xac nghiep vu khi them/sua mon.

**Allowed Files:**
- `src/pages/app.html`
- `src/pages/components/orders.html`

**Definition of Done:**
- [ ] Search POS khong con render lai day dac theo moi keystroke; co debounce hoac co che giam tan suat update.
- [ ] Input search POS trong `app.html` phai gan vao helper debounce hoac co co che equivalent, khong duoc giu cach goi truc tiep gay render storm.
- [ ] Thao tac tang/giam so luong trong gio hang khong full re-render toan bo cart khi khong can thiet; fast path phai cap nhat dung item dang doi.
- [ ] Note mon trong gio hang van duoc luu dung vao `POS_CART`.
- [ ] Click vao product card van them dung san pham sau toi uu.
- [ ] Tao don POS van gui du lieu dung nhu truoc.

**Machine Checks:**
- `$p='QuanLyCF/src/pages/app.html'; $t=Get-Content -Raw $p; if($t -match 'oninput="filterPosProducts\\(this.value\\)"'){ throw 'POS search still calls filterPosProducts directly' }`
- `$p='QuanLyCF/src/pages/components/orders.html'; $t=Get-Content -Raw $p; foreach($needle in @('function renderPosCart','function changePosQty','function filterPosProducts')){ if($t -notmatch [regex]::Escape($needle)){ throw \"missing $needle\" } }`
- `$p='QuanLyCF/src/pages/components/orders.html'; $t=Get-Content -Raw $p; $start=$t.IndexOf('function changePosQty'); $end=$t.IndexOf('function updatePosSummary'); if($start -lt 0 -or $end -lt 0){ throw 'changePosQty section not found' }; $body=$t.Substring($start, $end-$start); $matches=[regex]::Matches($body,'renderPosCart\(').Count; if($matches -gt 1){ throw 'changePosQty re-renders cart too often' }`

**Dependencies:** T001
**Estimated Time:** 60-90 min

### T003: Reduce mobile paint/render cost for dashboard and shared UI shell
**Objective:** Giam chi phi paint/composite va jank tren mobile bang cach toi uu CSS mobile, giam chi phi chart render, va giu dashboard phan hoi tot hon tren thiet bi yeu.

**Allowed Files:**
- `src/pages/app.html`

**Definition of Done:**
- [ ] Co lop toi uu mobile cho animation/transition/shadow o cac khu vuc update nhieu.
- [ ] `renderChart()` co guard an toan va co defer hop ly de tranh block frame chinh khi mo dashboard.
- [ ] Thay doi dashboard shell/mobile CSS phai nam trong `app.html`, khong duoc dan den thay doi logic nghiep vu.
- [ ] Dashboard van hien KPI va chart dung du lieu.
- [ ] Khong co loi JS moi khi di chuyen qua dashboard tren mobile.

**Machine Checks:**
- `$p='QuanLyCF/src/pages/app.html'; $t=Get-Content -Raw $p; $start=$t.IndexOf('function renderChart'); $end=$t.IndexOf('// --- RAW MATERIALS ---'); if($start -lt 0 -or $end -lt 0){ throw 'renderChart section not found' }; $body=$t.Substring($start, $end-$start); if($body -notmatch 'function renderChart'){ throw 'missing renderChart' }; if($body -notmatch 'requestAnimationFrame|setTimeout'){ throw 'missing defer in renderChart' }; if($body -notmatch 'typeof Chart|if \\(!canvas'){ throw 'missing renderChart guard' }`
- `$p='QuanLyCF/src/pages/app.html'; $t=Get-Content -Raw $p; if($t -notmatch '@media\\s*\\(max-width:\\s*768px\\)'){ throw 'missing mobile CSS block' }`

**Dependencies:** None
**Estimated Time:** 45-60 min

### T004: Remove blocking mobile interactions in attendance and reduce recipe reflows
**Objective:** Xu ly hai hotspot bi bo sot nhung de sua: bo `prompt()` block thread trong attendance bang UI phu hop, va gop DOM updates trong recipes de giam reflow khi co nhieu ingredient.

**Allowed Files:**
- `src/pages/app.html`
- `src/pages/components/attendance.html`
- `src/pages/components/recipes.html`

**Definition of Done:**
- [ ] Sua bang cong khong con dung `prompt()`; thay bang modal hoac form UI khong block JS thread.
- [ ] Luong sua attendance van goi `editAttendance()` dung du lieu va reload lai lich su sau khi luu.
- [ ] Render nhieu ingredient rows trong recipes khong con `appendChild()` theo kieu gay nhieu reflow; co co che batch DOM nhu `DocumentFragment`.
- [ ] Neu can them modal cho attendance, markup/modal state phai duoc them trong `app.html` hoac file hop le ma khong lam hong man hinh khac.
- [ ] Luu cong thuc van hoat dong dung sau toi uu.

**Machine Checks:**
- `$p='QuanLyCF/src/pages/components/attendance.html'; $t=Get-Content -Raw $p; if($t -match 'prompt\\('){ throw 'prompt still present in attendance' }`
- `$p='QuanLyCF/src/pages/components/attendance.html'; $t=Get-Content -Raw $p; if($t -notmatch 'editAttendance\\('){ throw 'editAttendance flow missing' }; if($t -match 'prompt\\('){ throw 'prompt still present in attendance' }`
- `$p='QuanLyCF/src/pages/components/recipes.html'; $t=Get-Content -Raw $p; if($t -notmatch 'DocumentFragment|createDocumentFragment'){ throw 'missing DocumentFragment optimization in recipes' }`

**Dependencies:** None
**Estimated Time:** 60-90 min

### T005: Add low-risk caching and follow-up mobile polish only if bottlenecks remain
**Objective:** Sau khi hoan thanh quick wins, chi tiep tuc voi cac refactor muc vua neu van con lag ro rang tren mobile, nhu cache data tab hoac polish them cho tim kiem/render.

**Allowed Files:**
- `src/pages/app.html`
- `src/pages/components/orders.html`
- `src/pages/components/products.html`
- `src/pages/components/attendance.html`
- `src/pages/components/recipes.html`

**Definition of Done:**
- [ ] Chi thuc hien thay doi tiep theo neu sau T001-T004 van con bottleneck ro rang.
- [ ] Neu cache data duoc them, khong gay stale state nguy hiem cho nghiep vu.
- [ ] Moi thay doi tiep theo duoc gioi han trong pham vi mobile performance, khong mo rong tinh nang.
- [ ] Co ghi chu ro neu task nay khong can lam sau khi quick wins da du; task nay duoc phep ket thuc voi thay doi toi thieu neu reviewer xac nhan khong con bottleneck lon.

**Machine Checks:**
- `$paths=@('QuanLyCF/src/pages/app.html','QuanLyCF/src/pages/components/orders.html','QuanLyCF/src/pages/components/products.html','QuanLyCF/src/pages/components/attendance.html','QuanLyCF/src/pages/components/recipes.html'); foreach($p in $paths){ if(-not (Test-Path $p)){ throw \"missing path: $p\" } }; Write-Output 'Follow-up task requires reviewer confirmation based on prior task outputs'`

**Dependencies:** T001, T002, T003, T004
**Estimated Time:** 45-90 min
