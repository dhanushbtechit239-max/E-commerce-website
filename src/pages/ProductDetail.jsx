import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../api/productService';
import { getProductReviews, createReview } from '../api/services';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/services';
import { FiShoppingCart, FiHeart, FiStar, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([fetchProductById(id), getProductReviews(id)]);
        setProduct(pRes.data.product);
        setReviews(rRes.data.reviews || []);
        if (isAuthenticated) {
          const wRes = await getWishlist();
          const ids = (wRes.data.wishlist || []).map(w => w.productId);
          setWishlisted(ids.includes(parseInt(id)));
        }
      } catch { toast.error('Product not found.'); navigate('/products'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart.'); return; }
    await addItem(product.id, qty);
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login.'); return; }
    try {
      if (wishlisted) { await removeFromWishlist(product.id); toast.success('Removed from wishlist.'); }
      else { await addToWishlist({ productId: product.id }); toast.success('Added to wishlist! ❤️'); }
      setWishlisted(!wishlisted);
    } catch { toast.error('Failed to update wishlist.'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment.'); return; }
    setSubmittingReview(true);
    try {
      await createReview({ productId: parseInt(id), ...reviewForm });
      toast.success('Review submitted!');
      const rRes = await getProductReviews(id);
      setReviews(rRes.data.reviews || []);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to submit review.'); }
    finally { setSubmittingReview(false); }
  };

  const fmt = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return null;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <FiArrowLeft size={14} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Image */}
        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
          <img src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} alt={product.name}
            style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }} />
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', lineHeight: 1.3 }}>{product.name}</h1>

          {product.numReviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <FiStar key={i} size={16} style={{ fill: i < Math.round(product.rating) ? '#f59e0b' : 'none', color: '#f59e0b' }} />
              ))}
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>({product.numReviews} reviews)</span>
            </div>
          )}

          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {fmt(product.price)}
          </div>

          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>
              {product.stock > 0 ? `✓ In stock (${product.stock})` : '✗ Out of stock'}
            </span>
          </div>

          {/* Qty */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiMinus size={14} /></button>
                <span style={{ padding: '0 0.75rem', color: '#f1f5f9', fontWeight: 600, minWidth: 32, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FiPlus size={14} /></button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FiShoppingCart size={16} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button onClick={toggleWishlist} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiHeart size={16} style={{ fill: wishlisted ? '#ef4444' : 'none', color: wishlisted ? '#ef4444' : 'currentColor' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#f1f5f9', marginBottom: '1.5rem' }}>
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 && <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No reviews yet. Be the first!</p>}
        {reviews.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                {r.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.875rem' }}>{r.user?.name || 'User'}</div>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }, (_, i) => <FiStar key={i} size={11} style={{ fill: i < r.rating ? '#f59e0b' : 'none', color: '#f59e0b' }} />)}
                </div>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>{r.comment}</p>
          </div>
        ))}

        {isAuthenticated && (
          <form onSubmit={handleReview} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem', margin: 0 }}>Write a Review</h3>
            <div>
              <label className="input-label">Rating</label>
              <select value={reviewForm.rating} onChange={e => setReviewForm(p => ({ ...p, rating: parseInt(e.target.value) }))}
                className="input" style={{ width: 'auto' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Comment</label>
              <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                placeholder="Share your experience..." rows={3}
                className="input" style={{ resize: 'vertical', minHeight: 80 }} />
            </div>
            <button type="submit" disabled={submittingReview} className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
              {submittingReview ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
