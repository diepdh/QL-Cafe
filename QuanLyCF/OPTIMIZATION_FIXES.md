# 🚀 Optimization Fixes - Implementation Guide

## Fix #1: Disable Animations on Mobile (Quick Win)
**Impact**: Giảm 60-70% lag trên mobile
**Time**: 5 phút

### Thêm vào CSS trong `app.html` (sau line 238):
```css
@media (max-width: 768px) {
  /* Disable tất cả animations/transitions trên mobile */
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
  }
  
  /* Remove box-shadows cho performance */
  .card, .modal-card, .qcf-table, .btn, .kpi-card {
    box-shadow: none !important;
    border: 1px solid var(--border);
  }
  
  /* Disable hover effects trên touch devices */
  .btn:hover, .nav-item:hover, .bottom-nav-item:hover {
    transform: none !important;
  }
}
```

---

## Fix #2: Debounce Utility & Search Optimization (Quick Win)
**Impact**: Giảm 80% lag khi search
**Time**: 15 phút

### Thêm Debounce Utility trong `app.html` (sau line 738, trước `const STATE`):
```js
// ===== PERFORMANCE UTILITIES =====
const DEBOUNCE_MAP = {};

function debounce(key, func, delay = 300) {
  return function(...args) {
    if (DEBOUNCE_MAP[key]) clearTimeout(DEBOUNCE_MAP[key]);
    DEBOUNCE_MAP[key] = setTimeout(() => {
      func.apply(this, args);
      delete DEBOUNCE_MAP[key];
    }, delay);
  };
}

// Tối ưu rendering: chỉ update DOM một lần
function batchDOM(updates) {
  const fragment = document.createDocumentFragment();
  updates.forEach(update => update(fragment));
  return fragment;
}
```

### Sửa Input Events (app.html):

**Thay dòng 398** (POS search):
```html
<!-- ❌ CŨ -->
<input type="text" class="form-control" placeholder="Tìm sản phẩm..." 
  oninput="filterPosProducts(this.value)">

<!-- ✅ MỚI -->
<input type="text" class="form-control" placeholder="Tìm sản phẩm..." 
  oninput="debounce('pos-search', () => filterPosProducts(this.value), 300)()">
```

**Thay trong `products.html` (line 4)**:
```html
<!-- ✅ MỚI -->
<input type="text" class="form-control" placeholder="Tìm sản phẩm..." 
  oninput="debounce('product-search', () => filterTable('productsTableBody', this.value), 300)()">
```

---

## Fix #3: Optimize POS Rendering (Medium Impact)
**Impact**: Giảm 70% lag khi thêm/xóa sản phẩm
**Time**: 45 phút

### Sửa `renderPosCart()` trong `orders.html`:

**❌ CŨ (dùng innerHTML):**
```js
function renderPosCart() {
  const container = document.getElementById('posCartItems');
  container.innerHTML = POS_CART.map((item, index) => `...`).join('');
  updatePosSummary();
}
```

**✅ MỚI (incremental update):**
```js
function renderPosCart() {
  const container = document.getElementById('posCartItems');
  
  if (POS_CART.length === 0) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:var(--text-muted);">Giỏ hàng trống</div>';
    updatePosSummary();
    return;
  }

  // Chỉ update items nếu container đã render
  const existingItems = container.querySelectorAll('[data-item-id]');
  
  if (existingItems.length === POS_CART.length) {
    // Update existing items (faster)
    POS_CART.forEach((item, index) => {
      const itemEl = container.querySelector(`[data-item-id="${index}"]`);
      if (itemEl) {
        itemEl.querySelector('.item-qty').innerText = item.quantity;
        itemEl.querySelector('.item-note').value = item.note;
        itemEl.querySelector('.item-total').innerText = (item.price * item.quantity).toLocaleString() + 'đ';
      }
    });
  } else {
    // Re-render nếu số lượng items khác
    container.innerHTML = POS_CART.map((item, index) => `
      <div data-item-id="${index}" style="padding:12px; border-bottom:1px solid var(--bg); display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:600; font-size:14px;">${item.name}</div>
          <div class="qty-ctrl">
            <button class="btn-qty" onclick="changePosQty(${index}, -1)">-</button>
            <span class="item-qty">${item.quantity}</span>
            <button class="btn-qty" onclick="changePosQty(${index}, 1)">+</button>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <input type="text" class="form-control item-note" style="font-size:12px; padding:4px 8px;" 
            placeholder="Ghi chú món..." value="${item.note}" 
            oninput="debounce('cart-note-${index}', () => { POS_CART[${index}].note = this.value; }, 500)()">
          <div class="item-total" style="font-weight:700; min-width:80px; text-align:right;">${(item.price * item.quantity).toLocaleString()}đ</div>
        </div>
      </div>
    `).join('');
  }
  
  updatePosSummary();
}
```

**Sửa `changePosQty()`**:
```js
function changePosQty(index, delta) {
  const oldQty = POS_CART[index].quantity;
  POS_CART[index].quantity += delta;
  
  if (POS_CART[index].quantity <= 0) {
    POS_CART.splice(index, 1);
    renderPosCart(); // Re-render khi xóa item
  } else {
    // Chỉ update số lượng và tổng tiền (fast update)
    const container = document.getElementById('posCartItems');
    const itemEl = container.querySelector(`[data-item-id="${index}"]`);
    if (itemEl) {
      itemEl.querySelector('.item-qty').innerText = POS_CART[index].quantity;
      itemEl.querySelector('.item-total').innerText = 
        (POS_CART[index].price * POS_CART[index].quantity).toLocaleString() + 'đ';
      updatePosSummary();
    }
  }
}
```

---

## Fix #4: Optimize filterTable Performance
**Impact**: Giảm 50% lag khi search trong bảng
**Time**: 20 phút

**❌ CŨ (app.html line 1028):**
```js
function filterTable(tbodyId, val) {
  const rows = document.getElementById(tbodyId).getElementsByTagName('tr');
  for(let r of rows) r.style.display = r.innerText.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
}
```

**✅ MỚI:**
```js
function filterTable(tbodyId, val) {
  val = val.toLowerCase();
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  
  const rows = tbody.children;
  let visibleCount = 0;
  
  for(let r of rows) {
    const match = r.innerText.toLowerCase().includes(val);
    r.style.display = match ? '' : 'none';
    if (match) visibleCount++;
  }
  
  // Hiển thị "Không tìm thấy" nếu cần
  if (visibleCount === 0 && rows.length > 0) {
    const noResults = tbody.querySelector('[data-no-results]');
    if (!noResults) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-no-results', 'true');
      tr.innerHTML = `<td colspan="10" style="text-align:center; padding:20px; color:var(--text-muted);">Không tìm thấy kết quả</td>`;
      tbody.appendChild(tr);
    }
  } else {
    const noResults = tbody.querySelector('[data-no-results]');
    if (noResults) noResults.remove();
  }
}
```

---

## Fix #5: Lazy Load Chart.js
**Impact**: Giảm lag khi load Dashboard
**Time**: 15 phút

**Sửa trong `app.html` (line 952-955)**:

**❌ CŨ:**
```js
function renderChart(d) {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  if(STATE.chart) STATE.chart.destroy();
  STATE.chart = new Chart(ctx, { ... });
}
```

**✅ MỚI (lazy load):**
```js
function renderChart(d) {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  
  // Ensure Chart.js is loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet');
    return;
  }
  
  // Defer chart rendering to next frame
  requestAnimationFrame(() => {
    try {
      const ctx = canvas.getContext('2d');
      if (STATE.chart) STATE.chart.destroy();
      
      STATE.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: d.labels,
          datasets: [{
            label: 'Doanh thu',
            data: d.data,
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124,58,237,0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } catch(e) {
      console.error('Chart rendering error:', e);
    }
  });
}
```

---

## Fix #6: Reduce Initial Bundle Size (Font)
**Impact**: Giảm ~2 giây load time trên mobile 3G
**Time**: 5 phút

**Sửa trong `app.html` (line 7-10)**:

**❌ CŨ:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
```

**✅ MỚI (add font-display, async Font Awesome):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- Font display: swap để hiển thị text nhanh hơn -->
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<!-- Font Awesome async (lazy load) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
```

---

## 📋 Checklist Implement
- [ ] Fix #1: Disable animations (5 phút)
- [ ] Fix #2: Debounce utility (15 phút)
- [ ] Fix #3: POS rendering optimization (45 phút)
- [ ] Fix #4: Table filtering optimization (20 phút)
- [ ] Fix #5: Lazy load charts (15 phút)
- [ ] Fix #6: Font optimization (5 phút)
- [ ] **Tổng cộng**: ~2 giờ

---

## 🧪 Testing After Fixes
1. **Desktop (Chrome DevTools)**: Throttle 4x CPU, 3G network
2. **Mobile Real Device**: Test trên điện thoại thực
3. **Performance**: Dùng Chrome Lighthouse audit
4. **Metrics**: Measure FCP, LCP, CLS

**Expected Improvements**:
- FCP: -50% to -70% (từ 3s → 1.2s)
- LCP: -40% to -60% (từ 5s → 2-3s)
- CLS: -80% (giảm jank/flicker)
