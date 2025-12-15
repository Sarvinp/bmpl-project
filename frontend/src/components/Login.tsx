import React, { useState } from 'react';
import { LoginCredentials } from '../types/Auth';
import './Auth.css';

interface LoginProps {
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister, isLoading = false, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    await onLogin({ email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to BMPL</h2>
        <p className="auth-subtitle">Welcome back! Please login to your account.</p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={formErrors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={formErrors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>

          <button type="submit" className="btn-auth-submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="link-button">
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

