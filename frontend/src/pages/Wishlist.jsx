import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Wishlist() {
  const { loggedIn, wishlist, removeFromWishlist, addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.name);
    alert(`${item.name} moved to Cart! 🛒`);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto', padding: '40px 30px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#2d2215' }}>♡ My Wishlist</h1>
        <button className="back-btn" onClick={() => navigate('/home')}>← Back to Shopping</button>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#888', marginBottom: '20px' }}>Your wishlist is empty ♡</h2>
          <button className="primary-btn" style={{ width: '220px' }} onClick={() => navigate('/home')}>Explore Products</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '25px'
        }}>
          {wishlist.map((item, i) => (
            <div key={i} className="card">
              <img src={item.image} alt={item.name} />
              <div className="info">
                <h2 style={{ fontSize: '22px', margin: '5px 0', color: '#2d2215' }}>{item.name}</h2>
                <div className="price">{item.price}</div>
                <div className="shop">
                  <span>Royal Rentals</span>
                  <span>Bangalore</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button 
                    className="primary-btn"
                    style={{ flex: 2, marginTop: 0 }}
                    onClick={() => handleMoveToCart(item)}
                  >
                    🛒 Move to Cart
                  </button>
                  <button
                    onClick={() => {
                      removeFromWishlist(item.name);
                      alert(`${item.name} removed from wishlist ❤️`);
                    }}
                    style={{
                      flex: 1,
                      border: '1.5px solid red',
                      background: 'transparent',
                      color: 'red',
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
