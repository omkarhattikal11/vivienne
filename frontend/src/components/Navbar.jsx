import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Navbar() {
  const { name, role, loggedIn, logout, cart, wishlist } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Flattened searchable list of all product types, service types, and hall types
  const searchDatabase = [
    // Categories
    "Ethnic Sarees", "Lehengas", "Dresses", "Kurtis", "Western Party Dresses", "Costumes", "Jewellery",
    "Sherwani", "Kurta Pajama", "Indo-Western Sets", "Formal & Party", "Dance Costume Rental", "Fancy Dress Rental", "Accessories Rental",
    "Kids Lehenga", "Mini Sherwani", "Kids Kurta Sets", "Kids Party Wear", "Kids Fancy Dress", "Kids Dance Costume", "Kids Accessories",
    // Products
    "Kanjeevaram Saree", "Banarasi Silk Saree", "Pre-Stitched Saree", "Cotton Saree", "Bridal Red Saree",
    "Mirror Work Lehenga", "Floral Embroidery Lehenga", "Royal Bridal Lehenga", "Indo-Western Lehenga", "Glitter Lehenga",
    "Indo-Western Anarkali", "Slit Anarkali", "Gown Style Anarkali", "Mirror Work Sharara", "Jacket Style Sharara",
    "Embroidered Kurti", "Straight Kurti", "Jacket Kurti", "Palazzo Kurti Set", "Cotton Kurti",
    "Layered Gown", "Satin Gown", "Mermaid Gown", "Off-Shoulder Gown", "Mini Dress", "Bodycon Dress", "Corset Dress", "Crystal Dress", "Disco Party Dress",
    "Traditional Bharatanatyam Dress", "Anarkali Style Kathak Dress", "Retro Bollywood Outfit", "Arabian Belly Dance Dress", "Maharani Costume", "Disney Princess Inspired",
    "Bridal Jewelry", "Temple Jewelry", "Choker", "Maang Tikka", "Hair Accessories",
    "Royal Wedding Sherwani", "Embroidered Sherwani", "Velvet Sherwani", "Golden Work Sherwani", "Indo-Western Sherwani",
    "Cotton Kurta Pajama", "Silk Kurta Pajama", "Embroidered Kurta", "Diwali Kurta Set", "Eid Kurta Collection",
    "Indo-Western Jacket Set", "Draped Indo-Western Outfit", "Layered Fusion Wear", "Groom Fusion Outfit", "Reception Indo-Western",
    "Satin Lapel Tuxedo", "Designer Tuxedo", "Groom Tuxedo", "Cocktail Party Tuxedo", "Reception Blazer",
    "LED Dance Costume", "Crew Dance Uniform", "Retro Hero Costume", "Bhangra Costume", "Garba Outfit", "Rajasthani Folk Costume", "Punjabi Dance Outfit",
    "King Costume", "Superhero Costume", "Historical Characters", "Police/Army Costume", "Movie Character Costumes",
    "Satin Tie", "Printed Tie", "Velvet Bow Tie", "Wedding Bow Tie", "Groom Turban",
    "Silk Kids Lehenga", "Embroidered Lehenga", "Floral Lehenga", "Princess Style Lehenga",
    "Royal Sherwani", "Reception Sherwani", "Jacket Style Sherwani",
    "Silk Kurta Set", "Jacket Kurta Set",
    "Cinderella Gown", "Barbie Princess Dress", "Party Blazer Set", "Bow Tie Outfit",
    "Freedom Fighter", "Professional Costume", "Animal Costumes", "Cartoon Character",
    "Group Dance Costume", "Freestyle Dance Costume", "Retro Theme",
    "Princess Crown", "Fairy Wings", "Butterfly Wings", "Magic Stick", "Hats",
    // Services
    "Bridal Makeup", "Party Makeup", "Hair Styling", "Saree Draping",
    "Bridal Mehendi", "Arabic Mehendi", "Simple Mehendi", "Designer Mehendi",
    "French Nail Art", "Bridal Nail Art", "Glitter Nail Art",
    "Pre Wedding Shoot", "Maternity Shoot", "Baby Shoot", "Fashion Shoot",
    // Halls
    "Grand Wedding Hall", "Luxury Palace Hall", "Royal Marriage Hall",
    "Kids Birthday Hall", "Theme Birthday Hall", "Balloon Decor Hall",
    "Open Rooftop Hall", "Luxury Rooftop Lounge", "Skyline Rooftop Venue"
  ];

  // Suggestions lookups
  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const inputLower = searchInput.toLowerCase();
    const uniqueMatches = [...new Set(searchDatabase)]
      .filter(item => item.toLowerCase().includes(inputLower));
    
    setSuggestions(uniqueMatches.slice(0, 8));
    setShowSuggestions(true);
  }, [searchInput]);

  // Click outside listener for suggestions list
  useEffect(() => {
    const clickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, []);

  const handleSearchTrigger = (term) => {
    const finalSearch = term || searchInput;
    if (finalSearch.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(finalSearch)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchTrigger();
    }
  };

  if (!loggedIn) return null; // Hide navigation bar in auth screen

  return (
    <div className="navbar">
      <div className="logo" onClick={() => navigate('/home')}>
        <img src="/images/logo.png" alt="Vivienne Logo" />
        VIVIENNE
      </div>

      <div className="search-box" ref={searchRef}>
        <input
          type="text"
          placeholder="Search rentals, services, or halls..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
        />
        <button onClick={() => handleSearchTrigger()}>
          🔍
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div id="suggestions" style={{ display: 'block' }}>
            {suggestions.map((match, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => {
                  setSearchInput(match);
                  handleSearchTrigger(match);
                }}
              >
                {match}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="right-nav">
        <button onClick={() => navigate('/cart')} className="nav-btn" style={{ position: 'relative' }}>
          🛒 Cart {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>{cart.length}</span>
          )}
        </button>

        <button onClick={() => navigate('/wishlist')} className="nav-btn" style={{ position: 'relative' }}>
          ♡ Wishlist {wishlist.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#8b6837',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>{wishlist.length}</span>
          )}
        </button>

        <button onClick={() => navigate('/orders')} className="nav-btn">
          📦 Orders
        </button>

        {role === 'seller' ? (
          <button onClick={() => navigate('/admin')} className="nav-btn" style={{ background: '#eaddcc' }}>
            📊 Dashboard
          </button>
        ) : (
          <button onClick={() => navigate('/login?type=seller')} className="nav-btn">
            Seller
          </button>
        )}

        <button className="nav-btn" onClick={logout}>
          Logout
        </button>

        <h3 id="username">
          Hi {name || "Guest"}
        </h3>
      </div>
    </div>
  );
}
