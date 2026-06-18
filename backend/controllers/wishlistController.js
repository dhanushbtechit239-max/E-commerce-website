const { Wishlist, Product } = require('../models');

// GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({ where: { userId: req.user.id }, include: [{ model: Product, as: 'product' }] });
    res.json({ success: true, wishlistItems: items });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const exists = await Wishlist.findOne({ where: { userId: req.user.id, productId } });
    if (exists) return res.status(400).json({ success: false, message: 'Already in wishlist.' });
    const item = await Wishlist.create({ userId: req.user.id, productId });
    const full = await Wishlist.findByPk(item.id, { include: [{ model: Product, as: 'product' }] });
    res.status(201).json({ success: true, wishlistItem: full });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOne({ where: { userId: req.user.id, productId: req.params.productId } });
    if (!item) return res.status(404).json({ success: false, message: 'Not in wishlist.' });
    await item.destroy();
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
