/**
 * PUBLIC — Lấy danh sách menu (chỉ sản phẩm active)
 * Không cần token
 */
function getPublicMenu() {
  const products = getSheetData('PRODUCTS').filter(p => p.status === 'active');
  const categories = getSheetData('CATEGORIES').sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  
  return { products, categories };
}

/**
 * Tạo đơn hàng (Hỗ trợ cả QR và POS)
 * @param {string|null} token - Token nếu là POS
 * @param {Object} data - Dữ liệu đơn hàng
 */
function createOrder(token, data) {
  // 1. Validation: Nếu từ POS thì cần token hợp lệ
  if (data.source === 'pos') {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
  } else if (data.source !== 'qr') {
    return { error: 'Nguồn đơn hàng không hợp lệ' };
  }
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  
  try {
    const orderId = generateId('ORD');
    const createdAt = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    
    // 2. Ghi bảng ORDERS
    const orderRow = [
      orderId,
      data.table_code || '',
      data.source,
      'pending',
      data.payment_method || '',
      data.subtotal || 0,
      data.discount || 0,
      data.total || 0,
      data.staff_id || '',
      createdAt,
      ''
    ];
    
    appendRow('ORDERS', orderRow);
    
    // 3. Ghi bảng ORDER_ITEMS
    if (data.items && data.items.length > 0) {
      data.items.forEach(item => {
        const itemId = generateId('ITM');
        appendRow('ORDER_ITEMS', [
          itemId,
          orderId,
          item.product_id,
          item.quantity,
          item.note || ''
        ]);
      });
    } else {
      throw new Error('Đơn hàng không có sản phẩm');
    }
    
    return { success: true, order_id: orderId };
    
  } catch (err) {
    return { error: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Lấy danh sách đơn hàng (kèm chi tiết sản phẩm)
 * @param {string} token
 * @param {Object} filters - {date, status}
 */
function getOrders(token, filters = {}) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const orders = getSheetData('ORDERS');
  const orderItems = getSheetData('ORDER_ITEMS');
  const products = getSheetData('PRODUCTS');
  
  let filteredOrders = orders;
  
  // Áp dụng filter
  if (filters.status) {
    filteredOrders = filteredOrders.filter(o => o.status === filters.status);
  }
  if (filters.date) {
    filteredOrders = filteredOrders.filter(o => o.created_at.startsWith(filters.date));
  }
  
  return filteredOrders.map(o => {
    const items = orderItems.filter(i => i.order_id === o.order_id).map(i => {
      const prod = products.find(p => p.product_id === i.product_id);
      return {
        ...i,
        product_name: prod ? prod.name : 'N/A',
        price: prod ? prod.price : 0
      };
    });
    
    return {
      ...o,
      items: items
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Hoàn tất đơn hàng: Cập nhật trạng thái và trừ kho
 */
function completeOrder(token, orderId, paymentMethod) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  
  try {
    const sheet = getSheet('ORDERS');
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('order_id');
    const statusCol = headers.indexOf('status');
    const payCol = headers.indexOf('payment_method');
    const completedCol = headers.indexOf('completed_at');
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][idCol] === orderId) {
        if (values[i][statusCol] !== 'pending') {
          return { error: 'Chỉ có thể hoàn tất đơn hàng đang chờ (pending)' };
        }
        
        const now = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
        
        // Cập nhật thông tin đơn hàng
        sheet.getRange(i + 1, statusCol + 1).setValue('completed');
        sheet.getRange(i + 1, payCol + 1).setValue(paymentMethod || 'Tiền mặt');
        sheet.getRange(i + 1, completedCol + 1).setValue(now);
        
        // Gọi hàm trừ kho tự động (NVL tinh chế)
        deductStock(orderId);
        
        return { success: true };
      }
    }
    return { error: 'Không tìm thấy đơn hàng' };
  } catch (err) {
    return { error: err.message };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Hủy đơn hàng
 */
function cancelOrder(token, orderId) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const sheet = getSheet('ORDERS');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('order_id');
  const statusCol = headers.indexOf('status');
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === orderId) {
      if (values[i][statusCol] !== 'pending') {
        return { error: 'Chỉ có thể hủy đơn hàng đang chờ (pending)' };
      }
      sheet.getRange(i + 1, statusCol + 1).setValue('cancelled');
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy đơn hàng' };
}
