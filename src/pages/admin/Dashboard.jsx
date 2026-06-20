import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/services';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiClock } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending:    '#fbbf24', Processing: '#818cf8',
  Shipped:    '#60a5fa', Delivered: '#34d399', Cancelled: '#f87171',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner size={48} text="Loading dashboard…" /></div>;

  const formatPrice = (p) => `₹${parseFloat(p || 0).toLocaleString('en-IN')}`;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue), icon: <FiDollarSign size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Total Orders', value: stats?.totalOrders, icon: <FiShoppingBag size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Total Users', value: stats?.totalUsers, icon: <FiUsers size={22} />, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
    { label: 'Total Products', value: stats?.totalProducts, icon: <FiPackage size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Pending Orders', value: stats?.pendingOrders, icon: <FiClock size={22} />, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    { label: 'Delivered', value: stats?.deliveredOrders, icon: <FiTrendingUp size={22} />, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card) => (
          <div key={card.label} className="glass-card animate-fade-in-up" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{card.label}</p>
                <p style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem' }}>{card.value}</p>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Manage Products', to: '/admin/products', icon: '📦', color: '#6366f1' },
          { label: 'Manage Orders',   to: '/admin/orders',   icon: '🛒', color: '#ec4899' },
          { label: 'Manage Users',    to: '/admin/users',    icon: '👥', color: '#10b981' },
        ].map((link) => (
          <Link key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
            <div className="glass-card product-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{link.icon}</div>
              <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>{link.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'Outfit, sans-serif' }}>Recent Orders</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map((order) => (
                <tr key={order.id}>
                  <td style={{ color: '#818cf8', fontWeight: 600 }}>#{order.id}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(order.totalPrice)}</td>
                  <td><span style={{ padding: '0.2rem 0.7rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}>{order.status}</span></td>
                  <td style={{ color: '#64748b' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
