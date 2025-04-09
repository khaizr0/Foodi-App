import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity) => {
    console.log("addToCart - product:", product, "quantity:", quantity);
    setCartItems(prevItems => {
      // Sử dụng _id thay vì id
      const existing = prevItems.find(item => item._id === product._id);
      if (existing) {
        console.log("Sản phẩm đã tồn tại, cập nhật số lượng:", existing);
        const updatedItems = prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
        console.log("Giỏ hàng sau cập nhật:", updatedItems);
        return updatedItems;
      } else {
        console.log("Thêm sản phẩm mới:", product);
        const updatedItems = [...prevItems, { ...product, quantity }];
        console.log("Giỏ hàng mới:", updatedItems);
        return updatedItems;
      }
    });
  };

  // Xóa một sản phẩm khỏi giỏ hàng
  const removeFromCart = (itemId) => {
    console.log("removeFromCart - itemId:", itemId);
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item._id !== itemId);
      console.log("Giỏ hàng sau xóa:", updatedItems);
      return updatedItems;
    });
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    console.log("clearCart - Đang xóa toàn bộ giỏ hàng");
    setCartItems([]);
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (itemId, newQuantity) => {
    console.log("updateQuantity - itemId:", itemId, "newQuantity:", newQuantity);
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item._id === itemId ? { ...item, quantity: Math.max(newQuantity, 1) } : item
      );
      console.log("Giỏ hàng sau cập nhật số lượng:", updatedItems);
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
