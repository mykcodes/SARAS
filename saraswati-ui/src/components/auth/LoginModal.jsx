import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../api/client';

/**
 * LoginModal — full-screen auth gate.
 * Shown when the user is not authenticated.
 * Toggles between Login and Register modes.
 */
function LoginModal() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card">
        {/* Logo / brand */}
        <div className="login-brand">
          <div className="login-brand-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="url(#grad)" />
              <path d="M10 22l6-12 6 12M12.5 17.5h7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#d97706"/>
                  <stop offset="1" stopColor="#b45309"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-brand-name">Saraswati</h1>
          <p className="login-brand-tagline">Your AI-powered study companion</p>
        </div>

        {/* Tab switcher */}
        <div className="login-tabs">
          <button
            id="login-tab-login"
            className={`login-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
            type="button"
          >
            Sign In
          </button>
          <button
            id="login-tab-register"
            className={`login-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
            type="button"
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <div className="login-field">
              <label htmlFor="login-name">Full Name</label>
              <input
                id="login-name"
                name="name"
                type="text"
                placeholder="Mayank Kumar"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required={mode === 'register'}
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={handleChange}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            id="login-submit-btn"
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <p className="login-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="login-switch-link"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;
