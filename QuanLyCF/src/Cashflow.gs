/**
 * Lấy danh sách thu chi theo tháng
 * @param {string} token
 * @param {number} year
 * @param {number} month
 */
function getCashflow(token, year, month) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const all = getSheetData('CASHFLOW');
  const filtered = all.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === Number(year) && d.getMonth() + 1 === Number(month);
  });
  
  const totalIncome  = filtered.filter(r => r.type === 'income').reduce((s, r) => s + Number(r.amount), 0);
  const totalExpense = filtered.filter(r => r.type === 'expense').reduce((s, r) => s + Number(r.amount), 0);
  
  return { 
    data: filtered.sort((a, b) => new Date(b.date) - new Date(a.date)), 
    totalIncome, 
    totalExpense, 
    netCashflow: totalIncome - totalExpense 
  };
}

/**
 * Thêm khoản thu chi mới
 * @param {string} token
 * @param {Object} data
 */
function createCashflow(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const id = generateId('CF');
  // cashflow_id, type, category, amount, note, date
  appendRow('CASHFLOW', [
    id,
    data.type, // 'income' or 'expense'
    data.category,
    data.amount,
    data.note || '',
    data.date || Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd')
  ]);
  
  return { success: true, cashflow_id: id };
}

/**
 * Xóa khoản thu chi
 */
function deleteCashflow(token, id) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const sheet = getSheet('CASHFLOW');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('cashflow_id');
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy record' };
}
