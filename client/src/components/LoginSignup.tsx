"use client";
import React, { useState, useEffect } from 'react';

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes gradientShift {
        0% {background-position:0% 50%;}
        50% {background-position:100% 50%;}
        100% {background-position:0% 50%;}
        
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleForm = () => {
    setError('');
    setIsLogin(!isLogin);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all login fields.');
      return;
    }
    // Placeholder for login logic
    console.log('Login:', { email: loginEmail, password: loginPassword });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all signup fields.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Placeholder for signup logic
    console.log('Signup:', { name: signupName, email: signupEmail, password: signupPassword });
  };

  return (
    <div style={styles.animatedBackground}>
      <div style={styles.container}>
        <div style={styles.toggleContainer}>
          <button
            style={{ ...styles.toggleButton, ...(isLogin ? styles.activeButton : {}) }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            style={{ ...styles.toggleButton, ...(!isLogin ? styles.activeButton : {}) }}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <label style={styles.label}>
              Email:
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Password:
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <button type="submit" style={styles.submitButton}>Login</button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} style={styles.form}>
            <label style={styles.label}>
              Name:
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Email:
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Password:
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <label style={styles.label}>
              Confirm Password:
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
            </label>
            <button type="submit" style={styles.submitButton}>Signup</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  animatedBackground: {
    animation: 'gradientShift 15s ease infinite',
    background: 'linear-gradient(-45deg, #6a11cb, #2575fc, #6a11cb, #2575fc)',
    backgroundSize: '400% 400%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    maxWidth: 400,
    width: '100%',
    padding: 30,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    boxShadow: '0 8px 32px 0 rgba(60, 50, 100, 0.37)',
    fontFamily: 'Arial, sans-serif',
  },
  toggleContainer: {
    display: 'flex',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
    border: 'none',
    borderBottom: '3px solid transparent',
    fontSize: 16,
    transition: 'all 0.3s ease',
  },
  activeButton: {
    borderBottom: '3px solid #2575fc',
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: 14,
    fontSize: 15,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 6,
    boxSizing: 'border-box',
    fontSize: 15,
    borderRadius: 6,
    border: '1px solid #ccc',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#2575fc',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  error: {
    marginBottom: 14,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
};

export default LoginSignup;
