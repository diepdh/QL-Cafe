/**
 * Lấy danh sách sản phẩm (kèm tên danh mục)
 */
function getProducts(token) {
  try {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
    
    const products = getSheetData('PRODUCTS') || [];
    const categories = getSheetData('CATEGORIES') || [];
    
    return products.map(p => {
      // Ép kiểu String() để so sánh chính xác
      const cat = categories.find(c => String(c.category_id) === String(p.category_id));
      return {
        ...p,
        category_name: cat ? cat.name : 'Chưa phân loại'
      };
    });
  } catch(e) {
    return { error: 'getProducts lỗi: ' + e.message };
  }
}

/**
 * Thêm sản phẩm mới
 */
function createProduct(token, data) {
  try {
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
  } catch(e) {
    return { error: 'createProduct lỗi: ' + e.message };
  }
}

/**
 * Cập nhật sản phẩm
 */
function updateProduct(token, productId, data) {
  try {
    const user = validateSession(token);
    if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
    
    const sheet = getSheet('PRODUCTS');
    const values = sheet.getDataRange().getValues();
    const headers = values[0];
    const idCol = headers.indexOf('product_id');
    
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][idCol]) === String(productId)) {
        if (data.name !== undefined) sheet.getRange(i + 1, headers.indexOf('name') + 1).setValue(data.name);
        if (data.category_id !== undefined) sheet.getRange(i + 1, headers.indexOf('category_id') + 1).setValue(data.category_id);
        if (data.price !== undefined) sheet.getRange(i + 1, headers.indexOf('price') + 1).setValue(data.price);
        if (data.image_url !== undefined) sheet.getRange(i + 1, headers.indexOf('image_url') + 1).setValue(data.image_url);
        if (data.status !== undefined) sheet.getRange(i + 1, headers.indexOf('status') + 1).setValue(data.status);
        return { success: true };
      }
    }
    return { error: 'Không tìm thấy sản phẩm' };
  } catch(e) {
    return { error: 'updateProduct lỗi: ' + e.message };
  }
}

/**
 * Lấy danh sách danh mục
 */
function getCategories(token) {
  try {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
    return getSheetData('CATEGORIES') || [];
  } catch(e) {
    return { error: 'getCategories lỗi: ' + e.message };
  }
}

/**
 * Thêm danh mục mới
 */
function createCategory(token, data) {
  try {
    const user = validateSession(token);
    if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'UNAUTHORIZED' };
    
    const id = generateId('CAT');
    appendRow('CATEGORIES', [id, data.name, data.sort_order || 0]);
    return { success: true, category_id: id };
  } catch(e) {
    return { error: 'createCategory lỗi: ' + e.message };
  }
}

/**
 * Lấy danh sách công thức (toàn bộ)
 */
function getRecipes(token) {
  try {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
    return getSheetData('RECIPES') || [];
  } catch(e) {
    return { error: 'getRecipes lỗi: ' + e.message };
  }
}

/**
 * Lấy công thức chi tiết của 1 sản phẩm
 */
function getRecipeByProduct(token, productId) {
  try {
    const user = validateSession(token);
    if (!user) return { error: 'UNAUTHORIZED' };
    
    const recipes = getSheetData('RECIPES') || [];
    const refined = getSheetData('REFINED_MATERIALS') || [];
    const raw = getSheetData('RAW_MATERIALS') || [];
    
    const productRecipe = recipes.filter(r => String(r.product_id) === String(productId));
    
    return productRecipe.map(r => {
      // DUAL-SCHEMA COMPATIBILITY: Hỗ trợ cả schema cũ (refined_id) và mới (material_type, material_id)
      const type = r.material_type || (r.refined_id ? 'refined' : (r.raw_material_id ? 'raw' : 'refined'));
      const matId = r.material_id || r.refined_id || r.raw_material_id;
      
      let mat = null;
      if (type === 'raw') {
        mat = raw.find(m => String(m.material_id) === String(matId));
      } else {
        mat = refined.find(m => String(m.refined_id) === String(matId));
      }

      return {
        ...r,
        material_type: type,
        material_id: matId,
        material_name: mat ? mat.name : 'N/A',
        unit: mat ? mat.unit : (r.unit || '')
      };
    });
  } catch(e) {
    return { error: 'getRecipeByProduct lỗi: ' + e.message };
  }
}

/**
 * Lưu công thức sản phẩm
 */
function saveRecipe(token, productId, ingredients) {
  try {
    const user = validateSession(token);
    if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
    
    const lock = LockService.getScriptLock();
    lock.tryLock(5000);
    
    try {
      const sheet = getSheet('RECIPES');
      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      
      // Đảm bảo schema mới: recipe_id, product_id, material_type, material_id, quantity, unit
      const newHeaders = ['recipe_id', 'product_id', 'material_type', 'material_id', 'quantity', 'unit'];
      const isOldSchema = !headers.includes('material_type');
      
      if (isOldSchema) {
        // SAFE MIGRATION: Nếu là old schema (legacy), thực hiện chuyển đổi toàn bộ row cũ sang cấu trúc mới
        // để tránh tình trạng chỉ đổi header làm lệch cột dữ liệu của các sản phẩm khác.
        const refinedIdIdx = headers.indexOf('refined_id');
        const rawMatIdIdx = headers.indexOf('raw_material_id');
        const recipeIdIdx = headers.indexOf('recipe_id');
        const productIdIdx = headers.indexOf('product_id');
        const qtyIdx = headers.indexOf('quantity');
        const unitIdx = headers.indexOf('unit');
        
        const migratedRows = [];
        for (let i = 1; i < values.length; i++) {
          const row = values[i];
          const matType = refinedIdIdx >= 0 && row[refinedIdIdx] ? 'refined' : (rawMatIdIdx >= 0 && row[rawMatIdIdx] ? 'raw' : 'refined');
          const matId = (refinedIdIdx >= 0 ? row[refinedIdIdx] : (rawMatIdIdx >= 0 ? row[rawMatIdIdx] : ''));
          
          migratedRows.push([
            row[recipeIdIdx],
            row[productIdIdx],
            matType,
            matId,
            row[qtyIdx],
            row[unitIdx]
          ]);
        }
        
        sheet.clearContents();
        sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        if (migratedRows.length > 0) {
          sheet.getRange(2, 1, migratedRows.length, newHeaders.length).setValues(migratedRows);
        }
      }

      // Đọc lại dữ liệu sau khi migrate (nếu có)
      const updatedValues = sheet.getDataRange().getValues();
      const updatedHeaders = updatedValues[0];
      const productIdCol = updatedHeaders.indexOf('product_id');
      
      // 1. Xóa công thức cũ của sản phẩm này
      for (let i = updatedValues.length - 1; i >= 1; i--) {
        if (String(updatedValues[i][productIdCol]) === String(productId)) {
          sheet.deleteRow(i + 1);
        }
      }
      
      // 2. Thêm công thức mới
      ingredients.forEach(ing => {
        const id = generateId('RCP');
        const row = new Array(newHeaders.length);
        row[updatedHeaders.indexOf('recipe_id')] = id;
        row[updatedHeaders.indexOf('product_id')] = productId;
        row[updatedHeaders.indexOf('material_type')] = ing.material_type || 'refined';
        row[updatedHeaders.indexOf('material_id')] = ing.material_id;
        row[updatedHeaders.indexOf('quantity')] = ing.quantity;
        row[updatedHeaders.indexOf('unit')] = ing.unit;
        
        sheet.appendRow(row);
      });
      
      return { success: true };
    } finally {
      lock.releaseLock();
    }
  } catch(e) {
    return { error: 'saveRecipe lỗi: ' + e.message };
  }
}
