import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { productsData } from '../data/productsData';

export default function ProductListing() {
  const { loggedIn, name } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("q") || "Product";

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  // Primary image mappings (exactly as in home.html categoryImages)
  const categoryImages = {
    "Ethnic Sarees": "https://i.pinimg.com/736x/ef/94/6d/ef946dba46345d75a7e1c85409e62cce.jpg",
    "Lehengas": "https://i.pinimg.com/1200x/6b/36/ee/6b36eeaaf9e3ed6493547440ca2932ca.jpg",
    "Dresses": "https://i.pinimg.com/736x/80/09/2a/80092a3e430a331fadf7ecea6389e8d5.jpg",
    "Kurtis": "https://i.pinimg.com/736x/36/1c/04/361c04217b4df6cc2e96a4b80606f250.jpg",
    "Western Party Dresses": "https://i.pinimg.com/1200x/5d/99/90/5d99908d189cd9bbeff3ad0e95b8a934.jpg",
    "Costumes": "https://i.pinimg.com/1200x/24/66/6e/24666e22756b566e0b0e7fb6b42a17a1.jpg",
    "Jewellery": "https://i.pinimg.com/736x/65/bd/3f/65bd3f4a37e9bbb8b8e53f26c9323cb6.jpg",
    "Sherwani": "https://i.pinimg.com/736x/75/ab/e6/75abe608f62d47ff2d39e45ca0f03afc.jpg",
    "Kurta Pajama": "https://manyavar.scene7.com/is/image/manyavar/SKS0744-304-Fawn-101_18-11-2025-08-44:894x1263?&dpr=on,2",
    "Indo-Western Sets": "https://i.pinimg.com/736x/2c/f2/09/2cf2091b6b0a327c61d924aba4422361.jpg",
    "Formal & Party": "https://i.pinimg.com/736x/fc/09/4d/fc094d594c2d2f93dcda72a6b53ed6f2.jpg",
    "Dance Costume Rental": "https://i.pinimg.com/736x/ec/74/5f/ec745f1fa9fc78eb623df40540652191.jpg",
    "Fancy Dress Rental": "https://i.pinimg.com/1200x/be/b6/27/beb627d1e055bf94e652fd570412f44a.jpg",
    "Accessories Rental": "https://i.pinimg.com/736x/66/5d/6b/665d6b61a1276723092e09a83208e027.jpg",
    "Kids Lehenga": "https://i.pinimg.com/736x/6c/7f/59/6c7f597ff6a5159ccc0bb3e9c7200578.jpg",
    "Mini Sherwani": "https://i.pinimg.com/1200x/07/03/f6/0703f625388dc3f2b157bfaf29014b8f.jpg",
    "Kids Kurta Sets": "https://i.pinimg.com/736x/30/c8/f2/30c8f25146182950a3a7ac211d9c0910.jpg",
    "Kids Party Wear": "https://i.pinimg.com/736x/e4/ea/40/e4ea402d9eec1b949aabf25b820b9e60.jpg",
    "Kids Fancy Dress": "https://i.pinimg.com/736x/77/ac/46/77ac46098c2fa055d384410783116ba4.jpg",
    "Kids Dance Costume": "https://i.pinimg.com/736x/29/f1/02/29f1023acca2dfdd3b0870a71a57adc5.jpg",
    "Kids Accessories": "https://i.pinimg.com/736x/98/e4/2e/98e42ed47a3c193e588ef5a0dfff8361.jpg"
  };

  // Determine fallback image mapping based on search term
  const getFallbackImage = () => {
    // Try to find direct match in productsData or categoryImages keys
    const match = Object.keys(categoryImages).find(k => searchQuery.toLowerCase().includes(k.toLowerCase())) || "Ethnic Sarees";
    return categoryImages[match];
  };

  const currentFallback = getFallbackImage();

  // Load arrays for this product query or fallback securely
  const getProductLists = () => {
    // Try exact matches in our parsed JSON
    const matched = Object.keys(productsData).find(
      key => key.toLowerCase() === searchQuery.toLowerCase()
    );

    if (matched && productsData[matched]) {
      return {
        best: productsData[matched].bestImages,
        more: productsData[matched].moreImages
      };
    }

    // Fallback if not specifically mapped
    return {
      best: [currentFallback, currentFallback],
      more: [currentFallback, currentFallback, currentFallback, currentFallback]
    };
  };

  const { best, more } = getProductLists();

  const handleCardClick = (imgUrl, idx, priceTag) => {
    // Maps standard variables matching Vanilla details page parameters
    const safeProduct = encodeURIComponent(searchQuery);
    const safeImg = encodeURIComponent(imgUrl);
    const safePrice = encodeURIComponent(priceTag);

    navigate(`/product-details?item=rental&id=${idx}&product=${safeProduct}&img=${safeImg}&price=${safePrice}`);
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px 40px 10px 40px', alignItems: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#2d2215' }}>
          🔥 Best Selling {searchQuery}
        </h1>
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
      </div>

      {/* BEST SELLING GRID */}
      <div className="products-grid">
        {best.map((imgUrl, i) => {
          const price = `₹${100 + (i + 1) * 50}/hour`;
          return (
            <div key={i} className="card">
              <img src={imgUrl} alt={`${searchQuery} best seller`} />
              <div className="info">
                <div className="rating">
                  ⭐ 4.9 | {150 + (i + 1) * 25} Reviews
                </div>
                <h2 style={{ fontSize: '22px', margin: '5px 0' }}>{searchQuery}</h2>
                <div className="price">{price}</div>
                <div className="shop">
                  <span>Royal Rentals</span>
                  <span>Bangalore</span>
                </div>
                <button 
                  className="btn"
                  onClick={() => handleCardClick(imgUrl, i + 1, price)}
                >
                  Rent Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h1 className="heading">
        ✨ {name || "User"}, You May Also Like
      </h1>

      {/* MORE RECOMMENDATIONS GRID */}
      <div className="products-grid">
        {more.map((imgUrl, i) => {
          const price = `₹${80 + (i + 1) * 40}/hour`;
          return (
            <div key={i} className="card">
              <img src={imgUrl} alt={`${searchQuery} suggestion`} />
              <div className="info">
                <div className="rating">
                  ⭐ 4.7 | {90 + (i + 1) * 15} Reviews
                </div>
                <h2 style={{ fontSize: '22px', margin: '5px 0' }}>{searchQuery}</h2>
                <div className="price">{price}</div>
                <div className="shop">
                  <span>Royal Rentals</span>
                  <span>Bangalore</span>
                </div>
                <button 
                  className="btn"
                  onClick={() => handleCardClick(imgUrl, i + 10, price)}
                >
                  Rent Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
