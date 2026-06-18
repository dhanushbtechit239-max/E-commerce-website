import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../api/services';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) { setCartItems([]); return; }
    setCartLoading(true);
    try {
      const res = await getCart();
      setCartItems(res.data.cartItems || []);
    } catch {} finally { setCartLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [isAuthenticated]);

  const addItem = async (productId, quantity = 1) => {
    try {
      await addToCart({ productId, quantity });
      await fetchCart();
      toast.success('Added to cart! 🛒');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add to cart.'); }
  };

  const updateItem = async (cartItemId, quantity) => {
    try { await updateCartItem(cartItemId, { quantity }); await fetchCart(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to update cart.'); }
  };

  const removeItem = async (cartItemId) => {
    try { await removeCartItem(cartItemId); await fetchCart(); toast.success('Removed from cart.'); }
    catch { toast.error('Failed to remove item.'); }
  };

  const emptyCart = async () => {
    try { await clearCart(); setCartItems([]); }
    catch {}
  };

  const cartTotal = cartItems.reduce((s, i) => s + parseFloat(i.product?.price || 0) * i.quantity, 0);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, cartTotal, cartCount, addItem, updateItem, removeItem, emptyCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
