import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartAPI } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { Spinner, ErrorAlert } from "../components/UI";
import { imageUrl } from "../api/client";

export default function Cart() {
  const {
    cart,
    refresh,
    couponCode,
    setCouponCode,
    couponResult,
    setCouponResult,
    increaseItem,
    decreaseItem,
    removeItem,
  } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const handleIncrease = async (item) => {
    try {
      await increaseItem(item.id);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleDecrease = async (item) => {
    try {
      await decreaseItem(item.id);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code.");
      return;
    }
    try {
      const result = await CartAPI.validateCoupon(couponCode.trim());
      setCouponResult(result);
    } catch (e) {
      setCouponResult({ valid: false, message: e.message });
    }
  };

  if (loading) return <Spinner label="Loading your cart…" />;

  const finalTotal = couponResult?.valid ? couponResult.finalTotal : cart.total;

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Cart</h1>
              </div>
            </div>
            <div className="col-lg-7"></div>
          </div>
        </div>
      </div>

      <div className="untree_co-section before-footer-section">
        <div className="container">
          <ErrorAlert message={error} />

          {cart.items.length === 0 ? (
            <div className="text-center py-4">
              <h5>Your cart is empty</h5>
              <Link to="/shop" className="btn btn-black mt-2">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div id="cart-content">
              <div className="site-blocks-table">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="product-thumbnail">Image</th>
                      <th className="product-name">Product</th>
                      <th className="product-price">Price</th>
                      <th className="product-quantity">Quantity</th>
                      <th className="product-total">Total</th>
                      <th className="product-remove">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item.id}>
                        <td className="product-thumbnail">
                          {item.productImageUrl ? (
                            <img
                              src={imageUrl(item.productImageUrl)}
                              alt="Image"
                              className="img-fluid"
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <img
                              src="/images/product-1.png"
                              alt="Image"
                              className="img-fluid"
                              style={{ width: 80 }}
                            />
                          )}
                        </td>
                        <td className="product-name">
                          <h2 className="h5 text-black">{item.productName}</h2>
                        </td>
                        <td>${item.productPrice.toFixed(2)}</td>
                        <td>
                          <div
                            className="input-group mb-3 d-flex align-items-center quantity-container"
                            style={{ maxWidth: 120 }}
                          >
                            <div className="input-group-prepend">
                              <button
                                type="button"
                                className="btn btn-outline-black qty-btn"
                                onClick={() => handleDecrease(item)}
                              >
                                −
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control text-center quantity-amount"
                              value={item.quantity}
                              readOnly
                            />
                            <div className="input-group-append">
                              <button
                                type="button"
                                className="btn btn-outline-black qty-btn"
                                disabled={item.quantity >= item.productStock}
                                onClick={() => handleIncrease(item)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>${item.subtotal.toFixed(2)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-black btn-sm"
                            onClick={() => handleRemove(item)}
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="row mb-5">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <Link
                        to="/shop"
                        className="btn btn-outline-black btn-sm btn-block"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="text-black h4" htmlFor="coupon">
                        Coupon
                      </label>
                      <p>Enter your coupon code if you have one.</p>
                    </div>
                    <div className="col-md-8 mb-3 mb-md-0">
                      <input
                        type="text"
                        className="form-control py-3"
                        id="coupon"
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponResult(null);
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-black"
                        type="button"
                        onClick={handleApplyCoupon}
                      >
                        Apply Coupon
                      </button>
                    </div>
                    {couponResult && (
                      <p
                        className={`mt-2 ${couponResult.valid ? "text-success" : "text-danger"}`}
                      >
                        {couponResult.valid
                          ? `✅ Coupon valid! You will save $${couponResult.discount.toFixed(2)} at checkout.`
                          : `❌ ${couponResult.message}`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-md-6 pl-5">
                  <div className="row justify-content-end">
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-12 text-right border-bottom mb-5">
                          <h3 className="text-black h4 text-uppercase">
                            Cart Totals
                          </h3>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <span className="text-black">Subtotal</span>
                        </div>
                        <div className="col-md-6 text-right">
                          <strong className="text-black">
                            ${cart.total.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                      {couponResult?.valid && (
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <span className="text-success">
                              Discount ({couponCode})
                            </span>
                          </div>
                          <div className="col-md-6 text-right">
                            <strong className="text-success">
                              -${couponResult.discount.toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      )}
                      <div className="row mb-5">
                        <div className="col-md-6">
                          <span className="text-black">Total</span>
                        </div>
                        <div className="col-md-6 text-right">
                          <strong className="text-black">
                            ${finalTotal.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <button
                            className="btn btn-black btn-lg py-3 btn-block"
                            onClick={() => navigate("/checkout")}
                          >
                            Proceed To Checkout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
