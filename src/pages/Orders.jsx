import { useEffect, useState } from 'react';
import { getMyOrders } from '../api/services';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheck, FiX, FiTruck } from 'react-icons/fi';

const statusConfig = {
  pending:    { label: 'Pending',    color: '#f59e0b', icon: FiClock },
  processing: { label: 'Processing', color: '#818cf8', icon: FiPackage },
  shipped:    { label: 'Shipped',    color: '#06b6d4', icon: FiTruck },
  delivered:  { label: 'Delivered',  color: '#10b981', icon: FiCheck },
  cancelled:  { label: 'Cancelled',  color: '#ef4444', icon: FiX },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  useEffect(() => {
    getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>My Orders</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

      {orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <FiPackage size={52} style={{ color: '#334155', marginBottom: '1rem' }} />
          <h2 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const Icon = status.icon;
            return (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                      Order #{order.id} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>📍 {order.shippingAddress}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: `${status.color}20`, border: `1px solid ${status.color}40`, borderRadius: 999, padding: '0.3rem 0.8rem' }}>
                    <Icon size={13} style={{ color: status.color }} />
                    <span style={{ color: status.color, fontWeight: 600, fontSize: '0.8rem' }}>{status.label}</span>
                  </div>
                </div>

                {/* Items */}
                {(order.orderItems || []).map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <img src={item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'} alt={item.product?.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f1f5f9', fontSize: '0.875rem', fontWeight: 600 }}>{item.product?.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Qty: {item.quantity} × {fmt(item.price)}</div>
                    </div>
                    <div style={{ color: '#f1f5f9', fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem' }}>
                      {fmt(parseFloat(item.price) * item.quantity)}
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '💳 Online Payment'}</span>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {fmt(order.totalPrice)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
