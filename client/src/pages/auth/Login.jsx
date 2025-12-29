import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { success, message, user } = await login(email, password);
        setLoading(false);

        if (success) {
            // Check if user has admin role (support both single role and roles array)
            const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
            const isAdmin = userRoles.includes('admin') || userRoles.includes('superadmin');

            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/member');
            }
        } else {
            setError(message);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', padding: 'clamp(1.5rem, 5vw, 2.5rem)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p className="text-muted">Login to access your member account</p>
                </div>

                {error && (
                    <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#1976D2', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#666' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#D32F2F', fontWeight: 'bold' }}>Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
