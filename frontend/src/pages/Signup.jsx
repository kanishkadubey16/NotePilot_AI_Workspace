import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/auth.css';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/workspace');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData.name, formData.email, formData.password);
    if (success) {
      navigate('/workspace');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-nav">
        <div className="logo">🚀 NotePilot</div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="label">CREATE ACCOUNT</span>
            <h2>Start your workspace</h2>
            <p>Free. Takes 20 seconds.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-group">
              <label>NAME</label>
              <input 
                type="text" 
                placeholder="Ada Lovelace"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                autoComplete="one-time-code"
              />
            </div>
            <div className="form-group">
              <label>EMAIL</label>
              <input 
                type="email" 
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                autoComplete="one-time-code"
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input 
                type="password" 
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-btn">
              Create account →
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
