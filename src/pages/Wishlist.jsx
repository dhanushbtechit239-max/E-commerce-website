import { Link } from 'react-router-dom';

const Wishlist = () => (
  <div style={{ textAlign: 'center', padding: '6rem 1rem', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❤️</div>
    <h2 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '0.5rem' }}>Your Wishlist</h2>
    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Items you&apos;ve saved for later will appear here.</p>
    <Link to="/products" style={{ color: '#818cf8', fontWeight: 600 }}>Browse Products</Link>
  </div>
);

export default Wishlist;
