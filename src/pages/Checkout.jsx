import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/services';
import { FiMapPin, FiCreditCard, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, emptyCart } = useCart();
  const navigate = useNavigate();
  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;
  const delivery = cartTotal >= 999 ? 0 : 49;
  const total = cartTotal + delivery;

  const [form, setForm] = useState({ name: '', address: '', city: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.city || !form.pincode || !form.phone) {
      toast.error('Please fill all address fields.'); return;
    }
    if (cartItems.length === 0) { toast.error('Your cart is empty.'); return; }
    setLoading(true);
    try {
      const shippingAddress = `${form.name}, ${form.address}, ${form.city} - ${form.pincode}, Ph: ${form.phone}`;
      await createOrder({ shippingAddress, paymentMethod, totalAmount: total });
      await emptyCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#f1f5f9', marginBottom: '2rem' }}>Checkout</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Shipping */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiMapPin size={18} color="#818cf8" /> Shipping Address
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[['name','Full Name','text'],['address','Street Address','text'],['city','City','text'],['pincode','Pincode','text'],['phone','Phone Number','tel']].map(([n,p,t]) => (
                <div key={n}>
                  <label className="input-label">{p}</label>
                  <input name={n} type={t} value={form[n]} onChange={handleChange} placeholder={p} className="input" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCreditCard size={18} color="#818cf8" /> Payment Method
            </h2>
            {['COD', 'Online'].map(method => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 10, border: `1px solid ${paymentMethod === method ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: paymentMethod === method ? 'rgba(99,102,241,0.1)' : 'transparent', cursor: 'pointer', marginBottom: '0.5rem', transition: 'all 0.2s' }}>
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} style={{ accentColor: '#6366f1' }} />
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>{method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{method === 'COD' ? 'Pay when delivered' : 'Card / UPI / Net Banking'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '1rem' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '1.1rem', marginBottom: '1.25rem' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>{item.product?.name} × {item.quantity}</span>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{fmt(parseFloat(item.product?.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
            <span>Delivery</span><span style={{ color: delivery === 0 ? '#10b981' : '#f1f5f9' }}>{delivery === 0 ? 'FREE' : fmt(delivery)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#f1f5f9', marginBottom: '1.5rem' }}>
            <span>Total</span>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {fmt(total)}
            </span>
          </div>
          <button type="submit" disabled={loading || cartItems.length === 0} className="btn btn-primary btn-lg" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {loading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Placing Order…</>
            ) : <><FiCheck size={16} /> Place Order</>}
          </button>
        </div>
      </form>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Checkout;
