import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute - Guards routes based on authentication and optional role checking.
 * 
 * Usage:
 *   <ProtectedRoute>                        → requires authentication only
 *   <ProtectedRoute allowedRoles={['admin']}> → requires authentication + admin role
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

    // Only show full-page loader initially while checking authentication
    if (loading && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated && !loading) {
        return <Navigate to="/" replace />;
    }

    // Role-based guard
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
