import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function AdminDashboard() {
  const { loggedIn, role, name } = useContext(AppContext);
  const navigate = useNavigate();

  // Tab State: 'dashboard' | 'add-product' | 'manage-products' | 'orders'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Backend state arrays
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Add Product form states
  const [prodName, setProdName] = useState('');
  const [prodCat, setProdCat] = useState('Ethnic Sarees');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Protect and authorize route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }
    if (role !== 'seller') {
      alert("Unauthorized Access. Only sellers can view this page.");
      navigate('/home');
    }
  }, [loggedIn, role, navigate]);

  // Fetch API lists
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5500/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Fetch products error:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5500/api/orders?seller_name=${encodeURIComponent(name || "")}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error("Fetch orders error:", e);
    }
  };

  useEffect(() => {
    if (loggedIn && role === 'seller') {
      fetchProducts();
      fetchOrders();
    }
  }, [loggedIn, role, name]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:5500/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          category: prodCat,
          price: prodPrice,
          image_url: prodImage || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Product Added Successfully! ✅');
        setProdName('');
        setProdPrice('');
        setProdImage('');
        setActiveTab('manage-products');
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Cannot connect to server.');
    }
  };

  const handleRemoveProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        const res = await fetch(`http://127.0.0.1:5500/api/products/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          fetchProducts();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Calculate sum metric totals
  const totalRevenue = orders.reduce((acc, o) => acc + (parseInt(o.amount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div style={{ minHeight: '90vh', background: '#fcfaf7' }}>
      {/* HEADER BANNER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: '#fff',
        borderBottom: '1.5px solid #f2ece4',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <h1 style={{ fontSize: '26px', color: '#8b6837', fontWeight: 'bold' }}>👑 Shop Owner Administration Control</h1>
        <button className="back-btn" onClick={() => navigate('/home')}>← Go to Storefront</button>
      </div>

      <div style={{ display: 'flex', minHeight: '80vh' }} className="admin-dashboard-container">
        {/* SIDEBAR NAVIGATION */}
        <div style={{
          width: '240px',
          background: 'white',
          borderRight: '1.5px solid #f2ece4',
          padding: '30px 15px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }} className="admin-sidebar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`nav-btn ${activeTab === 'dashboard' ? 'active-menu' : ''}`}
            style={{ width: '100%', borderRadius: '10px', textAlign: 'left', paddingLeft: '20px', border: activeTab === 'dashboard' ? 'none' : '1px solid #eaddcc' }}
          >
            📈 Overview
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`nav-btn ${activeTab === 'add-product' ? 'active-menu' : ''}`}
            style={{ width: '100%', borderRadius: '10px', textAlign: 'left', paddingLeft: '20px', border: activeTab === 'add-product' ? 'none' : '1px solid #eaddcc' }}
          >
            ➕ Add Product
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            className={`nav-btn ${activeTab === 'manage-products' ? 'active-menu' : ''}`}
            style={{ width: '100%', borderRadius: '10px', textAlign: 'left', paddingLeft: '20px', border: activeTab === 'manage-products' ? 'none' : '1px solid #eaddcc' }}
          >
            🛠️ Manage
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`nav-btn ${activeTab === 'orders' ? 'active-menu' : ''}`}
            style={{ width: '100%', borderRadius: '10px', textAlign: 'left', paddingLeft: '20px', border: activeTab === 'orders' ? 'none' : '1px solid #eaddcc' }}
          >
            📦 Recent Orders
          </button>
        </div>

        {/* MAIN PANEL CONTENT */}
        <div style={{ flex: 1, padding: '40px' }} className="admin-content-area">
          {/* TAB 1: DASHBOARD METRICS */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ fontSize: '28px', color: '#2d2215', marginBottom: '25px' }}>Store Overview & Analytics</h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #2ecc71' }}>
                  <h3 style={{ fontSize: '15px', color: '#888', marginBottom: '10px' }}>Total Sales (Dynamic)</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b6837', margin: 0 }}>₹{totalRevenue}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #f1c40f' }}>
                  <h3 style={{ fontSize: '15px', color: '#888', marginBottom: '10px' }}>Pending Orders</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b6837', margin: 0 }}>{pendingOrders}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #8b6837' }}>
                  <h3 style={{ fontSize: '15px', color: '#888', marginBottom: '10px' }}>Catalog Products</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b6837', margin: 0 }}>{products.length + 117}</p>
                </div>
                <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 5px 15px rgba(0,0,0,0.04)', borderTop: '4px solid #3498db' }}>
                  <h3 style={{ fontSize: '15px', color: '#888', marginBottom: '10px' }}>Client Accounts</h3>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b6837', margin: 0 }}>342</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '18px', boxShadow: '0 6px 20px rgba(0,0,0,0.04)', maxWidth: '700px' }}>
              <h2 style={{ fontSize: '24px', color: '#2d2215', marginBottom: '25px' }}>Add New Rental Product</h2>
              <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Red Bridal Lehenga"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                  >
                    <optgroup label="Women">
                      <option value="Ethnic Sarees">Ethnic Sarees</option>
                      <option value="Lehengas">Lehengas</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Kurtis">Kurtis</option>
                      <option value="Western Party Dresses">Western Party Dresses</option>
                      <option value="Costumes">Costumes</option>
                      <option value="Jewellery">Jewellery</option>
                    </optgroup>
                    <optgroup label="Men">
                      <option value="Sherwani">Sherwani</option>
                      <option value="Kurta Pajama">Kurta Pajama</option>
                      <option value="Indo-Western Sets">Indo-Western Sets</option>
                      <option value="Formal & Party">Formal & Party</option>
                      <option value="Dance Costume Rental">Dance Costume Rental</option>
                      <option value="Fancy Dress Rental">Fancy Dress Rental</option>
                      <option value="Accessories Rental">Accessories Rental</option>
                    </optgroup>
                    <optgroup label="Kids">
                      <option value="Kids Lehenga">Kids Lehenga</option>
                      <option value="Mini Sherwani">Mini Sherwani</option>
                      <option value="Kids Kurta Sets">Kids Kurta Sets</option>
                      <option value="Kids Party Wear">Kids Party Wear</option>
                      <option value="Kids Fancy Dress">Kids Fancy Dress</option>
                      <option value="Kids Dance Costume">Kids Dance Costume</option>
                      <option value="Kids Accessories">Kids Accessories</option>
                    </optgroup>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Price per hour (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 80"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="default fallback: ethnic-sarees.png"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                  />
                </div>

                <button type="submit" className="primary-btn" style={{ marginTop: '10px' }}>Add Product</button>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE PRODUCTS */}
          {activeTab === 'manage-products' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '18px', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '24px', color: '#2d2215', marginBottom: '20px' }}>Manage Catalog</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1.5px solid #eee' }}>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Product Name</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Price (₹)</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{p.name}</td>
                      <td style={{ padding: '15px' }}>{p.category}</td>
                      <td style={{ padding: '15px' }}>₹{p.price}</td>
                      <td style={{ padding: '15px' }}>
                        <button
                          onClick={() => handleRemoveProduct(p._id)}
                          style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div style={{ background: 'white', padding: '30px', borderRadius: '18px', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '24px', color: '#2d2215', marginBottom: '20px' }}>Customer Transactions</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1.5px solid #eee' }}>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Order ID</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Item Name</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '15px', color: '#8b6837', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, idx) => {
                    const shortId = o._id ? o._id.substring(o._id.length - 4) : "0000";
                    const isCompleted = o.status.toLowerCase() === 'completed';
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px' }}>#ORD-90{shortId}</td>
                        <td style={{ padding: '15px' }}>{o.customer_name}</td>
                        <td style={{ padding: '15px' }}>{o.item_name}</td>
                        <td style={{ padding: '15px' }}>₹{o.amount}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '5px 10px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            background: isCompleted ? '#d4edda' : '#fff3cd',
                            color: isCompleted ? '#155724' : '#856404'
                          }}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
