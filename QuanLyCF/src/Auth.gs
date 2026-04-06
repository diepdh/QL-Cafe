/**
 * Xử lý đăng nhập
 * @param {string} username
 * @param {string} password
 * @returns {Object} Token và thông tin user hoặc lỗi
 */
function login(username, password) {
  const users = getSheetData('USERS');
  // So sánh password plain text (convert cả 2 sang string để tránh lỗi kiểu Number từ Sheets)
  const user = users.find(u => String(u.username) === String(username) && String(u.password_hash) === String(password));
  
  if (!user) {
    return { error: 'Tên đăng nhập hoặc mật khẩu không chính xác' };
  }
  
  const token = Utilities.getUuid();
  const expiry = new Date().getTime() + 8 * 60 * 60 * 1000; // 8 giờ
  
  const sessionData = {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
    staff_id: user.staff_id,
    expiry: expiry
  };
  
  PropertiesService.getScriptProperties().setProperty('session_' + token, JSON.stringify(sessionData));
  
  return {
    success: true,
    token: token,
    user: {
      username: user.username,
      role: user.role,
      staff_id: user.staff_id
    }
  };
}

/**
 * Kiểm tra session token hợp lệ
 * @param {string} token
 * @returns {Object|null} Thông tin session hoặc null
 */
function validateSession(token) {
  if (!token) return null;
  
  const raw = PropertiesService.getScriptProperties().getProperty('session_' + token);
  if (!raw) return null;
  
  const session = JSON.parse(raw);
  const now = new Date().getTime();
  
  if (now > session.expiry) {
    PropertiesService.getScriptProperties().deleteProperty('session_' + token);
    return null;
  }
  
  return session;
}

/**
 * Đăng xuất
 * @param {string} token
 */
function logout(token) {
  if (token) {
    PropertiesService.getScriptProperties().deleteProperty('session_' + token);
  }
  return { success: true };
}

/**
 * Helper để kiểm tra quyền truy cập của user hiện tại (dùng trong các function khác)
 */
function getCurrentUser(token) {
  const session = validateSession(token);
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}
