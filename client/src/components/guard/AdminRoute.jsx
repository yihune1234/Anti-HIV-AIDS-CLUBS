import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    // Check if user is logged in and has admin role
    // user.role should match the backend enum values
    if (user && (user.role === 'admin' || user.role === 'advisor')) {
        return <Outlet />;
    }

    // If logged in but not admin, redirect to member dashboard (or home)
    if (user) {
        return <Navigate to="/member" replace />;
    }

    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
};

export default AdminRoute;
