import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addToWishlist, removeFromWishlist } from '../api/services';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ProductCard = ({ product, wishlistIds = [], onWishlistChange }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart.');
      return;
    }
    await addItem(product.id, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist.'); return; }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast.success('Removed from wishlist.');
      } else {
        await addToWishlist({ productId: product.id });
        toast.success('Added to wishlist! ❤️');
      }
      onWishlistChange?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (p) => `₹${parseFloat(p).toLocaleString('en-IN')}`;

  const stars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar key={i} size={12} style={{ fill: i < Math.round(rating) ? '#f59e0b' : 'none', color: '#f59e0b' }} />
    ));
  };

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="glass-card product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', paddingBottom: '65%', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s ease',
            }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'; }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {product.isFeatured && <span className="badge badge-primary">Featured</span>}
            {product.stock === 0 && <span className="badge badge-danger">Out of Stock</span>}
            {product.stock > 0 && product.stock <= 5 && <span className="badge badge-warning">Low Stock</span>}
          </div>

          {/* Wishlist btn */}
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            style={{
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              width: 34, height: 34, borderRadius: '50%',
              background: isWishlisted ? 'rgba(239,68,68,0.9)' : 'rgba(0,0,0,0.5)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              opacity: hovered || isWishlisted ? 1 : 0,
            }}
          >
            <FiHeart size={14} style={{ color: isWishlisted ? 'white' : '#f87171', fill: isWishlisted ? 'white' : 'none' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem' }}>
          {/* Category */}
          <span style={{ fontSize: '0.7rem', color: '#818cf8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category}
          </span>

          {/* Name */}
          <h3 className="line-clamp-2" style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem', margin: '0.3rem 0 0.5rem', lineHeight: 1.4 }}>
            {product.name}
          </h3>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <div className="stars" style={{ fontSize: '0.7rem' }}>{stars(product.rating)}</div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({product.numReviews})</span>
            </div>
          )}

          {/* Price + Cart */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem',
              background: 'linear-gradient(135deg,#6366f1,#ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary btn-sm"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', flexShrink: 0 }}
            >
              <FiShoppingCart size={13} />
              {product.stock === 0 ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
