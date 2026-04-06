/**
 * Lấy cấu hình hệ thống (dưới dạng Object)
 */
function getConfig(token) {
  const user = validateSession(token);
  if (!user || user.role !== 'admin') return { error: 'FORBIDDEN' };
  return getConfigAsObject();
}

/**
 * Cập nhật nhiều key cấu hình cùng lúc
 * @param {string} token
 * @param {Object} data - {key: value, ...}
 */
function updateConfig(token, data) {
  const user = validateSession(token);
  if (!user || user.role !== 'admin') return { error: 'FORBIDDEN' };
  
  const sheet = getSheet('CONFIG');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const keyCol = headers.indexOf('key');
  const valCol = headers.indexOf('value');
  
  for (let key in data) {
    let found = false;
    for (let i = 1; i < values.length; i++) {
      if (values[i][keyCol] === key) {
        sheet.getRange(i + 1, valCol + 1).setValue(data[key]);
        found = true;
        break;
      }
    }
    // Nếu key chưa tồn tại thì thêm mới
    if (!found) {
      sheet.appendRow([key, data[key]]);
    }
  }
  
  return { success: true };
}

/**
 * Lấy danh sách mã QR cho tất cả các bàn
 */
function getQrCodes(token) {
  const user = validateSession(token);
  if (!user || user.role !== 'admin') return { error: 'FORBIDDEN' };
  
  const config = getConfigAsObject();
  let appUrl = '';
  try {
    appUrl = ScriptApp.getService().getUrl();
  } catch(e) {
    // Fallback nếu đang chạy trong môi trường dev/local không lấy được URL
    appUrl = 'https://script.google.com/macros/s/AKfycb.../exec';
  }
  
  const tables = (config.tables || '').split(',').map(t => t.trim()).filter(Boolean);
  
  return {
    data: tables.map(table => {
      const menuUrl = `${appUrl}?page=menu&table=${encodeURIComponent(table)}`;
      return {
        table_code: table,
        menu_url: menuUrl,
        qr_image_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`
      };
    })
  };
}

/**
 * Helper: Đọc toàn bộ sheet CONFIG và chuyển thành Object
 */
function getConfigAsObject() {
  const data = getSheetData('CONFIG');
  const obj = {};
  data.forEach(row => { obj[row.key] = row.value; });
  return obj;
}
