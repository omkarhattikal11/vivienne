import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Cart() {
  const { loggedIn, cart, removeFromCart, clearCart, addToWishlist, saveOrderLocal, syncOrderWithBackend } = useContext(AppContext);
  const navigate = useNavigate();

  const [paymentSelected, setPaymentSelected] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrString, setQrString] = useState("");
  const [showQr, setShowQr] = useState(false);

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const amt = parseInt(item.price.replace(/[^0-9]/g, '')) || 0;
      return acc + amt;
    }, 0);
  };

  const handleMoveToWishlist = (item, idx) => {
    addToWishlist(item);
    removeFromCart(idx);
    alert(`${item.name} moved to Wishlist ❤️`);
  };

  const handlePaymentSelect = (method) => {
    setPaymentSelected(true);
    setPaymentMethod(method);
    if (method === 'UPI') {
      const amount = calculateTotal();
      const shopName = "Royal Rentals";
      const upiLink = `upi://pay?pa=royalrentals@upi&pn=${encodeURIComponent(shopName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Cart Checkout")}`;
      setQrString(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`);
      setShowQr(true);
    } else {
      setShowQr(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (!paymentSelected) {
      alert("Please select a payment option before placing your order! ⚠️");
      return;
    }

    // Checkout all items
    for (let item of cart) {
      const orderObj = {
        name: item.name,
        image: item.image,
        price: item.price,
        item: item.item,
        id: item.id,
        seller: "Royal Rentals",
        reviewSubmitted: false
      };
      saveOrderLocal(orderObj);
      await syncOrderWithBackend(orderObj);
    }

    clearCart();
    alert("All orders in cart placed successfully ✅");
    navigate('/orders');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '40px 30px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#2d2215' }}>🛒 Shopping Cart</h1>
        <button className="back-btn" onClick={() => navigate('/home')}>← Back to Shopping</button>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#888', marginBottom: '20px' }}>Your cart is empty 💨</h2>
          <button className="primary-btn" style={{ width: '220px' }} onClick={() => navigate('/home')}>Explore Products</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="cart-grid-columns">
          {/* ITEMS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '18px',
                boxShadow: '0 6px 15px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '20px',
                alignItems: 'center'
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '20px', color: '#2d2215', marginBottom: '6px' }}>{item.name}</h3>
                  <div style={{ color: '#8b6837', fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>{item.price}</div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      onClick={() => handleMoveToWishlist(item, idx)}
                      style={{ background: 'transparent', border: 'none', color: '#6b4f2a', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ♡ Move to Wishlist
                    </button>
                    <button
                      onClick={() => removeFromCart(idx)}
                      style={{ background: 'transparent', border: 'none', color: 'red', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SUMMARY PANEL */}
          <div>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#2d2215' }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '12px', color: '#666' }}>
                <span>Subtotal Items:</span>
                <span>{cart.length}</span>
              </div>
              <hr style={{ border: 'none', borderBottom: '1px solid #eee', margin: '15px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '22px', fontWeight: 'bold', color: '#8b6837', marginBottom: '20px' }}>
                <span>Total Amount:</span>
                <span>₹{calculateTotal()}</span>
              </div>

              {/* PAYMENT PANEL */}
              <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div
                  onClick={() => handlePaymentSelect('COD')}
                  style={{
                    padding: '12px',
                    border: paymentMethod === 'COD' ? '2.5px solid #6b4f2a' : '1.5px solid #ddd',
                    background: paymentMethod === 'COD' ? '#faf7f2' : 'white',
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  💵 Cash on Delivery
                </div>
                <div
                  onClick={() => handlePaymentSelect('UPI')}
                  style={{
                    padding: '12px',
                    border: paymentMethod === 'UPI' ? '2.5px solid #6b4f2a' : '1.5px solid #ddd',
                    background: paymentMethod === 'UPI' ? '#faf7f2' : 'white',
                    borderRadius: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  📱 UPI Payment
                </div>
              </div>

              {showQr && qrString && (
                <div style={{
                  textAlign: 'center',
                  padding: '15px',
                  background: '#f9f9f9',
                  borderRadius: '12px',
                  border: '1.5px dashed var(--primary)',
                  marginBottom: '20px'
                }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#8b6837', fontSize: '13px' }}>Scan QR to Pay</p>
                  <img src={qrString} alt="UPI QR Code" style={{ width: '120px', height: '120px', borderRadius: '8px' }} />
                  <p style={{ marginTop: '8px', fontSize: '11px', color: 'gray' }}>Place order after payment.</p>
                </div>
              )}

              <button className="primary-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
