import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container card animate-fade-in-up" id="login-page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
        }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Sign in to your TaskMaster account
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <Mail size={14} style={{ marginRight: '0.375rem', verticalAlign: '-2px' }} />
            Email Address
          </label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            id="login-email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Lock size={14} style={{ marginRight: '0.375rem', verticalAlign: '-2px' }} />
            Password
          </label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            id="login-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          disabled={isLoading}
          id="login-submit"
        >
          <LogIn size={16} />
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--primary-hover)', fontWeight: 500 }}>
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
