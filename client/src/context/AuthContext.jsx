import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                if (storedUser !== "undefined") {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Clean up invalid "undefined" string if it exists
                    localStorage.removeItem('user');
                }
            } catch (e) {
                console.warn("Cleared invalid user session data");
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, user } = response.data.data;

            if (user && token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return { success: true, user };
            } else {
                return { success: false, message: 'Invalid response from server' };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register', userData);
            const { token, user } = response.data.data;

            if (user && token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                return { success: true, user };
            } else {
                return { success: false, message: 'Invalid response from server' };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            // Check if backend uses PUT /users/profile and returns { data: updatedUser }
            const response = await api.put('/users/profile', profileData);
            const updatedUser = response.data.data;

            if (updatedUser) {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return { success: true };
            } else {
                return { success: false, message: 'Invalid response from server' };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
