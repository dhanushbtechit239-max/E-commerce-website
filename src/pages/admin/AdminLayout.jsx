import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiShoppingCart } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShoppingBag size={18} color="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#f1f5f9', fontSize: '1.1rem' }}>Admin</span>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{user?.email}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {links.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 10,
                textDecoration: 'none', color: isActive ? '#f1f5f9' : '#64748b', fontWeight: isActive ? 600 : 400, fontSize: '0.9rem',
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                transition: 'all 0.2s',
              })}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', borderRadius: 10, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color='#818cf8'} onMouseLeave={e => e.currentTarget.style.color='#64748b'}>
            <FiShoppingBag size={17} /> View Store
          </NavLink>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.9rem', borderRadius: 10, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={e => e.currentTarget.style.background='none'}>
            <FiLogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg-dark)' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
