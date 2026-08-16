import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    hospital_name: '',
    email: '',
    role: 'Nurse',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(successData.user_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_name: formData.user_name,
        hospital_name: formData.hospital_name,
        email: formData.email,
        role: formData.role,
        password: formData.password
      };

      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setSuccessData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="auth-container glass">
        <div className="auth-header">
          <div className="medical-icon">🏥</div>
          <h1>Registration Successful!</h1>
          <p>Welcome to the Medical Portal</p>
        </div>
        <div className="success-message glossy-box">
          <strong>Important:</strong> We have generated a unique User ID for your account. 
          
          <div className="id-display-container">
            <span className="id-label">Your User ID:</span>
            <div className="id-box">
              <span className="id-text">{successData.user_id}</span>
              <button 
                onClick={handleCopy} 
                className="icon-btn" 
                title="Copy to clipboard"
                type="button"
              >
                {copied ? <CheckCircle size={20} color="#22c55e" /> : <Copy size={20} />}
              </button>
            </div>
            {copied && <span className="copied-text">Copied to clipboard!</span>}
          </div>

          We have also sent these details to <strong>{successData.email}</strong>. Please use this ID to log in securely.
        </div>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container glass">
      <div className="auth-header">
        <div className="medical-icon">🏥</div>
        <h1>Create Account</h1>
        <p>Register to access the portal</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="user_name">User Name</label>
          <input
            type="text"
            id="user_name"
            className="form-control glossy-input"
            placeholder="e.g. John Doe"
            value={formData.user_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hospital_name">Hospital Name</label>
          <input
            type="text"
            id="hospital_name"
            className="form-control glossy-input"
            placeholder="e.g. City General Hospital"
            value={formData.hospital_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control glossy-input"
            placeholder="admin@hospital.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select 
            id="role" 
            className="form-control glossy-input" 
            value={formData.role} 
            onChange={handleChange}
            required
          >
            <option value="Nurse">Nurse</option>
            <option value="Doctor">Doctor</option>
            <option value="Admin">Admin</option>
            <option value="Analytics">Analytics</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control glossy-input"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm_password">Re-enter Password</label>
          <input
            type="password"
            id="confirm_password"
            className="form-control glossy-input"
            placeholder="Re-enter your password"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
