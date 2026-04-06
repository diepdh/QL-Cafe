/**
 * Lấy dữ liệu tổng quan cho Dashboard
 * @param {string} token - Session token
 * @returns {Object} Dữ liệu Dashboard
 */
function getDashboardData(token) {
  const user = validateSession(token);
  if (!user) return { error: 'UNAUTHORIZED' };
  
  const now = new Date();
  const todayStr = Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const orders = getSheetData('ORDERS');
  const products = getSheetData('PRODUCTS');
  const rawMaterials = getSheetData('RAW_MATERIALS');
  const refinedMaterials = getSheetData('REFINED_MATERIALS');
  
  // Lấy ngày đầu tuần (Thứ 2)
  const firstDayOfWeek = new Date(now);
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  firstDayOfWeek.setDate(diff);
  firstDayOfWeek.setHours(0,0,0,0);
  
  // Lấy ngày đầu tháng
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Chỉ số hôm nay (Lọc theo completed_at - FIX 1)
  const completedOrders = orders.filter(o => o.status === 'completed' && o.completed_at);
  
  const todayOrders = completedOrders.filter(o => 
    Utilities.formatDate(new Date(o.completed_at), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === todayStr
  );
  
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const todayOrderCount = todayOrders.length;
  
  // 2. Thống kê tuần/tháng (FIX 2)
  const weekRevenue = completedOrders
    .filter(o => new Date(o.completed_at) >= firstDayOfWeek)
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    
  const monthOrders = completedOrders.filter(o => new Date(o.completed_at) >= firstDayOfMonth);
  const monthRevenue = monthOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const monthOrderCount = monthOrders.length;
  
  // 3. Cảnh báo tồn kho
  const lowStockCount = [
    ...rawMaterials.filter(m => Number(m.stock_qty) <= Number(m.min_stock)),
    ...refinedMaterials.filter(m => Number(m.stock_qty) <= Number(m.min_stock))
  ].length;
  
  // 4. Đơn hàng gần đây (FIX 3)
  const recentOrders = orders
    .filter(o => o.status === 'completed' || o.status === 'pending')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);
  
  return {
    kpis: {
      revenueToday: todayRevenue,
      orderCountToday: todayOrderCount,
      lowStockCount: lowStockCount,
      activeProducts: products.filter(p => p.status === 'active').length
    },
    stats: {
      weekRevenue,
      monthRevenue,
      monthOrderCount,
      debt: 0 // Tạm thời 0 theo yêu cầu
    },
    chart: getRevenueLast7Days(orders),
    recentOrders: recentOrders
  };
}

/**
 * Tính doanh thu 7 ngày gần nhất (Dựa trên completed_at)
 */
function getRevenueLast7Days(orders) {
  const result = { labels: [], data: [] };
  const today = new Date();
  const completedOrders = orders.filter(o => o.status === 'completed' && o.completed_at);
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    const label = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'dd/MM');
    
    const dayRevenue = completedOrders
      .filter(o => Utilities.formatDate(new Date(o.completed_at), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') === dateStr)
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      
    result.labels.push(label);
    result.data.push(dayRevenue);
  }
  return result;
}

/**
 * Báo cáo doanh thu chi tiết theo khoảng ngày
 */
function getRevenueReport(token, dateFrom, dateTo) {
  const user = validateSession(token);
  if (!user || !['admin', 'manager'].includes(user.role)) return { error: 'FORBIDDEN' };
  
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  to.setHours(23, 59, 59);
  
  const orders = getSheetData('ORDERS').filter(o => {
    if (o.status !== 'completed' || !o.completed_at) return false;
    const d = new Date(o.completed_at);
    return d >= from && d <= to;
  });
  
  const orderItems = getSheetData('ORDER_ITEMS');
  const products = getSheetData('PRODUCTS');
  const procLogs = getSheetData('PROCESSING_LOG');
  const rawMaterials = getSheetData('RAW_MATERIALS');
  
  // Top Sản Phẩm (Tái sử dụng ORDER_ITEMS + PRODUCTS)
  const productSales = {};
  orders.forEach(o => {
    orderItems.filter(i => i.order_id === o.order_id).forEach(i => {
      if (!productSales[i.product_id]) productSales[i.product_id] = { qty: 0, revenue: 0 };
      const prod = products.find(p => p.product_id === i.product_id);
      productSales[i.product_id].qty += Number(i.quantity);
      productSales[i.product_id].revenue += Number(i.quantity) * Number(prod ? prod.price : 0);
      productSales[i.product_id].name = prod ? prod.name : i.product_id;
    });
  });
  
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
    
  // NVL tiêu thụ (từ PROCESSING_LOG trong kỳ)
  const materialUsage = {};
  procLogs.forEach(l => {
    const d = new Date(l.created_at);
    if (d >= from && d <= to) {
      if (!materialUsage[l.raw_material_id]) {
        const mat = rawMaterials.find(m => m.material_id === l.raw_material_id);
        materialUsage[l.raw_material_id] = { name: mat ? mat.name : l.raw_material_id, qty: 0, unit: mat ? mat.unit : '' };
      }
      materialUsage[l.raw_material_id].qty += Number(l.raw_qty_used);
    }
  });

  const totalRevenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  
  // Gom dữ liệu biểu đồ (doanh thu theo ngày)
  const chartData = {};
  orders.forEach(o => {
    const dayKey = Utilities.formatDate(new Date(o.completed_at), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    chartData[dayKey] = (chartData[dayKey] || 0) + Number(o.total);
  });

  // Sắp xếp theo ngày (key yyyy-MM-dd)
  const sortedEntries = Object.entries(chartData).sort((a, b) => a[0].localeCompare(b[0]));

  return {
    kpis: {
      totalRevenue,
      orderCount: orders.length,
      avgOrderValue: orders.length ? (totalRevenue / orders.length).toFixed(0) : 0,
      estimatedProfit: (totalRevenue * 0.4).toFixed(0)
    },
    chart: {
      labels: sortedEntries.map(e => {
        const parts = e[0].split('-');
        return `${parts[2]}/${parts[1]}`; // dd/MM
      }),
      data: sortedEntries.map(e => e[1])
    },
    topProducts,
    materialUsage: Object.values(materialUsage)
  };
}
