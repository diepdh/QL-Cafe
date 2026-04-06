/**
 * Lấy danh sách sản phẩm (kèm tên danh mục)
 */
function getProducts(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const products = getSheetData('PRODUCTS');
  const categories = getSheetData('CATEGORIES');
  
  return products.map(p => {
    const cat = categories.find(c => c.category_id === p.category_id);
    return {
      ...p,
      category_name: cat ? cat.name : 'Chưa phân loại'
    };
  });
}

/**
 * Thêm sản phẩm mới
 */
function createProduct(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const id = generateId('PRD');
  const createdAt = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
  
  const row = [
    id,
    data.name,
    data.category_id,
    data.price,
    data.image_url || '',
    data.status || 'active',
    createdAt
  ];
  
  appendRow('PRODUCTS', row);
  return { success: true, product_id: id };
}

/**
 * Cập nhật sản phẩm
 */
function updateProduct(token, productId, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const sheet = getSheet('PRODUCTS');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('product_id');
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === productId) {
      // Cập nhật từng cột dựa trên data nhận được
      if (data.name !== undefined) sheet.getRange(i + 1, headers.indexOf('name') + 1).setValue(data.name);
      if (data.category_id !== undefined) sheet.getRange(i + 1, headers.indexOf('category_id') + 1).setValue(data.category_id);
      if (data.price !== undefined) sheet.getRange(i + 1, headers.indexOf('price') + 1).setValue(data.price);
      if (data.image_url !== undefined) sheet.getRange(i + 1, headers.indexOf('image_url') + 1).setValue(data.image_url);
      if (data.status !== undefined) sheet.getRange(i + 1, headers.indexOf('status') + 1).setValue(data.status);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy sản phẩm' };
}

/**
 * Lấy danh sách danh mục
 */
function getCategories(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return getSheetData('CATEGORIES');
}

/**
 * Thêm danh mục mới
 */
function createCategory(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
  
  const id = generateId('CAT');
  appendRow('CATEGORIES', [id, data.name, data.sort_order || 0]);
  return { success: true, category_id: id };
}

/**
 * Lấy danh sách công thức (toàn bộ)
 */
function getRecipes(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  return getSheetData('RECIPES');
}

/**
 * Lấy công thức chi tiết của 1 sản phẩm
 */
function getRecipeByProduct(token, productId) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const recipes = getSheetData('RECIPES');
  const refined = getSheetData('REFINED_MATERIALS');
  
  const productRecipe = recipes.filter(r => r.product_id === productId);
  
  return productRecipe.map(r => {
    const mat = refined.find(m => m.refined_id === r.refined_id);
    return {
      ...r,
      refined_name: mat ? mat.name : 'N/A'
    };
  });
}

/**
 * Lưu công thức sản phẩm
 * @param {string} token
 * @param {string} productId
 * @param {Object[]} ingredients - [{refined_id, quantity, unit}]
 */
function saveRecipe(token, productId, ingredients) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  
  try {
    const sheet = getSheet('RECIPES');
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const productIdCol = headers.indexOf('product_id');
    
    // 1. Xóa công thức cũ (xóa từ dưới lên)
    for (let i = values.length - 1; i >= 1; i--) {
      if (values[i][productIdCol] === productId) {
        sheet.deleteRow(i + 1);
      }
    }
    
    // 2. Thêm công thức mới
    ingredients.forEach(ing => {
      const id = generateId('RCP');
      sheet.appendRow([
        id,
        productId,
        ing.refined_id,
        ing.quantity,
        ing.unit
      ]);
    });
    
    return { success: true };
  } finally {
    lock.releaseLock();
  }
}
