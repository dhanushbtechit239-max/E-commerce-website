import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productService';
import { getWishlist } from '../api/services';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiShoppingBag, FiShield, FiTruck, FiStar } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  const loadData = async () => {
    try {
      const res = await fetchProducts({ isFeatured: true, limit: 8 });
      setFeatured(res.data.products || []);
    } catch {} finally { setLoading(false); }
  };

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getWishlist();
      setWishlistIds((res.data.wishlist || []).map(w => w.productId));
    } catch {}
  };

  useEffect(() => { loadData(); loadWishlist(); }, [isAuthenticated]);

  const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹999' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% secure transactions' },
    { icon: FiStar, title: 'Top Quality', desc: 'Curated premium products' },
  ];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '5rem 1rem 4rem', textAlign: 'center', background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 60%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 999, padding: '0.3rem 1rem', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
            🛍️ PREMIUM SHOPPING EXPERIENCE
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#f1f5f9', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Discover Products<br />
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              You'll Love
            </span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Shop the latest trends with unbeatable prices and lightning-fast delivery right to your door.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <FiShoppingBag size={18} /> Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-5rem', left: '-5rem', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)', pointerEvents: 'none' }} />
      </section>

      {/* Features */}
      <section style={{ padding: '2rem 1rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color="#818cf8" />
              </div>
              <div>
                <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' }}>{title}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '3rem 1rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>Featured Products</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Handpicked products just for you</p>
          </div>
          <Link to="/products" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card" style={{ height: 320, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <FiShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>No featured products yet. <Link to="/products" style={{ color: '#818cf8' }}>Browse all products</Link></p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {featured.map(p => (
              <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} onWishlistChange={loadWishlist} />
            ))}
          </div>
        )}
      </section>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  );
};

export default Home;
