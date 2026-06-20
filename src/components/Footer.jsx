import { Link } from 'react-router-dom';
import { FiShoppingBag, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => (
  <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto', padding: '2.5rem 1rem 1.5rem' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShoppingBag size={16} color="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#f1f5f9', fontSize: '1.1rem' }}>ShopNow</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>Premium shopping experience with the best products.</p>
        </div>
        <div>
          <h4 style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Shop</h4>
          {['Products', 'Categories', 'Wishlist', 'Cart'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.4rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#64748b'}>{l}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Account</h4>
          {['Login', 'Register', 'Orders'].map(l => (
            <Link key={l} to={`/${l.toLowerCase()}`} style={{ display: 'block', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.4rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#64748b'}>{l}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
              <a key={i} href="#" style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.2)'; e.currentTarget.style.color='#818cf8'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#64748b'; }}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', textAlign: 'center', color: '#475569', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} ShopNow. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
