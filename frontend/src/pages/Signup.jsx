import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      const res = await signup(name, email, password, role);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Signup failed');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container card animate-fade-in-up" id="signup-page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.5rem',
        }}>
          Create Account
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Join TaskMaster and manage your team
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <User size={14} style={{ marginRight: '0.375rem', verticalAlign: '-2px' }} />
            Full Name
          </label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            id="signup-name"
          />
        </div>
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
            placeholder="john@example.com"
            id="signup-email"
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
            placeholder="Minimum 6 characters"
            id="signup-password"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Shield size={14} style={{ marginRight: '0.375rem', verticalAlign: '-2px' }} />
            Role
          </label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            id="signup-role"
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
          disabled={isLoading}
          id="signup-submit"
        >
          <UserPlus size={16} />
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary-hover)', fontWeight: 500 }}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
