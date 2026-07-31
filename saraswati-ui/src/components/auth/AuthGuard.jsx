import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

/**
 * AuthGuard — wraps the entire app.
 * Shows a loading spinner while the token is being validated,
 * then shows LoginModal if unauthenticated, or the app if authenticated.
 */
function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <p>Loading Saraswati…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  return children;
}

export default AuthGuard;
