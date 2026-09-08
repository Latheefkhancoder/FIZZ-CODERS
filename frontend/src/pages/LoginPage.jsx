import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import './LoginPage.css';

/**
 * LoginPage – email + password sign-in form.
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <h1 className="title">Welcome back</h1>

      <p className="subtitle">
        Sign in to your FIZZ-CONNECT account
      </p>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="form"
        noValidate
      >
        <div className="field">
          <label
            htmlFor="login-email"
            className="label"
          >
            Email
          </label>

          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div className="field">
          <label
            htmlFor="login-password"
            className="label"
          >
            Password
          </label>

          <input
            id="login-password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="switch-text">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="switch-link"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;