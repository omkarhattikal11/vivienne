import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication states
  const [name, setName] = useState(() => localStorage.getItem("name") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");

  // Transactional list states
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist")) || [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch {
      return [];
    }
  });

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    localStorage.setItem("loggedIn", loggedIn ? "true" : "false");
  }, [name, role, loggedIn]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Actions
  const login = (userName, userRole) => {
    setName(userName);
    setRole(userRole);
    setLoggedIn(true);
  };

  const logout = () => {
    setName("");
    setRole("");
    setLoggedIn(false);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.clear();
  };

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const alreadyExists = prev.some((i) => i.name === product.name);
      if (alreadyExists) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productName) => {
    setWishlist((prev) => prev.filter((i) => i.name !== productName));
  };

  const saveOrderLocal = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  const syncOrderWithBackend = async (orderItem) => {
    try {
      let amountStr = orderItem.price.replace(/[^0-9]/g, '');
      let amount = parseInt(amountStr) || 0;
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name || "Guest",
          item_name: orderItem.name,
          amount: amount,
          seller_name: orderItem.seller || "Royal Rentals"
        })
      });
      return await response.json();
    } catch (e) {
      console.log("Could not notify backend dashboard", e);
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      name, setName,
      role, setRole,
      loggedIn, setLoggedIn,
      cart, setCart,
      wishlist, setWishlist,
      orders, setOrders,
      login, logout,
      addToCart, removeFromCart, clearCart,
      addToWishlist, removeFromWishlist,
      saveOrderLocal, syncOrderWithBackend
    }}>
      {children}
    </AppContext.Provider>
  );
};
