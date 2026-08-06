"use client";

import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

function normalizeSelectedOptions(selectedOptions = {}) {
  return {
    color: String(selectedOptions.color ?? ""),
    orientation: String(selectedOptions.orientation ?? ""),
    type: String(selectedOptions.type ?? ""),
    subtype: String(selectedOptions.subtype ?? ""),
  };
}

function hasSameConfiguration(leftOptions, rightOptions) {
  return (
    leftOptions.color === rightOptions.color &&
    leftOptions.orientation === rightOptions.orientation &&
    leftOptions.type === rightOptions.type &&
    leftOptions.subtype === rightOptions.subtype
  );
}

function createCartItemId(guitarId, selectedOptions) {
  if (!guitarId) {
    return crypto.randomUUID();
  }

  const { color, orientation, type, subtype } = selectedOptions;
  return `${guitarId}::${type}::${subtype}::${color}::${orientation}`;
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  function addToCart(guitar, selectedOptions) {
    if (!guitar || !guitar._id) {
      return;
    }

    const normalizedOptions = normalizeSelectedOptions(selectedOptions);

    setCart((previousCart) => {
      const existingItemIndex = previousCart.findIndex(
        (item) =>
          item.guitar?._id === guitar._id &&
          hasSameConfiguration(item.selectedOptions, normalizedOptions),
      );

      if (existingItemIndex >= 0) {
        return previousCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      const cartItemId = createCartItemId(guitar._id, normalizedOptions);

      return [
        ...previousCart,
        {
          cartItemId,
          guitar,
          selectedOptions: normalizedOptions,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(cartItemId) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.cartItemId !== cartItemId),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleFavorite(guitarId) {
    if (!guitarId) {
      return;
    }

    setFavorites((previousFavorites) =>
      previousFavorites.includes(guitarId)
        ? previousFavorites.filter((id) => id !== guitarId)
        : [...previousFavorites, guitarId],
    );
  }

  function login(userData) {
    const fallbackUser = {
      id: "demo-user",
      name: "Usuario Demo",
      email: "demo@luthier.io",
    };

    setActiveUser(userData ?? fallbackUser);
  }

  function logout() {
    setActiveUser(null);
  }

  const value = useMemo(
    () => ({
      cart,
      favorites,
      activeUser,
      addToCart,
      removeFromCart,
      clearCart,
      toggleFavorite,
      login,
      logout,
    }),
    [cart, favorites, activeUser],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
