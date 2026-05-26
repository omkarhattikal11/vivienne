import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { API_BASE_URL } from '../config';

export default function Login() {
  const { loggedIn, login } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: 'login' or 'register'
  const [mode, setMode] = useState('register');
  // Role: 'user' (customer) or 'seller'
  const [role, setRole] = useState(() => searchParams.get('type') === 'seller' ? 'seller' : 'user');

  // Input states
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sync role with query parameter
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'seller') {
      setRole('seller');
    } else {
      setRole('user');
    }
  }, [searchParams]);

  // Image slider images
  const sliderImages = [
    "https://i.pinimg.com/736x/33/95/2d/33952d048f576dbf161cdcafb4c09a0d.jpg",
    "https://i.pinimg.com/736x/34/95/87/3495876ebb5db6669f6e0b4b30541032.jpg",
    "https://i.pinimg.com/1200x/4e/94/0b/4e940bba5637210c36728346a61549ff.jpg",
    "https://i.pinimg.com/736x/f2/40/76/f240762c2bcd5306f8565366bff38809.jpg",
    "https://i.pinimg.com/736x/ad/03/b7/ad03b7efff535c7e50668680cb60eb9a.jpg",
    "https://i.pinimg.com/736x/36/4f/5b/364f5bb836076a2f3ddc6a835eb8afd7.jpg"
  ];
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (loggedIn) {
      if (role === 'seller') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [loggedIn, role, navigate]);

  // Validations
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nameInput || !emailInput || !passwordInput) {
      alert("Please fill in all fields.");
      return;
    }
    if (role === 'seller' && !phoneInput) {
      alert("Phone Number is required for Sellers.");
      return;
    }
    if (nameInput.length < 3) {
      alert("Name must contain at least 3 characters.");
      return;
    }
    if (!validateEmail(emailInput)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(passwordInput)) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
          phone: phoneInput,
          role: role
        })
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setMode('login');
      }
    } catch {
      alert("Cannot connect to server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          role: role
        })
      });
      const data = await response.json();
      if (data.success) {
        login(data.name, data.role);
        alert("Login Successful 🎉");
        if (data.role === 'seller') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert(data.message);
      }
    } catch {
      alert("Cannot connect to server.");
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'white'
    }}>
      {/* LEFT SIDE FORM PANEL */}
      <div style={{
        width: '50%',
        padding: '50px 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#fff'
      }} className="login-left-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <img
            src="https://i.pinimg.com/736x/d9/b9/93/d9b993d8eecfeb1f669f1a30f66030cb.jpg"
            alt="logo"
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b6f47', letterSpacing: '2px' }}>
            VIVIENNE
          </span>
        </div>

        {/* ROLE TOGGLE */}
        <div style={{
          display: 'flex',
          background: '#f2ece4',
          borderRadius: '30px',
          padding: '4px',
          width: '280px',
          marginBottom: '35px'
        }}>
          <button
            onClick={() => setRole('user')}
            style={{
              flex: 1,
              border: 'none',
              padding: '10px 0',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
              background: role === 'user' ? '#8b6f47' : 'transparent',
              color: role === 'user' ? 'white' : '#666'
            }}
          >
            Customer
          </button>
          <button
            onClick={() => setRole('seller')}
            style={{
              flex: 1,
              border: 'none',
              padding: '10px 0',
              borderRadius: '25px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
              background: role === 'seller' ? '#8b6f47' : 'transparent',
              color: role === 'seller' ? 'white' : '#666'
            }}
          >
            Shop Owner
          </button>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d2215', marginBottom: '8px' }}>
          {mode === 'register' ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          {mode === 'register' 
            ? `Sign up as a ${role === 'seller' ? 'Seller' : 'Customer'} to get started`
            : `Login as a ${role === 'seller' ? 'Seller' : 'Customer'} to access your dashboard`
          }
        </p>

        {/* FORMS */}
        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid #eaeaea',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email Address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1.5px solid #eaeaea',
                outline: 'none',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 45px 14px 20px',
                borderRadius: '12px',
                border: '1.5px solid #eaeaea',
                outline: 'none',
                fontSize: '15px'
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '16px',
                userSelect: 'none'
              }}
            >
              👁
            </span>
          </div>

          {mode === 'register' && role === 'seller' && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Phone Number (e.g. +919876543210)"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  border: '1.5px solid #eaeaea',
                  outline: 'none',
                  fontSize: '15px'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '14px 0',
              border: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9a7440, #8b6837)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0 5px 15px rgba(139, 104, 55, 0.2)',
              marginTop: '10px'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {mode === 'register' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#555' }}>
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setMode('login')}
                style={{ color: '#8b6f47', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login
              </span>
            </>
          ) : (
            <>
              New user?{' '}
              <span
                onClick={() => setMode('register')}
                style={{ color: '#8b6f47', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register
              </span>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE TIMED SLIDER */}
      <div className="login-right-panel" style={{
        width: '50%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img
          src={sliderImages[sliderIndex]}
          alt="Luxury Rentals Display"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.6s ease-in-out',
            opacity: 1
          }}
        />
        {/* overlay vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
        }} />
      </div>
    </div>
  );
}
