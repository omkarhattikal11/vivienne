import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Home() {
  const { loggedIn, name } = useContext(AppContext);
  const navigate = useNavigate();

  // Active Menu: 'products', 'services', or 'halls'
  const [activeMenu, setActiveMenu] = useState('products');
  // Active Gender Category: 'all', 'women', 'men', or 'kids'
  const [activeGender, setActiveGender] = useState('all');
  // Active Category (loaded inside subcategory view)
  const [activeCategory, setActiveCategory] = useState('');

  // Protect route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  // Categories definitions
  const categories = {
    women: ["Ethnic Sarees", "Lehengas", "Dresses", "Kurtis", "Western Party Dresses", "Costumes", "Jewellery"],
    men: ["Sherwani", "Kurta Pajama", "Indo-Western Sets", "Formal & Party", "Dance Costume Rental", "Fancy Dress Rental", "Accessories Rental"],
    kids: ["Kids Lehenga", "Mini Sherwani", "Kids Kurta Sets", "Kids Party Wear", "Kids Fancy Dress", "Kids Dance Costume", "Kids Accessories"],
    all: [
      "Ethnic Sarees", "Lehengas", "Dresses", "Kurtis", "Western Party Dresses", "Costumes", "Jewellery",
      "Sherwani", "Kurta Pajama", "Indo-Western Sets", "Formal & Party", "Dance Costume Rental", "Fancy Dress Rental", "Accessories Rental",
      "Kids Lehenga", "Mini Sherwani", "Kids Kurta Sets", "Kids Party Wear", "Kids Fancy Dress", "Kids Dance Costume", "Kids Accessories"
    ]
  };

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

  const serviceData = {
    "Makeup/Styling": ["Bridal Makeup", "Party Makeup", "Hair Styling", "Saree Draping"],
    "Mehendi": ["Bridal Mehendi", "Arabic Mehendi", "Simple Mehendi", "Designer Mehendi"],
    "Nail Art": ["French Nail Art", "Bridal Nail Art", "Glitter Nail Art"],
    "Photoshoot": ["Pre Wedding Shoot", "Maternity Shoot", "Baby Shoot", "Fashion Shoot"]
  };

  const serviceImages = {
    "Makeup/Styling": "https://i.pinimg.com/1200x/d7/fd/b9/d7fdb98546ebc5cd304fd1dcbe05b904.jpg",
    "Mehendi": "https://i.pinimg.com/736x/07/77/00/077700a3aa7cd8a64a75c8dc8d488912.jpg",
    "Nail Art": "https://i.pinimg.com/236x/44/29/8b/44298b6d7f9e875a499626d357d55dc1.jpg",
    "Photoshoot": "https://i.pinimg.com/736x/90/42/f2/9042f27f7c56329be3235b8b25e5fd79.jpg",
    "Bridal Makeup": "https://i.pinimg.com/1200x/d7/fd/b9/d7fdb98546ebc5cd304fd1dcbe05b904.jpg",
    "Party Makeup": "https://i.pinimg.com/736x/47/45/5d/47455d3c23cd992cb50ec6c8da22a56b.jpg",
    "Hair Styling": "https://i.pinimg.com/736x/d6/8c/d0/d68cd0e70b4af2f1949d294dd2252981.jpg",
    "Saree Draping": "https://i.pinimg.com/736x/a7/12/c1/a712c1e96503d0213099c06396cdf9c3.jpg",
    "Bridal Mehendi": "https://i.pinimg.com/736x/07/77/00/077700a3aa7cd8a64a75c8dc8d488912.jpg",
    "Arabic Mehendi": "https://i.pinimg.com/1200x/38/b1/df/38b1df903853095be62f26c3ccffe6ea.jpg",
    "Simple Mehendi": "https://i.pinimg.com/736x/b0/8e/ed/b08eeddfe85ce1ad661bafc29272652f.jpg",
    "Designer Mehendi": "https://i.pinimg.com/736x/5f/5b/6b/5f5b6b438132dea924bf0422b77abbb5.jpg",
    "French Nail Art": "https://i.pinimg.com/236x/44/29/8b/44298b6d7f9e875a499626d357d55dc1.jpg",
    "Bridal Nail Art": "https://i.pinimg.com/1200x/7e/f6/87/7ef687103a7b4cf65d914887e41e6547.jpg",
    "Glitter Nail Art": "https://i.pinimg.com/736x/7a/6a/8e/7a6a8edd67be7054cb0ccb45a6d7f7f8.jpg",
    "Pre Wedding Shoot": "https://i.pinimg.com/736x/90/42/f2/9042f27f7c56329be3235b8b25e5fd79.jpg",
    "Maternity Shoot": "https://i.pinimg.com/1200x/53/98/df/5398df5b52ca1be443fb92356c74dfcf.jpg",
    "Baby Shoot": "https://i.pinimg.com/736x/73/c2/16/73c2160631ec1ae914f8460ba9f0b890.jpg",
    "Fashion Shoot": "https://i.pinimg.com/1200x/98/7f/4e/987f4eb571663a42003451a9da4ce613.jpg"
  };

  const hallData = {
    "Wedding Hall": ["Grand Wedding Hall", "Luxury Palace Hall", "Royal Marriage Hall"],
    "Birthday Hall": ["Kids Birthday Hall", "Theme Birthday Hall", "Balloon Decor Hall"],
    "Rooftop Hall": ["Open Rooftop Hall", "Luxury Rooftop Lounge", "Skyline Rooftop Venue"]
  };

  const hallImages = {
    "Wedding Hall": "https://i.pinimg.com/736x/bf/05/93/bf05936ad7de5e817a0beebfb13b2980.jpg",
    "Birthday Hall": "https://i.pinimg.com/1200x/95/e3/b7/95e3b718c171eceeef00588332a8adce.jpg",
    "Rooftop Hall": "https://i.pinimg.com/736x/d4/55/4f/d4554f46a4ed23e97f54d7ea4f29489a.jpg",
    "Grand Wedding Hall": "https://i.pinimg.com/736x/bf/05/93/bf05936ad7de5e817a0beebfb13b2980.jpg",
    "Luxury Palace Hall": "https://i.pinimg.com/736x/22/8c/9e/228c9e21c506b8dfe2deaa64585eefe1.jpg",
    "Royal Marriage Hall": "https://i.pinimg.com/736x/3d/6b/5e/3d6b5e0409a5b9cb6d4d199850a070e1.jpg",
    "Kids Birthday Hall": "https://i.pinimg.com/1200x/95/e3/b7/95e3b718c171eceeef00588332a8adce.jpg",
    "Theme Birthday Hall": "https://i.pinimg.com/1200x/6b/6e/d9/6b6ed9964081b644351418d9edb9f9cf.jpg",
    "Balloon Decor Hall": "https://i.pinimg.com/1200x/38/e3/bc/38e3bc0ce39aa1a45fee15a82ec1624f.jpg",
    "Open Rooftop Hall": "https://i.pinimg.com/736x/d4/55/4f/d4554f46a4ed23e97f54d7ea4f29489a.jpg",
    "Luxury Rooftop Lounge": "https://thumbs.dreamstime.com/b/romantic-roof-wedding-decoration-rooftop-setup-beautifully-decorated-mandap-adorned-greenery-lit-candles-set-against-405046781.jpg",
    "Skyline Rooftop Venue": "https://i.pinimg.com/736x/b4/35/a0/b435a00f8635f39367187809cfefbeae.jpg"
  };

  const getFlickrUrl = (text) => {
    let keywords = text.toLowerCase().replace(/[^a-z0-9]+/g, ',');
    return `https://loremflickr.com/400/500/${keywords},event`;
  };

  // Reset states when switching tabs
  const handleMenuSwitch = (menu) => {
    setActiveMenu(menu);
    setActiveCategory('');
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const openItemPage = (itemType, name) => {
    if (itemType === 'product') {
      navigate(`/products?q=${encodeURIComponent(name)}`);
    } else if (itemType === 'service') {
      localStorage.setItem("selectedService", name);
      navigate(`/services`);
    } else if (itemType === 'hall') {
      localStorage.setItem("selectedHall", name);
      navigate(`/halls`);
    }
  };

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <div>
          <h1>Rentals & Elegant Celebrations</h1>
          <p>Curated premium experiences for your special moments</p>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="menu">
        <button
          className={activeMenu === 'products' ? 'active-menu' : ''}
          onClick={() => handleMenuSwitch('products')}
        >
          Products
        </button>
        <button
          className={activeMenu === 'services' ? 'active-menu' : ''}
          onClick={() => handleMenuSwitch('services')}
        >
          Services
        </button>
        <button
          className={activeMenu === 'halls' ? 'active-menu' : ''}
          onClick={() => handleMenuSwitch('halls')}
        >
          Hall Bookings
        </button>
      </div>

      {/* GENDER SELECTOR (Only for Products) */}
      {activeMenu === 'products' && (
        <div className="gender">
          <button
            className={activeGender === 'all' ? 'active' : ''}
            onClick={() => { setActiveGender('all'); setActiveCategory(''); }}
          >
            All
          </button>
          <button
            className={activeGender === 'women' ? 'active' : ''}
            onClick={() => { setActiveGender('women'); setActiveCategory(''); }}
          >
            Women
          </button>
          <button
            className={activeGender === 'men' ? 'active' : ''}
            onClick={() => { setActiveGender('men'); setActiveCategory(''); }}
          >
            Men
          </button>
          <button
            className={activeGender === 'kids' ? 'active' : ''}
            onClick={() => { setActiveGender('kids'); setActiveCategory(''); }}
          >
            Kids
          </button>
        </div>
      )}

      {/* CATEGORIES SCROLL GRID */}
      <div className="category-scroll">
        {activeMenu === 'products' && (
          categories[activeGender].map((cat, i) => (
            <div key={i} className="category" onClick={() => handleCategoryClick(cat)}>
              <img src={categoryImages[cat] || getFlickrUrl(cat)} alt={cat} />
              <p>{cat}</p>
            </div>
          ))
        )}

        {activeMenu === 'services' && (
          Object.keys(serviceData).map((cat, i) => (
            <div key={i} className="category" onClick={() => handleCategoryClick(cat)}>
              <img src={serviceImages[cat] || getFlickrUrl(cat)} alt={cat} />
              <p>{cat}</p>
            </div>
          ))
        )}

        {activeMenu === 'halls' && (
          Object.keys(hallData).map((cat, i) => (
            <div key={i} className="category" onClick={() => handleCategoryClick(cat)}>
              <img src={hallImages[cat] || getFlickrUrl(cat)} alt={cat} />
              <p>{cat}</p>
            </div>
          ))
        )}
      </div>

      {/* SUBCATEGORY RENDER DRAWER */}
      {activeCategory && (
        <div>
          <h2 className="heading">⚡ Porting {activeCategory} Options</h2>
          <div className="subcategory-scroll">
            {activeMenu === 'products' && (
              // Hardcoded product options based on typeData maps in Vanilla JS
              activeCategory === "Ethnic Sarees" && ["Kanjeevaram Saree", "Banarasi Silk Saree", "Pre-Stitched Saree", "Cotton Saree", "Bridal Red Saree"].map((item, idx) => (
                <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                  <img src={categoryImages["Ethnic Sarees"]} alt={item} />
                  <h4>{item}</h4>
                </div>
              ))
            )}
            
            {activeMenu === 'products' && activeCategory === "Lehengas" && ["Mirror Work Lehenga", "Floral Embroidery Lehenga", "Royal Bridal Lehenga", "Indo-Western Lehenga", "Glitter Lehenga"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Lehengas"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Dresses" && ["Indo-Western Anarkali", "Slit Anarkali", "Gown Style Anarkali", "Mirror Work Sharara", "Jacket Style Sharara"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Dresses"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kurtis" && ["Embroidered Kurti", "Straight Kurti", "Jacket Kurti", "Palazzo Kurti Set", "Cotton Kurti"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kurtis"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Western Party Dresses" && ["Layered Gown", "Satin Gown", "Mermaid Gown", "Off-Shoulder Gown", "Mini Dress", "Bodycon Dress", "Corset Dress", "Crystal Dress", "Disco Party Dress"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Western Party Dresses"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Costumes" && ["Traditional Bharatanatyam Dress", "Anarkali Style Kathak Dress", "Retro Bollywood Outfit", "Arabian Belly Dance Dress", "Maharani Costume", "Disney Princess Inspired"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Costumes"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Jewellery" && ["Bridal Jewelry", "Temple Jewelry", "Choker", "Maang Tikka", "Hair Accessories"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Jewellery"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {/* MEN PRODUCTS */}
            {activeMenu === 'products' && activeCategory === "Sherwani" && ["Royal Wedding Sherwani", "Embroidered Sherwani", "Velvet Sherwani", "Golden Work Sherwani", "Indo-Western Sherwani", "Jacket Style Sherwani"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Sherwani"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kurta Pajama" && ["Cotton Kurta Pajama", "Silk Kurta Pajama", "Embroidered Kurta", "Diwali Kurta Set", "Eid Kurta Collection", "Jacket Kurta Set"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kurta Pajama"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Indo-Western Sets" && ["Indo-Western Jacket Set", "Draped Indo-Western Outfit", "Layered Fusion Wear", "Groom Fusion Outfit", "Reception Indo-Western"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Indo-Western Sets"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Formal & Party" && ["Satin Lapel Tuxedo", "Designer Tuxedo", "Groom Tuxedo", "Cocktail Party Tuxedo", "Reception Blazer", "Indo-Western Blazer"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Formal & Party"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Dance Costume Rental" && ["LED Dance Costume", "Crew Dance Uniform", "Retro Hero Costume", "Bhangra Costume", "Garba Outfit", "Rajasthani Folk Costume", "Punjabi Dance Outfit"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Dance Costume Rental"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Fancy Dress Rental" && ["King Costume", "Superhero Costume", "Historical Characters", "Police/Army Costume", "Movie Character Costumes"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Fancy Dress Rental"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Accessories Rental" && ["Satin Tie", "Printed Tie", "Velvet Bow Tie", "Wedding Bow Tie", "Groom Turban", "Traditional Pagdi"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Accessories Rental"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {/* KIDS PRODUCTS */}
            {activeMenu === 'products' && activeCategory === "Kids Lehenga" && ["Silk Kids Lehenga", "Embroidered Lehenga", "Floral Lehenga", "Glitter Lehenga", "Princess Style Lehenga"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Lehenga"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Mini Sherwani" && ["Royal Sherwani", "Velvet Sherwani", "Indo-Western Sherwani", "Reception Sherwani", "Jacket Style Sherwani"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Mini Sherwani"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kids Kurta Sets" && ["Cotton Kurta Pajama", "Silk Kurta Set", "Diwali Kurta Set", "Eid Kurta Collection", "Jacket Kurta Set"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Kurta Sets"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kids Party Wear" && ["Cinderella Gown", "Barbie Princess Dress", "Party Blazer Set", "Bow Tie Outfit"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Party Wear"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kids Fancy Dress" && ["Freedom Fighter", "Professional Costume", "Animal Costumes", "Cartoon Character"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Fancy Dress"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kids Dance Costume" && ["Group Dance Costume", "LED Dance Costume", "Traditional Bharatanatyam Dress", "Freestyle Dance Costume", "Retro Theme"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Dance Costume"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {activeMenu === 'products' && activeCategory === "Kids Accessories" && ["Princess Crown", "Fairy Wings", "Butterfly Wings", "Magic Stick", "Hats"].map((item, idx) => (
              <div key={idx} className="sub-card" onClick={() => openItemPage('product', item)}>
                <img src={categoryImages["Kids Accessories"]} alt={item} />
                <h4>{item}</h4>
              </div>
            ))}

            {/* SERVICES IN HOME */}
            {activeMenu === 'services' && serviceData[activeCategory] && (
              serviceData[activeCategory].map((serviceItem, idx) => (
                <div key={idx} className="sub-card" onClick={() => openItemPage('service', serviceItem)}>
                  <img src={serviceImages[serviceItem] || getFlickrUrl(serviceItem)} alt={serviceItem} />
                  <h4>{serviceItem}</h4>
                </div>
              ))
            )}

            {/* HALLS IN HOME */}
            {activeMenu === 'halls' && hallData[activeCategory] && (
              hallData[activeCategory].map((hallItem, idx) => (
                <div key={idx} className="sub-card" onClick={() => openItemPage('hall', hallItem)}>
                  <img src={hallImages[hallItem] || getFlickrUrl(hallItem)} alt={hallItem} />
                  <h4>{hallItem}</h4>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
