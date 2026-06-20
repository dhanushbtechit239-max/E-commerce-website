import { Link } from 'react-router-dom';

const Home = () => (
  <div style={{ textAlign: 'center', padding: '6rem 1rem', fontFamily: 'Inter, sans-serif' }}>
    <h1 style={{ color: '#f1f5f9', fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
      Welcome to Our Store
    </h1>
    <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem' }}>
      Discover the best products at unbeatable prices.
    </p>
    <Link
      to="/products"
      style={{
        background: '#818cf8',
        color: '#fff',
        padding: '0.75rem 2rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1rem',
      }}
    >
      Shop Now
    </Link>
  </div>
);

export default Home;
