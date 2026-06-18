const { Order, OrderItem, Cart, Product, User } = require('../models');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;
    const cartItems = await Cart.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product' }] });
    if (!cartItems.length) return res.status(400).json({ success: false, message: 'Cart is empty.' });
    const totalPrice = cartItems.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);
    const order = await Order.create({ userId: req.user.id, totalPrice, shippingAddress, paymentMethod });
    await Promise.all(cartItems.map(i => OrderItem.create({ orderId: order.id, productId: i.productId, name: i.product.name, image: i.product.image, price: i.product.price, quantity: i.quantity })));
    // Decrement stock
    await Promise.all(cartItems.map(i => i.product.decrement('stock', { by: i.quantity })));
    await Cart.destroy({ where: { userId: req.user.id } });
    const full = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'orderItems' }] });
    res.status(201).json({ success: true, order: full });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id }, include: [{ model: OrderItem, as: 'orderItems' }], order: [['createdAt', 'DESC']] });
    res.json({ success: true, orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 15, status } = req.query;
    const where = status ? { status } : {};
    const { count, rows } = await Order.findAndCountAll({ where, include: [{ model: User, as: 'user', attributes: ['id','name','email'] }, { model: OrderItem, as: 'orderItems' }], order: [['createdAt','DESC']], limit: parseInt(limit), offset: (parseInt(page)-1)*parseInt(limit) });
    res.json({ success: true, orders: rows, totalOrders: count, totalPages: Math.ceil(count/parseInt(limit)), page: parseInt(page) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'orderItems' }, { model: User, as: 'user', attributes: ['id','name','email'] }] });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied.' });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/orders/:id (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const { status } = req.body;
    order.status = status;
    if (status === 'Delivered') { order.deliveredAt = new Date(); order.isPaid = true; order.paidAt = new Date(); }
    await order.save();
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrderById, updateOrderStatus };
