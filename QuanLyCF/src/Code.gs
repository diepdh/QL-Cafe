/**
 * Router chính phục vụ web app
 * @param {Object} e - Event param
 * @returns {GoogleAppsScript.HTML.HtmlOutput | GoogleAppsScript.Content.TextOutput}
 */
function doGet(e) {
  const page = e.parameter.page || '';

  // Step 2: Diagnostic handler
  if (page === 'diagnostic') {
    const diagResult = runDiagnostic();
    return ContentService.createTextOutput(JSON.stringify(diagResult, null, 2))
                         .setMimeType(ContentService.MimeType.JSON);
  }

  if (page === 'menu') {
    // QR Menu công khai
    const template = HtmlService.createTemplateFromFile('pages/menu');
    template.tableCode = e.parameter.table || '';
    return template.evaluate()
      .setTitle('Menu — QuanLyCF')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Trang quản trị chính (Dashboard, v.v.)
  return HtmlService.createTemplateFromFile('pages/app')
    .evaluate()
    .setTitle('QuanLyCF — Hệ thống quản lý')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper để include file HTML trong trang chính (CSS, JS inline)
 * @param {string} filename 
 * @returns {string} 
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * [DIAGNOSTIC] Endpoint để kiểm tra deployment và API health
 * Truy cập: https://script.google.com/.../exec?page=diagnostic
 */
function runDiagnostic() {
  const results = { version: 'TASK_017', timestamp: new Date().toISOString() };
  try {
    // Spreadsheet ID từ BLUEPRINT/Utils.gs
    const ss = SpreadsheetApp.openById('1El4U6sCqolDR33A5o0_Z68IL8TOfBH09GQuK610SwUk');
    results.spreadsheet_access = 'OK';
    results.sheets = ss.getSheets().map(s => s.getName());
  } catch(e) {
    results.spreadsheet_access = 'FAILED: ' + e.message;
  }
  try {
    PropertiesService.getScriptProperties().setProperty('_diag_test', '1');
    results.properties_access = 'OK';
  } catch(e) {
    results.properties_access = 'FAILED: ' + e.message;
  }
  return results;
}
