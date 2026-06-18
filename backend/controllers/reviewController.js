const { Review, Product, User } = require('../models');

// GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ where: { productId: req.params.productId }, include: [{ model: User, as: 'user', attributes: ['id','name'] }], order: [['createdAt','DESC']] });
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const existing = await Review.findOne({ where: { productId, userId: req.user.id } });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this product.' });
    const review = await Review.create({ productId, userId: req.user.id, rating: parseInt(rating), title, comment });
    // Recalculate product rating
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await product.update({ rating: avgRating.toFixed(1), numReviews: allReviews.length });
    const full = await Review.findByPk(review.id, { include: [{ model: User, as: 'user', attributes: ['id','name'] }] });
    res.status(201).json({ success: true, review: full });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    if (req.user.role !== 'admin' && review.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Access denied.' });
    const productId = review.productId;
    await review.destroy();
    const allReviews = await Review.findAll({ where: { productId } });
    const avgRating = allReviews.length ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length : 0;
    await Product.update({ rating: avgRating.toFixed(1), numReviews: allReviews.length }, { where: { id: productId } });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getProductReviews, createReview, deleteReview };
