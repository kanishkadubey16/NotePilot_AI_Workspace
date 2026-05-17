import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/workspace');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
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
            <span className="label">WELCOME BACK</span>
            <h2>Sign in to workspace</h2>
            <p>Continue where you left off.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
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
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="auth-btn">
              Sign in →
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
