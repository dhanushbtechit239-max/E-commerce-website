import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder: fetch orders from API
    setLoading(false);
  }, [user]);

  if (loading) return <div style={{ color: '#f1f5f9', textAlign: 'center', padding: '4rem' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem' }}>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <h2 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</h2>
          <p style={{ color: '#64748b' }}>Your order history will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Order #{order._id}</span>
                <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>{order.status}</span>
              </div>
              <p style={{ color: '#f1f5f9', fontWeight: 700 }}>${order.total?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
