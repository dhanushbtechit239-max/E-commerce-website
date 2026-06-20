import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeItem, updateItem, cartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Add some products to get started.</p>
        <Link to="/products" style={{ color: '#818cf8', fontWeight: 600 }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.75rem', marginBottom: '1.5rem' }}>Shopping Cart</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cartItems.map((item) => (
          <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#1a1a2e', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img src={item.product?.image} alt={item.product?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '0.25rem' }}>{item.product?.name}</p>
              <p style={{ color: '#818cf8', fontWeight: 700 }}>${item.product?.price}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={() => updateItem(item._id, item.quantity - 1)} style={{ background: '#0f0f1a', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem' }}>-</button>
              <span style={{ color: '#f1f5f9', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => updateItem(item._id, item.quantity + 1)} style={{ background: '#0f0f1a', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1rem' }}>+</button>
            </div>
            <button onClick={() => removeItem(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <p style={{ color: '#f1f5f9', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
          Total: ${cartTotal?.toFixed(2) ?? '0.00'}
        </p>
        <button
          onClick={() => navigate('/checkout')}
          style={{ padding: '0.75rem 2rem', background: '#818cf8', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
