const SPREADSHEET_ID = '1El4U6sCqolDR33A5o0_Z68IL8TOfBH09GQuK610SwUk';

/**
 * Lấy sheet theo tên
 * @param {string} sheetName 
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet(sheetName) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
}

/**
 * Lấy toàn bộ dữ liệu từ sheet và chuyển thành mảng object (headers làm key)
 * @param {string} sheetName 
 * @returns {Object[]}
 */
function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      // Workaround cho GAS V8: google.script.run sẽ lẳng lặng trả về null nếu gửi object có chứa Date native!
      if (val instanceof Date) {
        val = Utilities.formatDate(val, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm:ss');
      }
      obj[h] = val;
    });
    return obj;
  });
}

/**
 * Tạo ID ngẫu nhiên với tiền tố
 * @param {string} prefix - Ví dụ: PRD, ORD, STAFF
 * @returns {string} - Ví dụ: PRD-20260326-001
 */
function generateId(prefix) {
  const date = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return prefix + '-' + date + '-' + rand;
}

/**
 * Thêm một dòng mới vào sheet
 * @param {string} sheetName 
 * @param {any[]} rowData 
 */
function appendRow(sheetName, rowData) {
  const sheet = getSheet(sheetName);
  if (sheet) {
    sheet.appendRow(rowData);
  }
}

/**
 * Tìm dòng đầu tiên có giá trị trùng khớp ở một field cụ thể
 * @param {string} sheetName 
 * @param {string} fieldName 
 * @param {any} value 
 * @returns {Object|null}
 */
function findRowByField(sheetName, fieldName, value) {
  const data = getSheetData(sheetName);
  return data.find(row => row[fieldName] === value) || null;
}

function verifySheetSetup() {
  const required = [
    'CONFIG','USERS','STAFF','CATEGORIES','PRODUCTS',
    'RAW_MATERIALS','REFINED_MATERIALS','RECIPES',
    'ORDERS','ORDER_ITEMS','PROCUREMENT','SUPPLIERS',
    'PROCESSING_LOG','ATTENDANCE','CASHFLOW'
  ];
  
  const results = required.map(name => {
    const sheet = getSheet(name);
    const exists = !!sheet;
    const hasData = exists && sheet.getLastRow() >= 1;
    return { name, exists, hasData };
  });
  
  Logger.log(JSON.stringify(results, null, 2));
  
  // Kiểm tra USERS có admin chưa
  const users = getSheetData('USERS');
  Logger.log('USERS count: ' + users.length);
  Logger.log('Admin exists: ' + !!users.find(u => u.username === 'admin'));
  
  return results;
}
