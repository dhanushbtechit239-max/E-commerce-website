import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Wishlist      from './pages/Wishlist';
import Checkout      from './pages/Checkout';
import Orders        from './pages/Orders';

// Admin
import AdminLayout      from './pages/admin/AdminLayout';
import Dashboard        from './pages/admin/Dashboard';
import ManageProducts   from './pages/admin/ManageProducts';
import ManageOrders     from './pages/admin/ManageOrders';
import ManageUsers      from './pages/admin/ManageUsers';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1a2e',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* ── Admin routes (own layout, no Navbar/Footer) ── */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ManageProducts />} />
              <Route path="orders"   element={<ManageOrders />} />
              <Route path="users"    element={<ManageUsers />} />
            </Route>

            {/* ── Public/Customer routes ── */}
            <Route path="/*" element={
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  <Routes>
                    <Route path="/"               element={<Home />} />
                    <Route path="/login"          element={<Login />} />
                    <Route path="/register"       element={<Register />} />
                    <Route path="/products"       element={<Products />} />
                    <Route path="/products/:id"   element={<ProductDetail />} />
                    <Route path="/cart"           element={<Cart />} />
                    <Route path="/wishlist"       element={<Wishlist />} />
                    <Route path="/checkout"       element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/orders"         element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    {/* 404 fallback */}
                    <Route path="*" element={
                      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
                        <h1 style={{ color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', marginBottom: '0.5rem' }}>404 — Page Not Found</h1>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>The page you're looking for doesn't exist.</p>
                        <a href="/" style={{ color: '#818cf8', fontWeight: 600 }}>← Go Home</a>
                      </div>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
