import React, { useEffect, useState, useCallback } from 'react';
import Cart from './Cart';
import { getCart, removeFromCart } from '../api';

const CartContainer = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  
  const fetchCartItems = useCallback(async () => {
    try {
      const cart = await getCart(); 
      const items = cart.items || []; 
      setCartItems(items); 
      calculateCartItemCount(items); 
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

  useEffect(() => {
    fetchCartItems(); 
  }, [fetchCartItems]);

  
  const calculateCartItemCount = (items) => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0); 
    setCartItemCount(count);
  };

  
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId); 
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <Cart 
      cartItems={cartItems} 
      cartItemCount={cartItemCount} 
      removeFromCart={handleRemoveFromCart} 
    />
  );
};

export default CartContainer;
