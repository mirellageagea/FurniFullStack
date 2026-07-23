import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { CartAPI } from "../api/endpoints";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function recalcTotal(items) {
  return (
    Math.round(
      items.reduce((sum, i) => sum + i.productPrice * i.quantity, 0) * 100,
    ) / 100
  );
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      setCouponCode("");
      setCouponResult(null);
      return;
    }
    try {
      const data = await CartAPI.get();
      setCart(data);
    } catch {
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearCoupon = useCallback(() => {
    setCouponCode("");
    setCouponResult(null);
  }, []);

  const increaseItem = useCallback(
    async (itemId) => {
      setCart((prev) => {
        const items = prev.items.map((i) =>
          i.id === itemId
            ? {
                ...i,
                quantity: i.quantity + 1,
                subtotal: i.productPrice * (i.quantity + 1),
              }
            : i,
        );
        return { items, total: recalcTotal(items) };
      });
      try {
        await CartAPI.increase(itemId);
      } catch (e) {
        await refresh();
        throw e;
      }
    },
    [refresh],
  );

  const decreaseItem = useCallback(
    async (itemId) => {
      setCart((prev) => {
        const target = prev.items.find((i) => i.id === itemId);
        if (!target) return prev;
        const items =
          target.quantity > 1
            ? prev.items.map((i) =>
                i.id === itemId
                  ? {
                      ...i,
                      quantity: i.quantity - 1,
                      subtotal: i.productPrice * (i.quantity - 1),
                    }
                  : i,
              )
            : prev.items.filter((i) => i.id !== itemId);
        return { items, total: recalcTotal(items) };
      });
      try {
        await CartAPI.decrease(itemId);
      } catch (e) {
        await refresh();
        throw e;
      }
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (itemId) => {
      setCart((prev) => {
        const items = prev.items.filter((i) => i.id !== itemId);
        return { items, total: recalcTotal(items) };
      });
      try {
        await CartAPI.remove(itemId);
      } catch (e) {
        await refresh();
        throw e;
      }
    },
    [refresh],
  );

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        refresh,
        setCart,
        couponCode,
        setCouponCode,
        couponResult,
        setCouponResult,
        clearCoupon,
        increaseItem,
        decreaseItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
