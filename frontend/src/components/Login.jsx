import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container glass">
        <div className="auth-header">
          <div className="medical-icon">🏥</div>
          <h1>Welcome Back!</h1>
          <p>You have successfully logged in.</p>
        </div>
        <div className="success-message glossy-box" style={{ textAlign: 'center' }}>
          <strong>Dashboard access is granted.</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container glass">
      <div className="auth-header">
        <div className="medical-icon">🏥</div>
        <h1>Hospital Portal</h1>
        <p>Sign in to access your secure dashboard</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            className="form-control glossy-input"
            placeholder="e.g. USER-123456"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control glossy-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
      
      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Create account</Link>
      </div>
    </div>
  );
};

export default Login;
