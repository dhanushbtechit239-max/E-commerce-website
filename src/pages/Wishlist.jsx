import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist } from '../api/services';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  const load = async () => {
    try { const res = await getWishlist(); setItems(res.data.wishlist || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (productId) => {
    try { await removeFromWishlist(productId); toast.success('Removed from wishlist.'); load(); }
    catch { toast.error('Failed to remove.'); }
  };

  const handleAddToCart = async (productId) => {
    await addItem(productId, 1);
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#f1f5f9', marginBottom: '0.5rem' }}>My Wishlist</h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>{items.length} saved item{items.length !== 1 ? 's' : ''}</p>

      {items.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <FiHeart size={52} style={{ color: '#334155', marginBottom: '1rem' }} />
          <h2 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.5rem' }}>Your wishlist is empty</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Save products you love for later.</p>
          <Link to="/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {items.map(item => (
            <div key={item.id} className="glass-card product-card" style={{ overflow: 'hidden', position: 'relative' }}>
              <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ position: 'relative', paddingBottom: '60%', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                  <img src={item.product?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'} alt={item.product?.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }} />
                </div>
              </Link>
              <div style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.product?.category}</span>
                <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', margin: '0.25rem 0 0.5rem', lineHeight: 1.4 }}>{item.product?.name}</h3>
                </Link>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.75rem' }}>
                  {fmt(item.product?.price)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleAddToCart(item.productId)} className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <FiShoppingCart size={13} /> Add to Cart
                  </button>
                  <button onClick={() => handleRemove(item.productId)} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.6rem' }}>
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
