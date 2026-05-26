import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function ProductDetails() {
  const { loggedIn, addToCart, addToWishlist, wishlist, removeFromWishlist, saveOrderLocal, syncOrderWithBackend } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Retrieve parameters
  const itemType = searchParams.get("item") || "rental";
  const itemId = searchParams.get("id") || "1";
  const productName = searchParams.get("product") || "Elegant Collection";
  const productImg = searchParams.get("img") || "ethnic-sarees.png";
  const priceTag = searchParams.get("price") || "₹80/hour";

  // State managers
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalPriceMsg, setTotalPriceMsg] = useState("");
  const [priceColor, setPriceColor] = useState("red");
  
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStatus, setSizeStatus] = useState("");
  const [sizeColor, setSizeColor] = useState("red");

  const [paymentSelected, setPaymentSelected] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [qrString, setQrString] = useState("");
  const [showQr, setShowQr] = useState(false);

  const [expandedReviews, setExpandedReviews] = useState(false);

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  // Is already in wishlist check
  const isWishlisted = wishlist.some(i => i.name === productName);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(productName);
      alert(`${productName} removed from wishlist ❤️`);
    } else {
      addToWishlist({
        name: productName,
        image: productImg,
        price: priceTag,
        item: itemType,
        id: itemId
      });
      alert(`${productName} added to wishlist ❤️`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out this rental on Vivienne: ${productName}`,
        url: window.location.href
      });
    } else {
      alert(`Copied link to clipboard:\n${window.location.href}`);
    }
  };

  // Pricing calculator
  const calculateTotalPrice = () => {
    if (!fromDate || !toDate) {
      setTotalPriceMsg("❌ Please select valid dates");
      setPriceColor("red");
      return;
    }
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = (to - from) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      setTotalPriceMsg("❌ Invalid dates. 'To' date cannot be before 'From' date");
      setPriceColor("red");
      return;
    }

    const blockedDates = [5, 12, 18];
    if (blockedDates.includes(from.getDate())) {
      setTotalPriceMsg("❌ Sorry, outfit unavailable during selected dates");
      setPriceColor("red");
      return;
    }

    const pricePerHour = parseInt(priceTag.replace(/[^0-9]/g, '')) || 80;
    const total = diff === 0 ? pricePerHour * 24 : diff * 24 * pricePerHour;

    setTotalPriceMsg(`Available for rent! Total Price: ₹${total}`);
    setPriceColor("green");
  };

  // Size handler
  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const unavailableSizes = ["XS", "XXXL"];
    if (unavailableSizes.includes(size)) {
      setSizeStatus("❌ Sorry, this size is currently unavailable");
      setSizeColor("red");
    } else {
      setSizeStatus("✅ Size available for booking");
      setSizeColor("green");
    }
  };

  // Payment Selection UPI generator
  const handlePaymentSelect = (method) => {
    setPaymentSelected(true);
    setPaymentMethod(method);
    if (method === 'UPI') {
      let amount = priceTag.replace(/[^0-9]/g, '');
      if (!amount || amount === "0") amount = "500";
      
      const shopName = "Royal Rentals";
      const upiLink = `upi://pay?pa=royalrentals@upi&pn=${encodeURIComponent(shopName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(productName)}`;
      setQrString(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiLink)}`);
      setShowQr(true);
    } else {
      setShowQr(false);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!paymentSelected) {
      alert("Please select a payment option before placing your order! ⚠️");
      return;
    }

    const orderObj = {
      name: productName,
      image: productImg,
      price: priceTag,
      item: itemType,
      id: itemId,
      seller: "Royal Rentals",
      reviewSubmitted: false
    };

    // Save locally
    saveOrderLocal(orderObj);

    // Sync to backend DB
    const res = await syncOrderWithBackend(orderObj);
    alert("Order placed successfully ✅");
    navigate('/orders');
  };

  const handleAddToCart = () => {
    addToCart({
      name: productName,
      image: productImg,
      price: priceTag,
      item: itemType,
      id: itemId
    });
    alert(`${productName} added to cart ✅`);
  };

  // Mock Reviews
  const reviews = [
    { rating: "⭐ 4.9", name: "Aarav Sharma", text: "Absolutely loved the quality. The outfit looked premium and the fitting was perfect. Delivery was also very quick." },
    { rating: "⭐ 4.8", name: "Priya Mehta", text: "Very elegant and clean product. Looked exactly like the images shown on the website." },
    { rating: "⭐ 5.0", name: "Riya Kapoor", text: "Received many compliments while wearing this. Definitely worth renting again." },
    { rating: "⭐ 4.7", name: "Ananya Rao", text: "Fabric quality was excellent and packaging was neat. Great experience overall." },
    { rating: "⭐ 4.9", name: "Rahul Verma", text: "Perfect for special occasions. Stylish, comfortable and very affordable." },
    // Extra Reviews
    { rating: "⭐ 4.8", name: "Sneha Iyer", text: "Customer support was helpful and the rental process was smooth and easy." },
    { rating: "⭐ 5.0", name: "Vikram Singh", text: "Looked brand new and smelled fresh. One of the best rental products I tried." },
    { rating: "⭐ 4.6", name: "Pooja Nair", text: "Very trendy and premium looking. Friends loved the overall appearance." }
  ];

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ textAlign: 'center', padding: '35px' }}>
        <div className="title-badge" style={{
          display: 'inline-block',
          padding: '14px 28px',
          background: 'linear-gradient(45deg, #6b4f2a, #b08d57)',
          color: 'white',
          borderRadius: '40px',
          fontSize: '28px',
          fontWeight: 'bold',
          boxShadow: '0 8px 20px rgba(0,0,0,0.18)'
        }}>
          ✨ Premium Rental Collection
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: 'auto', padding: '0 30px' }}>
        <div style={{
          background: 'white',
          borderRadius: '25px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
          padding: '35px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px'
        }} className="details-container-card">
          
          <img src={productImg} alt={productName} style={{
            width: '100%',
            height: '600px',
            objectFit: 'cover',
            background: '#fafafa',
            borderRadius: '18px'
          }} />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '34px', margin: 0, color: '#2d2215', lineHeight: 1.3, flex: 1 }}>
                {productName}
              </h2>
              <div style={{ display: 'flex', gap: '18px', alignItems: 'center', paddingTop: '8px' }}>
                <span 
                  onClick={handleWishlistToggle}
                  style={{ fontSize: '24px', cursor: 'pointer', color: isWishlisted ? 'red' : '#333' }}
                >
                  {isWishlisted ? '❤️' : '♡'}
                </span>
                <span 
                  onClick={handleShare}
                  style={{ fontSize: '22px', cursor: 'pointer' }}
                >
                  🔗
                </span>
              </div>
            </div>

            <div className="price" style={{ fontSize: '30px', fontWeight: 'bold', color: '#6b4f2a', marginBottom: '20px' }}>
              <span style={{ textDecoration: 'line-through', color: 'gray', fontSize: '22px', marginRight: '15px' }}>
                ₹{parseInt(priceTag.replace(/[^0-9]/g, '')) * 1.5}/hour
              </span>
              <span>{priceTag}</span>
            </div>

            {/* RENTAL CALCULATOR */}
            <div className="info-box" style={{
              background: '#faf7f2',
              padding: '22px',
              border: '1px solid rgba(139, 104, 55, 0.1)',
              borderRadius: '16px',
              marginBottom: '18px',
              boxShadow: '0 5px 12px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Rental Duration</h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  From:
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  To:
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>
              <button className="primary-btn" onClick={calculateTotalPrice}>
                Calculate Total Price
              </button>
              {totalPriceMsg && (
                <p style={{ marginTop: '12px', fontWeight: 'bold', color: priceColor }}>
                  {totalPriceMsg}
                </p>
              )}
            </div>

            {/* SIZES */}
            {itemType !== 'jewellery' && (
              <div className="info-box" style={{
                background: '#faf7f2',
                padding: '22px',
                border: '1px solid rgba(139, 104, 55, 0.1)',
                borderRadius: '16px',
                marginBottom: '18px',
                boxShadow: '0 5px 12px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Select Size</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((sz) => (
                    <div
                      key={sz}
                      onClick={() => handleSizeClick(sz)}
                      style={{
                        padding: '10px 16px',
                        border: '1.5px solid #6b4f2a',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: '0.2s',
                        background: selectedSize === sz ? '#6b4f2a' : 'transparent',
                        color: selectedSize === sz ? 'white' : '#6b4f2a',
                        transform: selectedSize === sz ? 'scale(1.05)' : 'none',
                        boxShadow: selectedSize === sz ? '0 5px 12px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {sz}
                    </div>
                  ))}
                </div>
                {sizeStatus && (
                  <p style={{ marginTop: '12px', fontWeight: 'bold', color: sizeColor }}>
                    {sizeStatus}
                  </p>
                )}
              </div>
            )}

            <button 
              className="primary-btn" 
              onClick={handleAddToCart}
              style={{ marginTop: '20px' }}
            >
              🛒 Add To Cart
            </button>
          </div>
        </div>

        {/* PAYMENT OPTIONS */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          marginTop: '35px'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2d2215' }}>Payment Options</h2>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div
              onClick={() => handlePaymentSelect('COD')}
              style={{
                flex: 1,
                padding: '20px',
                border: paymentMethod === 'COD' ? '2.5px solid #6b4f2a' : '2px solid #ddd',
                background: paymentMethod === 'COD' ? '#faf7f2' : 'white',
                borderRadius: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              💵 Cash on Delivery
            </div>
            <div
              onClick={() => handlePaymentSelect('UPI')}
              style={{
                flex: 1,
                padding: '20px',
                border: paymentMethod === 'UPI' ? '2.5px solid #6b4f2a' : '2px solid #ddd',
                background: paymentMethod === 'UPI' ? '#faf7f2' : 'white',
                borderRadius: '15px',
                textAlign: 'center',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              📱 UPI Payment
            </div>
          </div>

          {showQr && qrString && (
            <div style={{
              display: 'block',
              textAlign: 'center',
              marginTop: '20px',
              padding: '20px',
              background: '#f9f9f9',
              borderRadius: '15px',
              border: '1.5px dashed var(--primary)'
            }}>
              <p style={{ marginBottom: '12px', fontWeight: 'bold', color: '#8b6837' }}>
                Scan QR to Pay <span style={{ textDecoration: 'underline' }}>Royal Rentals</span>
              </p>
              <img
                src={qrString}
                alt="UPI QR Code"
                style={{ borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              />
              <p style={{ marginTop: '12px', fontSize: '13px', color: 'gray' }}>
                Once complete, click the Place Order button below.
              </p>
            </div>
          )}

          <button 
            className="primary-btn" 
            onClick={handlePlaceOrder}
            style={{ marginTop: '30px' }}
          >
            Place Order
          </button>
        </div>

        {/* SHOP INFO */}
        <div className="info-box" style={{
          background: '#faf7f2',
          padding: '22px',
          border: '1px solid rgba(139, 104, 55, 0.1)',
          borderRadius: '16px',
          marginTop: '30px',
          boxShadow: '0 5px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Shop Details</h3>
          <p style={{ marginBottom: '8px' }}><b>🏪 Shop:</b> Royal Rentals</p>
          <p style={{ marginBottom: '8px' }}><b>📍 Location:</b> Bangalore</p>
          <p style={{ marginBottom: 0 }}><b>📞 Contact:</b> +91 9876543210</p>
        </div>

        {/* REVIEWS SECTION */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          marginTop: '35px'
        }}>
          <h2 style={{ marginBottom: '20px' }}>⭐ Customer Reviews</h2>
          <div>
            {reviews.map((rev, idx) => {
              if (idx >= 5 && !expandedReviews) return null;
              return (
                <div key={idx} style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b4f2a', marginBottom: '4px' }}>
                    {rev.rating}
                  </div>
                  <div style={{ fontSize: '13px', color: 'gray', marginBottom: '8px' }}>
                    {rev.name}
                  </div>
                  <div style={{ lineHeight: 1.7, fontSize: '15px' }}>
                    {rev.text}
                  </div>
                </div>
              );
            })}
          </div>

          {!expandedReviews && (
            <button
              className="primary-btn"
              onClick={() => setExpandedReviews(true)}
              style={{ marginTop: '25px' }}
            >
              Read More Reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
