import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/services';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending:    '#fbbf24', Processing: '#818cf8',
  Shipped:    '#60a5fa', Delivered:  '#34d399', Cancelled: '#f87171',
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (filterStatus) params.status = filterStatus;
      const res = await getAllOrders(params);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, { status });
      toast.success(`Order #${orderId} → ${status}`);
      load();
    } catch { toast.error('Failed to update status.'); } finally { setUpdatingId(null); }
  };

  const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#f1f5f9' }}>Manage Orders</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['', ...STATUS_OPTIONS].map((s) => (
            <button key={s || 'All'} onClick={() => { setFilterStatus(s); setPage(1); }}
              className="btn btn-sm"
              style={{ background: filterStatus === s ? `${STATUS_COLORS[s] || '#6366f1'}20` : 'rgba(255,255,255,0.06)', color: STATUS_COLORS[s] || (filterStatus === s ? '#818cf8' : '#94a3b8'), border: filterStatus === s ? `1px solid ${STATUS_COLORS[s] || '#6366f1'}40` : '1px solid rgba(255,255,255,0.06)' }}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card">
        {loading ? <Spinner text="Loading orders…" /> : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No orders found.</div>
        ) : (
          <div>
            {orders.map((order) => {
              const isExp = expanded === order.id;
              const statusColor = STATUS_COLORS[order.status] || '#94a3b8';
              return (
                <div key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* Row */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', gap: '1rem', flexWrap: 'wrap', cursor: 'pointer' }}
                    onClick={() => setExpanded(isExp ? null : order.id)}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>#{order.id}</span>
                        <span style={{ color: '#f1f5f9', fontSize: '0.875rem' }}>{order.user?.name}</span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{order.user?.email}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' • '}{order.orderItems?.length} item{order.orderItems?.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div style={{ fontWeight: 700, color: '#f1f5f9', minWidth: 80, textAlign: 'right' }}>{formatPrice(order.totalPrice)}</div>

                    {/* Status dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select value={order.status} disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40`, borderRadius: 8, padding: '0.35rem 0.6rem', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {isExp ? <FiChevronUp style={{ color: '#64748b', flexShrink: 0 }} /> : <FiChevronDown style={{ color: '#64748b', flexShrink: 0 }} />}
                  </div>

                  {/* Expanded items */}
                  {isExp && (
                    <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      {(order.orderItems || []).map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40'} alt={item.name}
                              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }}
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=40'; }} />
                            <span className="line-clamp-1" style={{ color: '#f1f5f9', maxWidth: 250 }}>{item.name}</span>
                          </div>
                          <span style={{ color: '#94a3b8' }}>×{item.quantity} · {formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      {order.shippingAddress && (
                        <p style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.75rem' }}>📍 {order.shippingAddress}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button key={pg} onClick={() => setPage(pg)} style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', background: page === pg ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.06)', color: page === pg ? 'white' : '#94a3b8' }}>{pg}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
