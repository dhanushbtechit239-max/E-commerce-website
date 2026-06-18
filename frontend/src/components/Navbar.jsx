import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX, FiSearch, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { navigate(`/products?keyword=${encodeURIComponent(search.trim())}`); setSearch(''); }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const BadgeCount = ({ count }) => count > 0 ? (
    <span style={{ position: 'absolute', top: -6, right: -6, background: 'linear-gradient(135deg,#6366f1,#ec4899)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{count > 9 ? '9+' : count}</span>
  ) : null;

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/products?category=Electronics', label: 'Electronics' },
    { to: '/products?category=Fashion', label: 'Fashion' },
  ];

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(15,15,35,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '1rem', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', fontSize: '0.9rem', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>S</div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>Shop<span style={{ color: '#818cf8' }}>Now</span></span>
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem', display: window.innerWidth < 768 ? 'none' : 'flex' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{ color: '#94a3b8', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 380, display: 'flex', gap: '0.4rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '0.9rem' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '0.5rem 0.75rem 0.5rem 2.25rem', color: '#f1f5f9', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          </div>
        </form>

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
          {isAdmin && (
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', textDecoration: 'none', padding: '0.4rem 0.75rem', borderRadius: 8, background: 'rgba(251,191,36,0.1)', fontSize: '0.78rem', fontWeight: 600, flexShrink: 0 }}>
              <FiShield size={14} /> Admin
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
              <FiHeart size={18} />
            </Link>
          )}

          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
            <FiShoppingCart size={18} />
            <BadgeCount count={cartCount} />
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, padding: '0.4rem 0.75rem', color: '#f1f5f9', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: 'white' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name?.split(' ')[0]}</span>
              </button>
              <div className="dropdown-menu" style={{ position: 'absolute', right: 0, top: '110%', background: 'rgba(20,20,40,0.98)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.5rem', minWidth: 160, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 999 }}>
                <Link to="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8, color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#f1f5f9'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                  <FiUser size={14} /> My Orders
                </Link>
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 8, color: '#f87171', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dropdown-container:hover .dropdown-menu,
        .dropdown-container:focus-within .dropdown-menu { display: block !important; }
        .dropdown-menu { display: none; }
      `}</style>
    </nav>
  );
};

export default Navbar;
