import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Orders() {
  const { loggedIn, orders, setOrders } = useContext(AppContext);
  const navigate = useNavigate();

  // Review states
  const [reviewText, setReviewText] = useState({});
  const [reviewRating, setReviewRating] = useState({});
  const [activeReviewId, setActiveReviewId] = useState(null);

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  const handleReviewSubmit = (idx) => {
    const text = reviewText[idx] || "";
    const rating = reviewRating[idx] || "5";

    if (!text.trim()) {
      alert("Please write a review comment! ⚠️");
      return;
    }

    setOrders((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        reviewSubmitted: true,
        reviewDetails: { text, rating }
      };
      return copy;
    });

    alert("Review submitted successfully! Thank you for your feedback! ⭐");
    setActiveReviewId(null);
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '40px 30px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#2d2215' }}>📦 Order History</h1>
        <button className="back-btn" onClick={() => navigate('/home')}>← Back to Home</button>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '18px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#888', marginBottom: '20px' }}>No orders placed yet 📦</h2>
          <button className="primary-btn" style={{ width: '220px' }} onClick={() => navigate('/home')}>Explore Catalog</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order, idx) => {
            const isPending = !order.status || order.status === 'Pending';
            return (
              <div key={idx} style={{
                background: 'white',
                padding: '25px',
                borderRadius: '18px',
                boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                gap: '25px',
                alignItems: 'center',
                borderLeft: isPending ? '5px solid #f39c12' : '5px solid #2ecc71'
              }}>
                <img src={order.image} alt={order.name} style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '12px' }} />
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '22px', color: '#2d2215', margin: 0 }}>{order.name}</h3>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      background: isPending ? '#fef5e7' : '#ebf5fb',
                      color: isPending ? '#e67e22' : '#2980b9'
                    }}>
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div style={{ color: '#8b6837', fontWeight: 'bold', fontSize: '18px', margin: '8px 0' }}>{order.price}</div>
                  
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', fontSize: '13px', color: '#777', textTransform: 'capitalize' }}>
                    <span><b>Type:</b> {order.item}</span>
                    <span>•</span>
                    <span><b>Seller:</b> {order.seller || 'Royal Rentals'}</span>
                  </div>

                  {/* REVIEW ACTIONS */}
                  <div style={{ marginTop: '15px' }}>
                    {order.reviewSubmitted ? (
                      <div style={{ background: '#fcf8f2', padding: '12px 18px', borderRadius: '8px', border: '1.5px solid rgba(139, 104, 55, 0.1)', fontSize: '13px' }}>
                        <span style={{ color: '#e67e22', fontWeight: 'bold', marginRight: '10px' }}>
                          ⭐ {order.reviewDetails?.rating} / 5
                        </span>
                        <span style={{ fontStyle: 'italic', color: '#555' }}>
                          "{order.reviewDetails?.text}"
                        </span>
                      </div>
                    ) : (
                      activeReviewId === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span>Rating:</span>
                            <select
                              value={reviewRating[idx] || "5"}
                              onChange={(e) => setReviewRating({ ...reviewRating, [idx]: e.target.value })}
                              style={{ width: '80px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                            >
                              <option value="5">5 Stars</option>
                              <option value="4">4 Stars</option>
                              <option value="3">3 Stars</option>
                              <option value="2">2 Stars</option>
                              <option value="1">1 Star</option>
                            </select>
                          </div>
                          <textarea
                            placeholder="Write your feedback..."
                            value={reviewText[idx] || ""}
                            onChange={(e) => setReviewText({ ...reviewText, [idx]: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', outline: 'none' }}
                          />
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleReviewSubmit(idx)}
                              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => setActiveReviewId(null)}
                              style={{ background: 'transparent', color: '#555', border: '1px solid #ccc', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReviewId(idx)}
                          style={{
                            background: 'transparent',
                            border: '1.5px solid #8b6837',
                            color: '#8b6837',
                            padding: '6px 15px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '13px',
                            transition: '0.2s'
                          }}
                          onMouseOver={(e) => { e.target.style.background = '#8b6837'; e.target.style.color = 'white'; }}
                          onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#8b6837'; }}
                        >
                          ⭐ Write a Review
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
