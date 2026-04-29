# Known Issues & Lessons Learned - QuanLyCF Mobile Perf Workflow

> Tai lieu nay ghi lai cac loi lap lai trong T001-T005 va cach xu ly chuan.
> Brain dung tai lieu nay de tranh lap lai false negative va scope nham o cac task tiep theo.

---

## Issue #1 - Machine checks FAIL vi Python quoting tren Windows

### Mo ta
Ban dau machine checks duoc viet theo kieu `python -c "..."` voi nested quotes. Tren Windows, kieu nay rat de vo quoting va tao:

```text
SyntaxError: unterminated string literal
```

Loi nay da xuat hien o T001 va T002, khien reviewer tiep tuc `REVISE` du code thuc te da dat DoD.

### Cach nhan biet
- `test_output.txt` hien `SyntaxError: unterminated string literal`
- Tat ca hoac gan nhu tat ca checks cung fail theo mot kieu cu phap
- Review noi DoD dung huong nhung khong co bang chung machine check pass

### Cach xu ly chuan
1. Xac nhan day la loi check, khong phai loi code.
2. Chay lai checks thu cong bang lenh an toan.
3. Neu checks pass, cap nhat `review.json` va `state.json` theo manual rescue.

### Phong tranh o cac task sau
- Khong viet checks theo kieu `python -c "..."` neu co nested quotes.
- Uu tien PowerShell-native checks don gian voi `Get-Content -Raw` va regex ro rang.
- Neu can tim chuoi co dau nhay kep, tranh pattern escape phuc tap neu co the viet pattern gian hon.

---

## Issue #2 - Cumulative diff bi reviewer hieu nham thanh scope creep

### Mo ta
Tu T003 tro di, reviewer nhin `git diff` tich luy cua ca workflow va thay cac file tu task truoc (`orders.html`, `products.html`, mot so block trong `app.html`). Neu khong doi chieu voi `coder_report.txt` va `allowed_files`, reviewer de ket luan nham rang task hien tai vuot scope.

### Cach nhan biet
- Reviewer noi task hien tai sua file ngoai `allowed_files`
- `coder_report.txt` cua chinh task do lai liet ke dung scope
- `state.json` cho thay task truoc da duoc rescue/pass nhung diff van con hien

### Cach xu ly chuan
1. Doc `coder_report.txt` cua task hien tai.
2. So sanh `FILES_CHANGED` voi `allowed_files` trong `tasks.json`.
3. Neu coder report dung scope, xem day la cumulative diff, khong phai scope creep that.
4. Manual rescue neu machine checks va DoD deu dat.

### Phong tranh o cac task sau
- Reviewer phai uu tien `coder_report.txt` de xac dinh scope task hien tai.
- Neu workflow khong commit sau moi task, luon coi `git diff` la cumulative diff.
- Khong BLOCK chi vi thay file cu trong diff neu chung thuoc task truoc da duoc xac nhan.

---

## Issue #3 - Reviewer BLOCK vi loi Brain CLI, khong phai loi code

### Mo ta
Lan chay dau cua T001 bi `BLOCK` ngay vi Brain/Reviewer CLI goi nham `claude` va loi infrastructure, khong phai do code.

### Cach nhan biet
- `orchestrator.log` co `Brain CLI error`
- `BLOCK` xuat hien ngay iteration dau
- Khong co noi dung review hop le de danh gia DoD

### Cach xu ly chuan
- Kiem tra `workflow_config.json`
- Xac nhan `brain_cli = codex.cmd`
- Smoke test `brain_cli_adapter.py` neu can
- Chay lai workflow sau khi fix config

### Phong tranh o cac task sau
- Luon kiem tra CLI reviewer truoc khi loop neu vua doi config workspace.
- Phan biet ro `model` va `cli executable`.

---

## Issue #4 - Coder timeout tren file lon

### Mo ta
T001 tung bi timeout do `app.html` lon va task mo ta qua rong.

### Cach nhan biet
- `orchestrator.log` co `Coder CLI timeout after ...`
- Khong co `coder_report.txt` hoan chinh cho iteration do

### Cach xu ly chuan
- Tang timeout neu can
- Hoac chia task nho hon
- Hoac chi dinh ro vung can doc/sua trong file lon

### Phong tranh o cac task sau
- Viet task description cu the hon
- Chi ro ham/section can sua, khong mo ta qua rong

---

## Issue #5 - PowerShell machine checks da tro thanh chuan moi

### Mo ta
Ban dau co mot giai doan `test_output.txt` xuat hien lenh PowerShell trong khi `tasks.json` van ghi checks theo Python, gay nham lan. Sau do workflow da duoc sua: checks trong `blueprint.md` va `tasks.json` da duoc chuyen sang PowerShell-native.

### He qua
Noi dung huong dan cu kieu "bo qua PowerShell checks va chay lai Python checks" khong con dung nua cho trang thai hien tai cua workflow.

### Cach xu ly chuan hien tai
- Coi PowerShell checks trong `tasks.json` la nguon su that
- Neu check fail, kiem tra xem la:
  - fail cu phap check
  - hay fail dung nghia vi code chua dat DoD
- Co the copy tung check trong `tasks.json` ra chay truc tiep de xac minh

### Phong tranh o cac task sau
- Giu mot kieu check thong nhat: PowerShell-native
- Khong tron Python-style check va PowerShell-style check trong cung workflow

---

## Issue #6 - Reviewer REVISE/BLOCK du T003-T004 da dat DoD

### Mo ta
Ca T003 va T004 deu co truong hop reviewer khong pass ngay du implementation thuc te da dat:
- T003 bi `BLOCK` vi reviewer hieu nham cumulative diff la scope creep va machine check bi danh gia sai
- T004 bi `REVISE` vi machine checks/reporting khong sach, trong khi code attendance/recipes da dat yeu cau

### Cach nhan biet
- Code thuc te o file muc tieu da dung
- Machine checks pass khi chay truc tiep
- `review.json` van noi ve diff ngoai scope hoac "chua co bang chung" du evidence da ton tai

### Cach xu ly chuan
1. Kiem tra truc tiep file muc tieu.
2. Chay lai tung machine check bang tay.
3. Doi chieu DoD voi code that.
4. Neu dat, cap nhat `state.json` va `review.json` bang manual rescue thay vi loop lai vo ich.

### Phong tranh o cac task sau
- Khi reviewer flag scope creep, luon doi chieu them `coder_report.txt`.
- Khi reviewer noi machine checks fail, copy chinh check tu `tasks.json` ra chay lai mot lan.
- Neu tat ca deu pass, uu tien rescue thay vi de orchestrator retry lap.

---

## Issue #7 - T005 cho thay khong phai moi "scope creep" deu la false positive

### Mo ta
Sau khi da gap nhieu lan reviewer hieu nham cumulative diff, den T005 xuat hien truong hop nguoc lai: reviewer flag `staff.html` va lan nay do la scope creep that. File nay khong nam trong `allowed_files` cua T005, va diff o `staff.html` la thay doi moi cho follow-up cache, khong phai di san tu task truoc.

### Cach nhan biet
- `git diff --name-only` co `src/pages/components/staff.html`
- `coder_report.txt` cua T005 cung tung de cap toi viec sua `staff.html`
- `allowed_files` cua T005 khong chua `staff.html`
- Machine check co the pass, nhung quality gate van phai fail vi vi pham pham vi task

### Cach xu ly chuan
1. Xac nhan file ngoai scope co that su bi sua trong task hien tai.
2. Neu dung, khong rescue ngay.
3. Loai bo thay doi ngoai scope truoc, sau do moi chay lai machine check.
4. Chi PASS sau khi diff da thu gon ve dung allowed files.

### Phong tranh o cac task sau
- Khong mac dinh moi flag ve scope creep deu la do cumulative diff.
- Luon doi chieu ca 3 nguon: `allowed_files`, `coder_report.txt`, va `git diff --name-only`.
- Neu file ngoai scope xuat hien trong ca coder report va git diff, coi do la scope creep that cho den khi chung minh duoc dieu nguoc lai.

---

## Issue #8 - Machine check `Success: False` co the do cach runner ghi ket qua, khong phai do check fail that

### Mo ta
O T005, `test_output.txt` ghi `Success: False` cho machine check mac du khi copy dung lenh check trong `tasks.json` ra chay truc tiep thi check pass. Truong hop nay cho thay runner/bao cao co the khong phan anh dung ket qua thuc te cua command.

### Cach nhan biet
- `test_output.txt` chi ghi `Success: False` nhung khong co thong diep `throw` hay loi check cu the
- Khi chay lai y nguyen command tu `tasks.json` trong dung working directory, command pass va in output expected
- Reviewer dua vao `Success: False` de block, trong khi khong co bang chung check logic that bai

### Cach xu ly chuan
1. Copy nguyen van machine check tu `tasks.json`.
2. Chay truc tiep trong dung workspace/working directory.
3. Neu command pass, uu tien ket qua chay truc tiep hon wrapper output.
4. Ghi ro trong `manual_rescue` rang failure nam o runner reporting, khong nam o logic check.

### Phong tranh o cac task sau
- Khi thay `Success: False` ma khong co error message ro rang, khong ket luan vọi la code fail.
- Luon re-run command goc truoc khi bat coder sua lai.

---

## Checklist truoc khi Brain escalate

| # | Cau hoi | Neu YES |
|---|---|---|
| 1 | `test_output.txt` co `SyntaxError: unterminated string literal` khong? | Loi quoting Windows, khong phai loi code |
| 2 | Checks trong `tasks.json` dang la PowerShell-native khong? | Chay lai truc tiep tung check PowerShell do |
| 3 | `coder_report.txt` co dung `allowed_files` khong? | Diff ngoai scope co the chi la cumulative |
| 4 | `orchestrator.log` co `Brain CLI error` khong? | Loi infrastructure, kiem tra CLI/config |
| 5 | Machine checks pass khi chay tay khong? | Co the manual rescue |
| 6 | DoD trong review da dat phan lon hoac toan bo khong? | Xem lai false negative truoc khi bat coder lam lai |
| 7 | Task hien tai co that su thay doi logic ngoai scope khong? | Neu co moi yeu cau revert; neu khong thi khong block oan |
| 8 | File ngoai scope co xuat hien trong ca `coder_report.txt` va `git diff --name-only` khong? | Scope creep that, khong duoc rescue bo qua |
| 9 | `Success: False` co kem loi check cu the khong? | Neu khong, chay lai lenh goc truoc khi ket luan fail |

---

## Ghi chu cho T005

- T005 la follow-up task, co the ket thuc voi thay doi toi thieu neu T001-T004 da giai quyet phan lon bottleneck.
- Reviewer khong nen ep phat sinh them refactor neu khong con bang chung lag ro rang.
- Neu T005 khong can thiet, co the PASS voi ghi chu rang quick wins da du.
- Neu T005 co thay doi them, phai giu scope rat chat. Follow-up task la noi de phat sinh "tien tay toi uu" nhat, nen canh bao scope creep can duoc ap dung nghiem hon cac task truoc.
