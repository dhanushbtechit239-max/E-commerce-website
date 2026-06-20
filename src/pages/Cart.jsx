import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

const Cart = () => {
  const { cartItems, cartTotal, cartLoading, updateItem, removeItem } = useCart();
  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  if (cartLoading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>Shopping Cart</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>

      {cartItems.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <FiShoppingBag size={52} style={{ color: '#334155', marginBottom: '1rem' }} />
          <h2 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Add some products to get started!</p>
          <Link to="/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={item.product?.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/products/${item.productId}`} style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>
                    {item.product?.name}
                  </Link>
                  <span style={{ color: '#818cf8', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{fmt(item.product?.price)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                    style={{ padding: '0.4rem 0.65rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiMinus size={13} /></button>
                  <span style={{ padding: '0 0.5rem', color: '#f1f5f9', fontWeight: 600, minWidth: 28, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button onClick={() => updateItem(item.id, item.quantity + 1)}
                    style={{ padding: '0.4rem 0.65rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiPlus size={13} /></button>
                </div>
                <div style={{ fontWeight: 700, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', minWidth: 80, textAlign: 'right' }}>
                  {fmt(parseFloat(item.product?.price) * item.quantity)}
                </div>
                <button onClick={() => removeItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem', flexShrink: 0 }}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: '1.5rem', minWidth: 240, position: 'sticky', top: '1rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.6rem' }}>
              <span>Subtotal</span><span>{fmt(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              <span>Delivery</span><span style={{ color: '#10b981' }}>{cartTotal >= 999 ? 'FREE' : fmt(49)}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.25rem' }}>
              <span>Total</span>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {fmt(cartTotal >= 999 ? cartTotal : cartTotal + 49)}
              </span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Proceed to Checkout <FiArrowRight size={15} />
            </Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '0.75rem', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
