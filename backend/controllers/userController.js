const { User, Order, Product, sequelize } = require('../models');

// GET /api/users (admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt','DESC']] });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/users/:id (admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    await user.update({ role: req.body.role });
    const { password: _, ...safe } = user.toJSON();
    res.json({ success: true, user: safe });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/users/:id (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin.' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/users/stats (admin dashboard)
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrdersData, recentOrders] = await Promise.all([
      User.count(),
      Product.count(),
      Order.findAll({ attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('totalPrice')), 'revenue']], group: ['status'], raw: true }),
      Order.findAll({ limit: 8, order: [['createdAt','DESC']], include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] }),
    ]);
    const totalOrders = totalOrdersData.reduce((s, r) => s + parseInt(r.count), 0);
    const totalRevenue = totalOrdersData.reduce((s, r) => s + parseFloat(r.revenue || 0), 0);
    const pendingOrders = totalOrdersData.find(r => r.status === 'Pending')?.count || 0;
    const deliveredOrders = totalOrdersData.find(r => r.status === 'Delivered')?.count || 0;
    res.json({ success: true, stats: { totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders, deliveredOrders, recentOrders } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getAllUsers, updateUser, deleteUser, getDashboardStats };
