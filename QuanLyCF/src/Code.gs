/**
 * Router chính phục vụ web app
 * @param {Object} e - Event param
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet(e) {
  const page = e.parameter.page || '';

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
