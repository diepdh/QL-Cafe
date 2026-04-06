/**
 * Lấy danh sách NVL Thô (kèm tên nhà cung cấp)
 */
function getRawMaterials(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const raw = getSheetData('RAW_MATERIALS');
  const suppliers = getSheetData('SUPPLIERS');
  
  return raw.map(m => {
    const sup = suppliers.find(s => s.supplier_id === m.supplier_id);
    return {
      ...m,
      supplier_name: sup ? sup.name : 'Chưa có NCC'
    };
  });
}

/**
 * Thêm NVL Thô mới
 */
function createRawMaterial(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const id = generateId('RAW');
  const row = [
    id,
    data.name,
    data.unit,
    data.stock_qty || 0,
    data.min_stock || 0,
    data.supplier_id || ''
  ];
  
  appendRow('RAW_MATERIALS', row);
  return { success: true, material_id: id };
}

/**
 * Cập nhật NVL Thô
 */
function updateRawMaterial(token, id, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const sheet = getSheet('RAW_MATERIALS');
  const headers = sheet.getDataRange().getValues()[0];
  const idCol = headers.indexOf('material_id');
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      if (data.name !== undefined) sheet.getRange(i+1, headers.indexOf('name')+1).setValue(data.name);
      if (data.unit !== undefined) sheet.getRange(i+1, headers.indexOf('unit')+1).setValue(data.unit);
      if (data.stock_qty !== undefined) sheet.getRange(i+1, headers.indexOf('stock_qty')+1).setValue(data.stock_qty);
      if (data.min_stock !== undefined) sheet.getRange(i+1, headers.indexOf('min_stock')+1).setValue(data.min_stock);
      if (data.supplier_id !== undefined) sheet.getRange(i+1, headers.indexOf('supplier_id')+1).setValue(data.supplier_id);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy NVL' };
}

/**
 * NVL Tinh Chế
 */
function getRefinedMaterials(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return getSheetData('REFINED_MATERIALS');
}

function createRefinedMaterial(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  const id = generateId('REF');
  appendRow('REFINED_MATERIALS', [id, data.name, data.unit, data.stock_qty || 0, data.min_stock || 0]);
  return { success: true, refined_id: id };
}

function updateRefinedMaterial(token, id, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const sheet = getSheet('REFINED_MATERIALS');
  const headers = sheet.getDataRange().getValues()[0];
  const idCol = headers.indexOf('refined_id');
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      if (data.name !== undefined) sheet.getRange(i+1, headers.indexOf('name')+1).setValue(data.name);
      if (data.unit !== undefined) sheet.getRange(i+1, headers.indexOf('unit')+1).setValue(data.unit);
      if (data.stock_qty !== undefined) sheet.getRange(i+1, headers.indexOf('stock_qty')+1).setValue(data.stock_qty);
      if (data.min_stock !== undefined) sheet.getRange(i+1, headers.indexOf('min_stock')+1).setValue(data.min_stock);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy NVL' };
}

/**
 * Nhà Cung Cấp
 */
function getSuppliers(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return getSheetData('SUPPLIERS');
}

function createSupplier(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  const id = generateId('SUP');
  appendRow('SUPPLIERS', [id, data.name, data.phone || '', data.note || '']);
  return { success: true, supplier_id: id };
}

/**
 * Nhập Hàng (Procurement)
 */
function getProcurements(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  const raw = getSheetData('RAW_MATERIALS');
  const suppliers = getSheetData('SUPPLIERS');
  const procs = getSheetData('PROCUREMENT');
  
  return procs.map(p => {
    const mat = raw.find(m => m.material_id === p.material_id);
    const sup = suppliers.find(s => s.supplier_id === p.supplier_id);
    return {
      ...p,
      material_name: mat ? mat.name : 'N/A',
      supplier_name: sup ? sup.name : 'N/A'
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function createProcurement(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const id = generateId('PCR');
  const dateStr = data.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  
  // 1. Ghi phiếu nhập
  appendRow('PROCUREMENT', [
    id, 
    data.material_id, 
    data.quantity, 
    data.unit_price, 
    data.supplier_id, 
    dateStr
  ]);
  
  // 2. Cập nhật tồn kho RAW_MATERIALS
  updateStockValue('RAW_MATERIALS', 'material_id', data.material_id, 'stock_qty', Number(data.quantity));
  
  // 3. Ghi log Thu Chi (CASHFLOW) - Tự động ghi nhận chi phí
  const cashId = generateId('CSH');
  appendRow('CASHFLOW', [
    cashId,
    'expense',
    'Nhập hàng',
    Number(data.quantity) * Number(data.unit_price),
    'Nhập hàng: ' + id,
    dateStr.split(' ')[0]
  ]);

  return { success: true, procurement_id: id };
}

function getProcurementInitData(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return {
    raw: getSheetData('RAW_MATERIALS'),
    sups: getSheetData('SUPPLIERS')
  };
}

/**
 * Lấy danh sách lịch sử sơ chế
 */
function getProcessingLogs(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const logs = getSheetData('PROCESSING_LOG');
  const raw = getSheetData('RAW_MATERIALS');
  const refined = getSheetData('REFINED_MATERIALS');
  const staff = getSheetData('STAFF');
  
  return logs.map(l => {
    const rawMat = raw.find(m => m.material_id === l.raw_material_id);
    const refMat = refined.find(m => m.refined_id === l.refined_id);
    const stf = staff.find(s => s.staff_id === l.staff_id);
    return {
      ...l,
      raw_name: rawMat ? rawMat.name : 'N/A',
      refined_name: refMat ? refMat.name : 'N/A',
      staff_name: stf ? stf.full_name : 'N/A'
    };
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Tạo phiếu sơ chế (NVL thô -> NVL tinh chế)
 */
function createProcessingLog(token, data) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  // 1. Kiểm tra tồn kho NVL thô
  const rawMats = getSheetData('RAW_MATERIALS');
  const rawMat = rawMats.find(m => m.material_id === data.raw_material_id);
  if (!rawMat) return { error: 'NVL thô không tồn tại' };
  if (Number(rawMat.stock_qty) < Number(data.raw_qty_used)) {
    return { error: `Không đủ tồn kho. Hiện có: ${rawMat.stock_qty} ${rawMat.unit}` };
  }
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    const createdAt = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
    const logId = generateId('LOG');
    
    // 2. Trừ tồn kho NVL thô
    updateStockValue('RAW_MATERIALS', 'material_id', data.raw_material_id, 'stock_qty', -Number(data.raw_qty_used));
    
    // 3. Cộng tồn kho NVL tinh chế
    updateStockValue('REFINED_MATERIALS', 'refined_id', data.refined_id, 'stock_qty', Number(data.refined_qty_produced));
    
    // 4. Ghi log sơ chế
    appendRow('PROCESSING_LOG', [
      logId,
      data.raw_material_id,
      data.raw_qty_used,
      data.refined_id,
      data.refined_qty_produced,
      user.staff_id,
      createdAt
    ]);
    
    return { success: true, log_id: logId };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Lấy dữ liệu khởi tạo cho form sơ chế
 */
function getProcessingInitData(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return {
    raw: getSheetData('RAW_MATERIALS'),
    refined: getSheetData('REFINED_MATERIALS')
  };
}

/**
 * Trừ tồn kho NVL tinh chế dựa trên công thức của các sản phẩm trong đơn hàng
 * @param {string} orderId
 */
function deductStock(orderId) {
  const orderItems = getSheetData('ORDER_ITEMS').filter(i => i.order_id === orderId);
  const recipes = getSheetData('RECIPES');
  
  orderItems.forEach(item => {
    // Lấy công thức của sản phẩm này
    const itemRecipes = recipes.filter(r => r.product_id === item.product_id);
    
    itemRecipes.forEach(r => {
      // Số lượng tiêu hao = định lượng trong recipe * số lượng món khách đặt
      const totalQty = Number(r.quantity) * Number(item.quantity);
      
      // Gọi helper để trừ kho (delta âm)
      updateStockValue('REFINED_MATERIALS', 'refined_id', r.refined_id, 'stock_qty', -totalQty);
    });
  });
}

/**
 * Helper cập nhật tồn kho (Cộng dồn)
 */
function updateStockValue(sheetName, idField, idValue, qtyField, delta) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf(idField);
  const qtyCol = headers.indexOf(qtyField);
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === idValue) {
      const current = Number(values[i][qtyCol]) || 0;
      sheet.getRange(i+1, qtyCol + 1).setValue(current + delta);
      return true;
    }
  }
  return false;
}
