"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

function normalizeUser(userData) {
  if (!userData?._id) {
    return null;
  }

  return {
    _id: String(userData._id),
    name: String(userData.name ?? ""),
    email: String(userData.email ?? ""),
    role: userData.role === "admin" ? "admin" : "user",
    favorites: Array.isArray(userData.favorites)
      ? userData.favorites.map((favorite) => String(favorite))
      : [],
  };
}

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

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const normalizedUser = normalizeUser(payload);

        setActiveUser(normalizedUser);
        setFavorites(normalizedUser?.favorites || []);
      } catch {
        setActiveUser(null);
        setFavorites([]);
      }
    }

    restoreSession();
  }, []);

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

  function incrementCartItem(cartItemId) {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decrementCartItem(cartItemId) {
    setCart((previousCart) =>
      previousCart.flatMap((item) => {
        if (item.cartItemId !== cartItemId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleFavorite(guitarId) {
    if (!guitarId) {
      return;
    }

    setFavorites((previousFavorites) => {
      const nextFavorites = previousFavorites.includes(guitarId)
        ? previousFavorites.filter((id) => id !== guitarId)
        : [...previousFavorites, guitarId];

      setActiveUser((previousUser) =>
        previousUser ? { ...previousUser, favorites: nextFavorites } : previousUser,
      );

      return nextFavorites;
    });
  }

  function login(userData) {
    const normalizedUser = normalizeUser(userData);

    setActiveUser(normalizedUser);
    setFavorites(normalizedUser?.favorites || []);
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignoro el error porque igualmente cierro la sesion local.
    }

    setActiveUser(null);
    setFavorites([]);
  }

  const value = useMemo(
    () => ({
      cart,
      favorites,
      activeUser,
      addToCart,
      removeFromCart,
      incrementCartItem,
      decrementCartItem,
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
