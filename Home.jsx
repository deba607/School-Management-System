import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const emailIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    viewBox="0 0 24 24"
    fill="#888"
    style={{ marginRight: '8px' }}
  >
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const eyeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="22"
    width="22"
    viewBox="0 0 24 24"
    fill="#888"
  >
    <path d="M12 6a9.77 9.77 0 0 0-9 6 9.77 9.77 0 0 0 18 0 9.77 9.77 0 0 0-9-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
    <circle cx="12" cy="12" r="2.5" fill="#555" />
  </svg>
);

const eyeClosedIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="22"
    width="22"
    viewBox="0 0 24 24"
    fill="#888"
  >
    <path d="M12 6c-4.97 0-9 4-9 6s4.03 6 9 6 9-4 9-6-4.03-6-9-6zm0 10c-2.21 0-4-1.79-4-4 0-.46.1-.9.27-1.3l5.03 5.03c-.4.17-.84.27-1.3.27zm3.73-1.7l-5.03-5.03c.4-.17.84-.27 1.3-.27 2.21 0 4 1.79 4 4 0 .46-.1.9-.27 1.3z" />
    <line x1="2" y1="2" x2="22" y2="22" stroke="#555" strokeWidth="2" />
  </svg>
);

const mockUsers = [
  { email: 'test@example.com', password: 'password123', name: 'Test User' },
];

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setErrorMessage('');
      navigate('/dashboard');
    } else {
      setErrorMessage('Invalid email or password.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.emailOrPhone.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      setErrorMessage('User with this email already exists.');
      return;
    }

    mockUsers.push({ name, email, password });
    setErrorMessage('');
    navigate('/dashboard');
  };

  const containerStyle = {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f4f8',
    animation: 'fadeIn 1s ease-in',
    color: '#213547',
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '0 8px',
    margin: '8px 0',
    backgroundColor: 'white',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '8px 0',
    boxSizing: 'border-box',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div style={{ minHeight: '80vh', minWidth: '80vh', backgroundColor: '#e0e7ff', paddingTop: '40px' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .password-toggle {
            cursor: pointer;
            padding: 0 8px;
            display: flex;
            align-items: center;
          }
          .email-icon {
            display: flex;
            align-items: center;
          }
        `}
      </style>
      <div style={containerStyle}>
        {isLogin ? (
          <div>
            <h1>Login</h1>
            <p>
              Don’t have an account?{' '}
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(false);
                  setErrorMessage('');
                }}
              >
                Sign up
              </span>
            </p>
            <form onSubmit={handleLoginSubmit}>
              <div style={inputWrapperStyle}>
                <span className="email-icon">{emailIcon}</span>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                  style={inputStyle}
                />
              </div>
              <div style={inputWrapperStyle}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  required
                  style={inputStyle}
                />
                <span className="password-toggle" onClick={togglePasswordVisibility} title={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? eyeIcon : eyeClosedIcon}
                </span>
              </div>
              {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
              <button type="submit" style={buttonStyle}>
                Login
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1>Create Account</h1>
            <p>
              Already have an account?{' '}
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => {
                  setIsLogin(true);
                  setErrorMessage('');
                }}
              >
                Sign in
              </span>
            </p>
            <form onSubmit={handleSignupSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                required
                style={inputStyle}
              />
              <div style={inputWrapperStyle}>
                <span className="email-icon">{emailIcon}</span>
                <input
                  type="text"
                  placeholder="Email or phone"
                  name="emailOrPhone"
                  required
                  style={inputStyle}
                />
              </div>
              <div style={inputWrapperStyle}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  required
                  style={inputStyle}
                />
                <span className="password-toggle" onClick={togglePasswordVisibility} title={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? eyeIcon : eyeClosedIcon}
                </span>
              </div>
              <div style={inputWrapperStyle}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  required
                  style={inputStyle}
                />
                <span className="password-toggle" onClick={toggleConfirmPasswordVisibility} title={showConfirmPassword ? 'Hide password' : 'Show password'}>
                  {showConfirmPassword ? eyeIcon : eyeClosedIcon}
                </span>
              </div>
              {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
              <button type="submit" style={buttonStyle}>
                Sign Up
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
