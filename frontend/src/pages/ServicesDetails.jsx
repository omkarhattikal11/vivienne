import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function ServicesDetails() {
  const { loggedIn, name, saveOrderLocal, syncOrderWithBackend } = useContext(AppContext);
  const navigate = useNavigate();

  // Selected Service
  const [selectedService, setSelectedService] = useState(() => localStorage.getItem("selectedService") || "Bridal Makeup");

  // Protect Route
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn, navigate]);

  const serviceImages = {
    "Bridal Makeup": {
      best: [
        "https://i.pinimg.com/1200x/d7/fd/b9/d7fdb98546ebc5cd304fd1dcbe05b904.jpg",
        "https://i.pinimg.com/736x/a6/4b/35/a64b35cf9670fcc0f27795ab6f1d5ee4.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/ad/0b/5c/ad0b5c036b80883268052e24dd9e57ec.jpg",
        "https://i.pinimg.com/736x/ef/d9/c6/efd9c6b927b438dfa38e4f93af6fbdbd.jpg",
        "https://i.pinimg.com/1200x/7f/82/43/7f82438e89faff34a1368f64229e5339.jpg",
        "https://i.pinimg.com/1200x/c3/bb/f8/c3bbf8ab32452d6cd3215682a7f82a35.jpg"
      ]
    },
    "Party Makeup": {
      best: [
        "https://i.pinimg.com/736x/47/45/5d/47455d3c23cd992cb50ec6c8da22a56b.jpg",
        "https://i.pinimg.com/736x/48/99/59/489959473d25020ede9221914a195cd7.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/75/4c/20/754c20edbc87ca04f7fa9ef3cef56aa5.jpg",
        "https://i.pinimg.com/736x/a2/70/81/a2708155e30e3c60b13028f83d092d94.jpg",
        "https://i.pinimg.com/736x/99/74/36/9974364bc3dabc113c9ab49b0ae5a8da.jpg",
        "https://i.pinimg.com/736x/26/87/94/268794adbad3a64da24c4c9670daf1a2.jpg"
      ]
    },
    "Hair Styling": {
      best: [
        "https://i.pinimg.com/736x/d6/8c/d0/d68cd0e70b4af2f1949d294dd2252981.jpg",
        "https://i.pinimg.com/736x/97/6f/9f/976f9fdbdd4867f6fa2ee083774c6540.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/39/25/b5/3925b56dd1c862cea11d1891b6648b67.jpg",
        "https://i.pinimg.com/1200x/24/c2/7e/24c27e653ba07450f6d004f26e21a791.jpg",
        "https://i.pinimg.com/736x/65/8e/78/658e78429285b403730cb7e59ce2e22f.jpg",
        "https://i.pinimg.com/736x/dc/62/9d/dc629d021eee2494dce3317d5c66a4f3.jpg"
      ]
    },
    "Saree Draping": {
      best: [
        "https://i.pinimg.com/736x/a7/12/c1/a712c1e96503d0213099c06396cdf9c3.jpg",
        "https://i.pinimg.com/736x/5c/48/7d/5c487dd1ff1eeb39190390a6524a7801.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/5f/2c/72/5f2c728c45c11b57ad71f26f59081b19.jpg",
        "https://i.pinimg.com/736x/8d/e9/a3/8de9a38ff81f6f630e35b7d155a541c2.jpg",
        "https://i.pinimg.com/736x/4a/74/10/4a74103303e6263abf3d82c98f03c9e4.jpg",
        "https://i.pinimg.com/1200x/f0/24/d8/f024d86c550af4a042d8105d07a00fbb.jpg"
      ]
    },
    "Bridal Mehendi": {
      best: [
        "https://i.pinimg.com/736x/07/77/00/077700a3aa7cd8a64a75c8dc8d488912.jpg",
        "https://i.pinimg.com/736x/e8/2c/ea/e82cea56d589a2dfff78a480a3c63ddf.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/13/5c/f1/135cf18c303293ec0535d2a7009c93ab.jpg",
        "https://i.pinimg.com/1200x/0d/c1/d7/0dc1d7a1137e696318292c65ae9f2be0.jpg",
        "https://i.pinimg.com/736x/f2/fc/80/f2fc80468f0dc40c1ba8a7e5a1a7b165.jpg",
        "https://i.pinimg.com/736x/15/70/55/15705528c7c3b30ca5659702da27564e.jpg"
      ]
    },
    "Arabic Mehendi": {
      best: [
        "https://i.pinimg.com/1200x/38/b1/df/38b1df903853095be62f26c3ccffe6ea.jpg",
        "https://i.pinimg.com/736x/e9/48/5e/e9485e4b725680c16be0a8e1f8cf2acc.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/b6/e3/29/b6e3295fc7b0659fe4a6ee765234269e.jpg",
        "https://i.pinimg.com/736x/82/26/a8/8226a8ab0dd361f952fa8059c7c15e77.jpg",
        "https://i.pinimg.com/736x/14/66/ee/1466ee9a7710040548c72e4578bc1120.jpg",
        "https://i.pinimg.com/736x/7a/8b/4c/7a8b4cd18237057dbc4f36f50f874c49.jpg"
      ]
    },
    "Simple Mehendi": {
      best: [
        "https://i.pinimg.com/736x/b0/8e/ed/b08eeddfe85ce1ad661bafc29272652f.jpg",
        "https://i.pinimg.com/736x/64/a2/f2/64a2f275dfafbbd56e8a03b7b36823ea.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/44/a8/3d/44a83ddeb58d0d1a1f6cd05e1ab88562.jpg",
        "https://i.pinimg.com/736x/a8/17/49/a8174924072713bb6a93ea4ca186f64b.jpg",
        "https://i.pinimg.com/736x/7b/8a/5e/7b8a5e5d0a1f14374e35f1fd2f4397a2.jpg",
        "https://i.pinimg.com/736x/56/e1/17/56e1171e0607a1fc71f0a0d49838a9d4.jpg"
      ]
    },
    "Designer Mehendi": {
      best: [
        "https://i.pinimg.com/736x/5f/5b/6b/5f5b6b438132dea924bf0422b77abbb5.jpg",
        "https://i.pinimg.com/1200x/e5/c6/bf/e5c6bfef55eaad0e172919fcbca75ff5.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/17/f7/5b/17f75b09e4bc7bfb88bc1bf556bcf90f.jpg",
        "https://i.pinimg.com/736x/fa/f9/61/faf96185c4cd7500c88c03846ec24f4c.jpg",
        "https://i.pinimg.com/736x/18/c6/cd/18c6cdca3157642d28a0809fd44a388d.jpg",
        "https://i.pinimg.com/736x/79/23/84/792384e7535e6e875a271298a058876e.jpg"
      ]
    },
    "French Nail Art": {
      best: [
        "https://i.pinimg.com/236x/44/29/8b/44298b6d7f9e875a499626d357d55dc1.jpg",
        "https://i.pinimg.com/736x/ba/37/2a/ba372a8cb12ee2a2fdce51b3964bf1c5.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/fb/a5/cb/fba5cba19866c48acd79541bb1dbdaa9.jpg",
        "https://i.pinimg.com/736x/96/a4/e3/96a4e32ec64f51e467630c6cb0d317e9.jpg",
        "https://i.pinimg.com/736x/10/40/78/1040782d40894a708bb4e768904091cc.jpg",
        "https://i.pinimg.com/736x/2b/66/ac/2b66accd7a575d238e3e8c5f1e8dba5f.jpg"
      ]
    },
    "Bridal Nail Art": {
      best: [
        "https://i.pinimg.com/1200x/7e/f6/87/7ef687103a7b4cf65d914887e41e6547.jpg",
        "https://i.pinimg.com/736x/df/e6/f7/dfe6f7857b5fa33ea546039c261e76a6.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/59/7b/4b/597b4b0577477b968ee75e2ba74cbbc6.jpg",
        "https://i.pinimg.com/736x/15/54/0a/15540a22caa1a0471fa67de39d7687e7.jpg",
        "https://i.pinimg.com/736x/61/24/8e/61248e2562992b06a986636cab335261.jpg",
        "https://i.pinimg.com/736x/94/24/08/9424080825e768daabc067e89178aa54.jpg"
      ]
    },
    "Glitter Nail Art": {
      best: [
        "https://i.pinimg.com/736x/7a/6a/8e/7a6a8edd67be7054cb0ccb45a6d7f7f8.jpg",
        "https://i.pinimg.com/1200x/9a/bb/a5/9abba5193c8cbb6610a3db6c3c3dd981.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/fe/e2/a3/fee2a31898290ee3d207a3a3200e71f1.jpg",
        "https://i.pinimg.com/1200x/fe/67/e2/fe67e245d92ccbdd2d80d3d8603bc3eb.jpg",
        "https://i.pinimg.com/736x/f2/6b/9c/f26b9c8dc0e717885a98ffcc5f7aefda.jpg",
        "https://i.pinimg.com/736x/33/ef/0d/33ef0d4391298ba99873151c70fc01b6.jpg"
      ]
    },
    "Pre Wedding Shoot": {
      best: [
        "https://i.pinimg.com/736x/90/42/f2/9042f27f7c56329be3235b8b25e5fd79.jpg",
        "https://i.pinimg.com/1200x/58/ca/21/58ca21274431b46687479ea97da5d8b6.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/6d/7b/6e/6d7b6e8c0109f0c68eabd0cea98e5639.jpg",
        "https://i.pinimg.com/736x/3b/f9/7b/3bf97b687c26dff38c8614b08b2f2e38.jpg",
        "https://i.pinimg.com/1200x/24/56/74/245674c25b786cb8f9fc1df7cdb8c98a.jpg",
        "https://i.pinimg.com/736x/8a/05/d7/8a05d7426963becad390935e26c54c61.jpg"
      ]
    },
    "Maternity Shoot": {
      best: [
        "https://i.pinimg.com/1200x/53/98/df/5398df5b52ca1be443fb92356c74dfcf.jpg",
        "https://i.pinimg.com/736x/5c/ac/2c/5cac2c65e795a8f3eeb376c75bf73342.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/01/0a/6b/010a6bf68fecbe52cdda95f76453d3f5.jpg",
        "https://i.pinimg.com/736x/77/5b/5e/775b5e5d4e9c9ac28caf03b738c7327b.jpg",
        "https://i.pinimg.com/1200x/f2/e3/42/f2e34261a627cdb438253d1c0e82f27a.jpg",
        "https://i.pinimg.com/1200x/7e/ec/76/7eec76ebd26b440585feebbb12393085.jpg"
      ]
    },
    "Baby Shoot": {
      best: [
        "https://i.pinimg.com/736x/73/c2/16/73c2160631ec1ae914f8460ba9f0b890.jpg",
        "https://i.pinimg.com/736x/24/63/8c/24638c63d6f1fe13131b6c18e1e0ee5f.jpg"
      ],
      more: [
        "https://i.pinimg.com/736x/65/3b/9a/653b9a661e1ac7397e1378420f7a0131.jpg",
        "https://i.pinimg.com/736x/18/21/7b/18217be77c1228d13fa38da703ed8785.jpg",
        "https://i.pinimg.com/736x/98/32/d7/9832d701156f23902c9d25a25edf7822.jpg",
        "https://i.pinimg.com/1200x/57/2a/db/572adb7d160b9f839f60684f39572b49.jpg"
      ]
    },
    "Fashion Shoot": {
      best: [
        "https://i.pinimg.com/1200x/98/7f/4e/987f4eb571663a42003451a9da4ce613.jpg",
        "https://i.pinimg.com/736x/39/17/eb/3917eb24090440ead0aac0c794a41806.jpg"
      ],
      more: [
        "https://i.pinimg.com/1200x/e5/2a/8f/e52a8f0cf0d68112a148e7a4316ab889.jpg",
        "https://i.pinimg.com/1200x/db/85/70/db8570e87c74f4fb6524f1e12d0dce3a.jpg",
        "https://i.pinimg.com/736x/aa/71/d6/aa71d6926437bef6d2a5d244d1e26f5d.jpg",
        "https://i.pinimg.com/736x/3c/10/74/3c1074c4d8a8308089805b97f1778244.jpg"
      ]
    }
  };

  const getServiceImages = (service) => {
    if (serviceImages[service]) {
      return [...serviceImages[service].best, ...serviceImages[service].more];
    }
    // fallback empty state
    return [];
  };

  const images = getServiceImages(selectedService);

  const handleBooking = async (imgUrl, index) => {
    const calculatedPrice = `₹${500 + index * 150}/hour`;

    const orderObj = {
      name: selectedService,
      image: imgUrl,
      price: calculatedPrice,
      item: "service",
      id: 1,
      seller: "Glow Beauty Studio",
      reviewSubmitted: false
    };

    saveOrderLocal(orderObj);
    await syncOrderWithBackend(orderObj);

    alert("Service booked successfully! ✅\nYou can view it in your Orders.");
    navigate('/orders');
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px 40px 10px 40px', alignItems: 'center' }}>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#2d2215' }}>
          {name || "User"}, Best {selectedService} Options
        </h1>
        <button className="back-btn" onClick={() => navigate('/home')}>
          ← Back to Home
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
        padding: '20px 40px'
      }}>
        {images.map((imgUrl, i) => {
          const price = `₹${500 + (i + 1) * 150}/hour`;
          return (
            <div key={i} className="card">
              <img src={imgUrl} alt={`${selectedService} Option ${i+1}`} />
              <div className="info">
                <div className="rating">
                  ⭐ 4.{i + 1} | {120 + (i + 1) * 20} Reviews
                </div>
                <h2 style={{ fontSize: '22px', margin: '5px 0' }}>{selectedService}</h2>
                <div className="price">{price}</div>
                <div className="shop">
                  <span>Glow Beauty Studio</span>
                  <span>Bangalore</span>
                </div>
                <button 
                  className="btn"
                  onClick={() => handleBooking(imgUrl, i + 1)}
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
