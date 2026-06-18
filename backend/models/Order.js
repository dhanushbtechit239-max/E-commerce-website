const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:          { type: DataTypes.INTEGER, allowNull: false },
  totalPrice:      { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  status:          { type: DataTypes.ENUM('Pending','Processing','Shipped','Delivered','Cancelled'), defaultValue: 'Pending' },
  shippingAddress: { type: DataTypes.TEXT, defaultValue: '' },
  paymentMethod:   { type: DataTypes.STRING, defaultValue: 'COD' },
  isPaid:          { type: DataTypes.BOOLEAN, defaultValue: false },
  paidAt:          { type: DataTypes.DATE },
  deliveredAt:     { type: DataTypes.DATE },
}, { tableName: 'orders', timestamps: true });

module.exports = Order;
