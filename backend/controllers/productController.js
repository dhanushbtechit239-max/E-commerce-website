const { Op } = require('sequelize');
const { Product } = require('../models');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword = '', category = '', minPrice = 0, maxPrice = 9999999, minRating = 0, isFeatured, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 12 } = req.query;
    const where = {
      price: { [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)] },
      rating: { [Op.gte]: parseFloat(minRating) },
    };
    if (keyword) where.name = { [Op.like]: `%${keyword}%` };
    if (category) where.category = category;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Product.findAndCountAll({ where, order: [[sortBy, order.toUpperCase()]], limit: parseInt(limit), offset });
    res.json({ success: true, products: rows, totalProducts: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/products/categories
const getCategories = async (req, res) => {
  try {
    const cats = await Product.findAll({ attributes: [[require('sequelize').fn('DISTINCT', require('sequelize').col('category')), 'category']], raw: true });
    res.json({ success: true, categories: cats.map(c => c.category).filter(Boolean) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, isFeatured } = req.body;
    let image = req.body.image || '';
    if (req.file) image = `/uploads/${req.file.filename}`;
    const product = await Product.create({ name, description, price, category, brand, stock: stock || 0, image, isFeatured: isFeatured === 'true' || isFeatured === true });
    res.status(201).json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.isFeatured !== undefined) updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    await product.update(updates);
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    await product.destroy();
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { getProducts, getCategories, getProductById, createProduct, updateProduct, deleteProduct };
