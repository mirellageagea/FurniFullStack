import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartAPI } from "../api/endpoints";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ErrorAlert } from "../components/UI";

const COUNTRIES = [
  "Lebanon",
  "Bangladesh",
  "Algeria",
  "Afghanistan",
  "Ghana",
  "Albania",
  "Bahrain",
  "Colombia",
  "Dominican Republic",
];

export default function Checkout() {
  const {
    cart,
    refresh,
    couponCode,
    setCouponCode,
    couponResult,
    setCouponResult,
    clearCoupon,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Country: "",
    FirstName: "",
    LastName: "",
    Address: "",
    Email: user?.email || "",
    Phone: "",
    OrderNotes: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const total = cart.total;
  const finalTotal = couponResult?.valid ? couponResult.finalTotal : total;

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      alert("Please enter a coupon code.");
      return;
    }
    try {
      const result = await CartAPI.validateCoupon(code);
      setCouponResult(result);
    } catch (e) {
      setError(e.message);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const order = await CartAPI.placeOrder({
        firstName: form.FirstName,
        lastName: form.LastName,
        address: form.Address,
        email: form.Email,
        phone: form.Phone,
        country: form.Country,
        orderNotes: form.OrderNotes,
        couponCode: couponResult?.valid ? couponCode : undefined,
      });
      await refresh();
      clearCoupon();
      navigate("/order-confirmation", { state: { order } });
    } catch (e) {
      setError(e.message);
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="untree_co-section container py-5 text-center">
        <p>Your cart is empty — nothing to check out yet.</p>
        <Link to="/shop" className="btn btn-black">
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Checkout</h1>
              </div>
            </div>
            <div className="col-lg-7"></div>
          </div>
        </div>
      </div>

      <div className="untree_co-section">
        <div className="container">
          {!user && (
            <div className="row mb-5">
              <div className="col-md-12">
                <div className="border p-4 rounded" role="alert">
                  Returning customer? <Link to="/login">Click here</Link> to
                  login
                </div>
              </div>
            </div>
          )}

          <ErrorAlert message={error} />

          <form onSubmit={handlePlaceOrder}>
            <div className="row">
              <div className="col-md-6 mb-5 mb-md-0">
                <h2 className="h3 mb-3 text-black">Billing Details</h2>
                <div className="p-3 p-lg-5 border bg-white">
                  <div className="form-group">
                    <label htmlFor="c_country" className="text-black">
                      Country <span className="text-danger">*</span>
                    </label>
                    <select
                      id="c_country"
                      className="form-control"
                      value={form.Country}
                      onChange={update("Country")}
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-6">
                      <label htmlFor="c_fname" className="text-black">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_fname"
                        required
                        value={form.FirstName}
                        onChange={update("FirstName")}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="c_lname" className="text-black">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_lname"
                        required
                        value={form.LastName}
                        onChange={update("LastName")}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-12">
                      <label htmlFor="c_address" className="text-black">
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_address"
                        placeholder="Street address"
                        required
                        value={form.Address}
                        onChange={update("Address")}
                      />
                    </div>
                  </div>

                  <div className="form-group row mb-5">
                    <div className="col-md-6">
                      <label htmlFor="c_email_address" className="text-black">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="c_email_address"
                        required
                        value={form.Email}
                        onChange={update("Email")}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="c_phone" className="text-black">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="c_phone"
                        placeholder="Phone Number"
                        required
                        value={form.Phone}
                        onChange={update("Phone")}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="c_order_notes" className="text-black">
                      Order Notes
                    </label>
                    <textarea
                      id="c_order_notes"
                      cols="30"
                      rows="5"
                      className="form-control"
                      placeholder="Write your notes here..."
                      value={form.OrderNotes}
                      onChange={update("OrderNotes")}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row mb-5">
                  <div className="col-md-12">
                    <h2 className="h3 mb-3 text-black">Coupon Code</h2>
                    <div className="p-3 p-lg-5 border bg-white">
                      <label htmlFor="c_code" className="text-black mb-3">
                        Enter your coupon code if you have one
                      </label>
                      <div className="input-group w-75 couponcode-wrap">
                        <input
                          type="text"
                          className="form-control me-2"
                          id="c_code"
                          placeholder="Coupon Code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponResult(null);
                          }}
                        />
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-black btn-sm"
                            onClick={handleApplyCoupon}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                      {couponResult && (
                        <p
                          className={`mt-2 ${couponResult.valid ? "text-success" : "text-danger"}`}
                        >
                          {couponResult.valid
                            ? `✅ Coupon applied! You save $${couponResult.discount.toFixed(2)}`
                            : `❌ ${couponResult.message}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mb-5">
                  <div className="col-md-12">
                    <h2 className="h3 mb-3 text-black">Your Order</h2>
                    <div className="p-3 p-lg-5 border bg-white">
                      <table className="table site-block-order-table mb-5">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                {item.productName}{" "}
                                <strong className="mx-2">x</strong>{" "}
                                {item.quantity}
                              </td>
                              <td>${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td className="text-black font-weight-bold">
                              <strong>Cart Subtotal</strong>
                            </td>
                            <td className="text-black">${total.toFixed(2)}</td>
                          </tr>
                          {couponResult?.valid && (
                            <tr>
                              <td className="text-success">
                                <strong>Discount</strong>
                              </td>
                              <td className="text-success">
                                -${couponResult.discount.toFixed(2)}
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-black font-weight-bold">
                              <strong>Order Total</strong>
                            </td>
                            <td className="text-black font-weight-bold">
                              <strong>${finalTotal.toFixed(2)}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Same non-functional payment method accordions as the original template */}
                      <div className="border p-3 mb-3">
                        <h3 className="h6 mb-0">
                          <a
                            className="d-block"
                            data-bs-toggle="collapse"
                            href="#collapsebank"
                            role="button"
                          >
                            Direct Bank Transfer
                          </a>
                        </h3>
                        <div className="collapse" id="collapsebank">
                          <div className="py-2">
                            <p className="mb-0">
                              Make your payment directly into our bank account.
                              Please use your Order ID as the payment reference.
                              Your order won't be shipped until the funds have
                              cleared in our account.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border p-3 mb-3">
                        <h3 className="h6 mb-0">
                          <a
                            className="d-block"
                            data-bs-toggle="collapse"
                            href="#collapsecheque"
                            role="button"
                          >
                            Cheque Payment
                          </a>
                        </h3>
                        <div className="collapse" id="collapsecheque">
                          <div className="py-2">
                            <p className="mb-0">
                              Make your payment directly into our bank account.
                              Please use your Order ID as the payment reference.
                              Your order won't be shipped until the funds have
                              cleared in our account.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border p-3 mb-5">
                        <h3 className="h6 mb-0">
                          <a
                            className="d-block"
                            data-bs-toggle="collapse"
                            href="#collapsepaypal"
                            role="button"
                          >
                            Paypal
                          </a>
                        </h3>
                        <div className="collapse" id="collapsepaypal">
                          <div className="py-2">
                            <p className="mb-0">
                              Make your payment directly into our bank account.
                              Please use your Order ID as the payment reference.
                              Your order won't be shipped until the funds have
                              cleared in our account.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <button
                          type="submit"
                          className="btn btn-black btn-lg py-3 btn-block"
                          disabled={placing}
                        >
                          {placing ? "Placing order…" : "Place Order"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
