import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute; 