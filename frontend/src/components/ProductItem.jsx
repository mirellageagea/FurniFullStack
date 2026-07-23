import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { CartAPI } from "../api/endpoints";
import { imageUrl } from "../api/client";

export default function ProductItem({ product }) {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();

  const qtyInCart =
    cart.items.find((i) => i.productId === product.id)?.quantity || 0;
  const availableToAdd = product.stock - qtyInCart;
  const outOfStock = availableToAdd <= 0;

  const handleClick = async (e) => {
    e.preventDefault();
    if (outOfStock) return;

    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await CartAPI.add(product.id);
      await refresh();
      navigate("/cart");
    } catch (err) {
      await refresh();
      navigate("/cart");
    }
  };

  return (
    <a
      className={`product-item${outOfStock ? " product-item-disabled" : ""}`}
      href="#"
      onClick={handleClick}
      aria-disabled={outOfStock}
    >
      <div style={{ position: "relative" }}>
        {product.imageUrl ? (
          <img
            src={imageUrl(product.imageUrl)}
            className="img-fluid product-thumbnail"
            style={{
              width: "100%",
              objectFit: "contain",
              opacity: outOfStock ? 0.5 : 1,
            }}
          />
        ) : (
          <img
            src="/images/product-1.png"
            className="img-fluid product-thumbnail"
            style={{ opacity: outOfStock ? 0.5 : 1 }}
          />
        )}
        {outOfStock && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      <h3 className="product-title">{product.name}</h3>
      <strong className="product-price">${product.price.toFixed(2)}</strong>
      {!outOfStock && (
        <span className="icon-cross">
          <img src="/images/cross.svg" className="img-fluid" />
        </span>
      )}
    </a>
  );
}
