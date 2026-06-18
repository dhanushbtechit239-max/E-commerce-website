const { Cart, Product } = require('../models');

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const items = await Cart.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product' }] });
    res.json({ success: true, cartItems: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    let item = await Cart.findOne({ where: { userId: req.user.id, productId } });
    if (item) {
      item.quantity = Math.min(item.quantity + parseInt(quantity), product.stock);
      await item.save();
    } else {
      item = await Cart.create({ userId: req.user.id, productId, quantity: Math.min(parseInt(quantity), product.stock) });
    }
    const full = await Cart.findByPk(item.id, { include: [{ model: Product, as: 'product' }] });
    res.status(201).json({ success: true, cartItem: full });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/cart/:id
const updateCartItem = async (req, res) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });
    item.quantity = parseInt(req.body.quantity);
    await item.save();
    res.json({ success: true, cartItem: item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/cart/:id
const removeCartItem = async (req, res) => {
  try {
    const item = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found.' });
    await item.destroy();
    res.json({ success: true, message: 'Removed from cart.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/cart (clear all)
const clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
