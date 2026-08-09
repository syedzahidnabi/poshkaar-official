import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Array to hold the garments

  // Function to add an item to the cart and automatically open the drawer
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if the garment is already in the bag
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity if it already exists
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Add new item with a starting quantity of 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    
    setIsCartOpen(true); // Elegantly slide the drawer open
  };

  // Function to remove an item completely
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Function to adjust quantities inside the drawer
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative quantities
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate the running subtotal
  const subtotal = cartItems.reduce((total, item) => {
    // Clean the price string (e.g., "₹24,500" -> 24500) and calculate
    const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + (numericPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider 
      value={{ 
        isCartOpen, 
        setIsCartOpen, 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}