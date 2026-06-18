const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required.' });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered.' });
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hash, role: role === 'admin' ? 'admin' : 'customer' });
    const { password: _, ...safe } = user.toJSON();
    res.status(201).json({ success: true, token: generateToken(user.id), user: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const { password: _, ...safe } = user.toJSON();
    res.json({ success: true, token: generateToken(user.id), user: safe });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const { password: _, ...safe } = req.user.toJSON();
  res.json({ success: true, user: safe });
};

module.exports = { register, login, getMe };
