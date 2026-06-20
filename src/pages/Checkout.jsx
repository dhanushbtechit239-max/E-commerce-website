import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, cartTotal, emptyCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Placeholder: integrate with order API
    setSubmitted(true);
    if (emptyCart) emptyCart();
    setTimeout(() => navigate('/orders'), 2000);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ color: '#f1f5f9', fontWeight: 700 }}>Order Placed!</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem' }}>Checkout</h1>
      <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Summary</h3>
        {cartItems?.map((item) => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', color: '#f1f5f9', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.75rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f1f5f9', fontWeight: 700 }}>
          <span>Total</span>
          <span>${cartTotal?.toFixed(2) ?? '0.00'}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          placeholder="Shipping address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: '#0f0f1a', color: '#f1f5f9', fontSize: '0.95rem', resize: 'vertical' }}
        />
        <button
          type="submit"
          style={{ padding: '0.75rem', borderRadius: '8px', background: '#818cf8', color: '#fff', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer' }}
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
