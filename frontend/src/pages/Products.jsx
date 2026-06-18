import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/productService';
import { getWishlist } from '../api/services';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { FiFilter, FiX, FiChevronDown, FiSearch } from 'react-icons/fi';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt-DESC' },
  { label: 'Price: Low to High', value: 'price-ASC' },
  { label: 'Price: High to Low', value: 'price-DESC' },
  { label: 'Top Rated', value: 'rating-DESC' },
  { label: 'Most Reviewed', value: 'numReviews-DESC' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('keyword') || '');

  // Filter state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || 0,
    maxPrice: searchParams.get('maxPrice') || 200000,
    minRating: searchParams.get('minRating') || 0,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || 'DESC',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetchProducts({ ...filters, limit: 12 }),
        fetchCategories(),
      ]);
      setProducts(prodRes.data.products || []);
      setTotalPages(prodRes.data.totalPages || 1);
      setTotalProducts(prodRes.data.totalProducts || 0);
      setCategories(['All', ...(catRes.data.categories || [])]);

      if (isAuthenticated) {
        const wRes = await getWishlist();
        setWishlistIds((wRes.data.wishlistItems || []).map(i => i.productId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sync filters → URL
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== 0) params[k] = v; });
    setSearchParams(params, { replace: true });
  }, [filters]);

  const updateFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val, page: 1 }));
  const handleSort = (val) => {
    const [sortBy, order] = val.split('-');
    setFilters((p) => ({ ...p, sortBy, order, page: 1 }));
  };
  const handleSearch = (e) => { e.preventDefault(); updateFilter('keyword', localSearch); };
  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: 0, maxPrice: 200000, minRating: 0, sortBy: 'createdAt', order: 'DESC', page: 1 });
    setLocalSearch('');
  };

  const currentSort = `${filters.sortBy}-${filters.order}`;

  // Sidebar filter panel
  const FilterPanel = () => (
    <div className="glass-card" style={{ padding: '1.25rem', position: 'sticky', top: '80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>Filters</h3>
        <button onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ fontSize: '0.72rem' }}>Clear All</button>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="input-label" style={{ marginBottom: '0.6rem' }}>Category</label>
        {categories.map((cat) => (
          <button key={cat} onClick={() => updateFilter('category', cat === 'All' ? '' : cat)}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.45rem 0.75rem',
              marginBottom: '0.2rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.85rem',
              fontWeight: filters.category === (cat === 'All' ? '' : cat) ? 600 : 400,
              background: filters.category === (cat === 'All' ? '' : cat) ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: filters.category === (cat === 'All' ? '' : cat) ? '#818cf8' : '#94a3b8',
              transition: 'all 0.15s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Price range */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="input-label">Price Range</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input type="number" placeholder="Min" className="input" style={{ flex: 1, padding: '0.5rem' }}
            value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value || 0)} />
          <input type="number" placeholder="Max" className="input" style={{ flex: 1, padding: '0.5rem' }}
            value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value || 200000)} />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="input-label">Min Rating</label>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4].map((r) => (
            <button key={r} onClick={() => updateFilter('minRating', r)}
              style={{
                padding: '0.3rem 0.6rem', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: '0.78rem',
                background: parseInt(filters.minRating) === r ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)',
                color: parseInt(filters.minRating) === r ? '#818cf8' : '#94a3b8',
              }}>
              {r === 0 ? 'All' : `${r}★+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.5rem', marginRight: 'auto' }}>
          {filters.category || 'All Products'}
          {totalProducts > 0 && <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 400, marginLeft: '0.5rem' }}>({totalProducts} items)</span>}
        </h1>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <select value={currentSort} onChange={(e) => handleSort(e.target.value)}
            className="input" style={{ paddingRight: '2rem', width: 'auto', cursor: 'pointer' }}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Mobile filter toggle */}
        <button onClick={() => setShowFilter(!showFilter)} className="btn btn-secondary btn-sm">
          <FiFilter size={14} /> Filters
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input type="text" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products…" className="input" style={{ paddingLeft: '2.5rem' }} />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        {filters.keyword && (
          <button type="button" onClick={() => { setLocalSearch(''); updateFilter('keyword', ''); }} className="btn btn-secondary">
            <FiX size={14} />
          </button>
        )}
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
        {/* Filter sidebar (desktop) */}
        <div style={{ display: window.innerWidth < 768 ? 'none' : 'block' }}>
          <FilterPanel />
        </div>

        {/* Product grid */}
        <div>
          {loading ? (
            <Spinner text="Loading products…" />
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ color: '#f1f5f9', marginBottom: '0.5rem' }}>No products found</h3>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="products-grid stagger">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} wishlistIds={wishlistIds} onWishlistChange={() => {
                    getWishlist().then(r => setWishlistIds((r.data.wishlistItems || []).map(i => i.productId)));
                  }} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button key={pg} onClick={() => setFilters((p) => ({ ...p, page: pg }))}
                      style={{
                        width: 40, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                        background: filters.page === pg ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'rgba(255,255,255,0.06)',
                        color: filters.page === pg ? 'white' : '#94a3b8',
                        transition: 'all 0.2s',
                      }}>
                      {pg}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
