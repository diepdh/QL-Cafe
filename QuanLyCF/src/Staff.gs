/**
 * Lấy danh sách nhân viên
 * @param {string} token
 */
function getStaff(token) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  return getSheetData('STAFF').sort((a, b) => a.full_name.localeCompare(b.full_name));
}

/**
 * Thêm nhân viên mới và tạo tài khoản mặc định
 * @param {string} token
 * @param {Object} data
 */
function createStaff(token, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const staff_id = generateId('STF');
  const staffRow = [
    staff_id,
    data.full_name,
    data.phone,
    data.email || '',
    data.position,
    data.start_date,
    data.hourly_rate || 0,
    'active'
  ];
  
  appendRow('STAFF', staffRow);
  
  // Tạo tài khoản mặc định
  const user_id = generateId('USR');
  const username = data.phone || data.email;
  // Role mapping: manager -> manager, còn lại -> cashier
  const role = data.position === 'manager' ? 'manager' : 'cashier';
  
  appendRow('USERS', [
    user_id,
    username,
    '123456', // Mật khẩu mặc định
    role,
    staff_id
  ]);
  
  return { 
    success: true, 
    staff_id, 
    username, 
    default_password: '123456' 
  };
}

/**
 * Cập nhật thông tin nhân viên
 * @param {string} token
 * @param {string} staff_id
 * @param {Object} data
 */
function updateStaff(token, staff_id, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const sheet = getSheet('STAFF');
  const headers = sheet.getDataRange().getValues()[0];
  const idCol = headers.indexOf('staff_id');
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === staff_id) {
      if (data.full_name !== undefined) sheet.getRange(i+1, headers.indexOf('full_name')+1).setValue(data.full_name);
      if (data.phone !== undefined) sheet.getRange(i+1, headers.indexOf('phone')+1).setValue(data.phone);
      if (data.email !== undefined) sheet.getRange(i+1, headers.indexOf('email')+1).setValue(data.email);
      if (data.position !== undefined) sheet.getRange(i+1, headers.indexOf('position')+1).setValue(data.position);
      if (data.start_date !== undefined) sheet.getRange(i+1, headers.indexOf('start_date')+1).setValue(data.start_date);
      if (data.hourly_rate !== undefined) sheet.getRange(i+1, headers.indexOf('hourly_rate')+1).setValue(data.hourly_rate);
      if (data.status !== undefined) sheet.getRange(i+1, headers.indexOf('status')+1).setValue(data.status);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy nhân viên' };
}

/**
 * Kiểm tra trạng thái chấm công hôm nay của nhân viên
 */
function getAttendanceStatus(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const records = getSheetData('ATTENDANCE');
  
  const todayRecord = records.find(r => 
    r.staff_id === user.staff_id && 
    Utilities.formatDate(new Date(r.date), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === today
  );
  
  if (!todayRecord) return { status: 'none' };
  if (!todayRecord.time_out) return { status: 'in_shift', record: todayRecord };
  return { status: 'done', record: todayRecord };
}

/**
 * Vào ca
 */
function clockIn(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const lock = LockService.getScriptLock();
  lock.tryLock(3000);
  
  try {
    // Re-check status TRONG lock để tránh race condition
    const status = getAttendanceStatus(token);
    if (status.status !== 'none') {
      return { warning: 'Bạn đã vào ca hôm nay rồi.' };
    }
    
    const now = new Date();
    const today = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    const id = generateId('ATT');
    
    // Xác định ca dựa theo giờ hiện tại
    const hour = now.getHours();
    let shift = 'morning';
    if (hour >= 13 && hour < 19) shift = 'afternoon';
    else if (hour >= 19) shift = 'evening';
    
    // attendance_id, staff_id, date, shift, time_in, time_out, hours_worked, note, edited_by
    appendRow('ATTENDANCE', [
      id, user.staff_id, today, shift, now.toISOString(), '', 0, '', ''
    ]);
    
    return { 
      success: true, 
      time_in: Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH:mm'),
      shift: shift 
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Ra ca
 */
function clockOut(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const today = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const sheet = getSheet('ATTENDANCE');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  const staffIdCol = headers.indexOf('staff_id');
  const dateCol = headers.indexOf('date');
  const timeInCol = headers.indexOf('time_in');
  const timeOutCol = headers.indexOf('time_out');
  const hoursCol = headers.indexOf('hours_worked');
  
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const rowDate = Utilities.formatDate(new Date(row[dateCol]), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    
    if (row[staffIdCol] === user.staff_id && rowDate === today && !row[timeOutCol]) {
      const now = new Date();
      const timeIn = new Date(row[timeInCol]);
      const hoursWorked = ((now - timeIn) / 3600000).toFixed(2);
      
      sheet.getRange(i+1, timeOutCol + 1).setValue(now.toISOString());
      sheet.getRange(i+1, hoursCol + 1).setValue(Number(hoursWorked));
      
      return { 
        success: true, 
        time_out: Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH:mm'),
        hours_worked: hoursWorked 
      };
    }
  }
  return { error: 'Không tìm thấy record vào ca hôm nay.' };
}

/**
 * Lấy danh sách chấm công theo tháng (Dành cho Quản lý)
 */
function getAttendanceByMonth(token, year, month) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const records = getSheetData('ATTENDANCE');
  const staff = getSheetData('STAFF');
  
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  
  return records.filter(r => {
    return Utilities.formatDate(new Date(r.date), 'Asia/Ho_Chi_Minh', 'yyyy-MM').startsWith(prefix);
  }).map(r => {
    const s = staff.find(x => x.staff_id === r.staff_id);
    return {
      ...r,
      staff_name: s ? s.full_name : 'N/A',
      hourly_rate: s ? s.hourly_rate : 0
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Sửa record chấm công
 */
function editAttendance(token, attendanceId, data) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const sheet = getSheet('ATTENDANCE');
  const headers = sheet.getDataRange().getValues()[0];
  const idCol = headers.indexOf('attendance_id');
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][idCol] === attendanceId) {
      if (data.time_in !== undefined) sheet.getRange(i+1, headers.indexOf('time_in')+1).setValue(data.time_in);
      if (data.time_out !== undefined) sheet.getRange(i+1, headers.indexOf('time_out')+1).setValue(data.time_out);
      if (data.hours_worked !== undefined) sheet.getRange(i+1, headers.indexOf('hours_worked')+1).setValue(data.hours_worked);
      if (data.note !== undefined) sheet.getRange(i+1, headers.indexOf('note')+1).setValue(data.note);
      sheet.getRange(i+1, headers.indexOf('edited_by')+1).setValue(user.username);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy record' };
}
