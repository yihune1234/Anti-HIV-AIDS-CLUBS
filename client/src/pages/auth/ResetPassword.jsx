import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            // Note: The backend endpoint might expect { token, newPassword } 
            // Check user.controller.js -> resetPassword
            await api.post('/users/reset-password', {
                token,
                newPassword: formData.newPassword
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="alert alert-danger">Invalid or missing reset token.</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '2rem'
        }}>
            <div className="card" style={{
                maxWidth: '400px',
                width: '100%',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: 'none'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' }}>Reset Password</h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Create a new strong password for your account.
                    </p>
                </div>

                {success && (
                    <div className="alert alert-success" style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        textAlign: 'center'
                    }}>
                        Password reset successfully!<br />
                        Redirecting to login...
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                required
                                minLength="6"
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                minLength="6"
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    width: '100%'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                background: '#E53935',
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Reseting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
