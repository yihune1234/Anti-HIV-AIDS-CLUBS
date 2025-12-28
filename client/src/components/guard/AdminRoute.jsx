import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    // Check if user is logged in and has admin role
    // Support both single role and roles array
    const hasAdminRole = user && (
        user.role === 'admin' ||
        user.role === 'superadmin' ||
        (Array.isArray(user.roles) && (user.roles.includes('admin') || user.roles.includes('superadmin')))
    );

    if (hasAdminRole) {
        return <Outlet />;
    }

    // If logged in but not admin, redirect to member dashboard
    if (user) {
        return <Navigate to="/member" replace />;
    }

    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
};

export default AdminRoute;
