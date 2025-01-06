import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import moment from 'moment'

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({items: [], price: 0});

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      prevCart.price = (prevCart.price || 0) + (product.price || 0) * (quantity || 1);
      const prevItem = prevCart.items.find(item => item.product._id == product._id)
      if (prevItem) prevItem.quantity += quantity || 1;
      else prevCart.items = [...prevCart.items, {product, quantity}]
      return {...prevCart}
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const prevItem = prevCart.items.find(p => p.product._id == productId)
      prevCart.price -= prevItem.price;
      if (prevItem.quantity === 1) prevCart.items.filter(item => item.product._id !== productId);
      else --prevItem.quantity;
      return {...prevCart};
    });
  };
  
  const clearCart = () => {
    setCart({items: [], price: 0});
  };
  
  const completeOrder = async () => {
    try {
      const isOpen = moment().hour() >= 8 && moment().hour() < 24;
      const delivery_at = isOpen ? moment().add(30, "minutes") : moment().set("hour", 8).set("minute", 0);
      const res = await api.orders.create({
        items: cart.items.map(i => ({ ...i, product: i.product._id })),
        price: cart.price,
        delivery_at
      })
      clearCart()
      return res.ok;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, completeOrder }}>
      {children}
    </CartContext.Provider>
  );
};
