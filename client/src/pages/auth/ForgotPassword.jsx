import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ForgotPassword = () => {
    // Identity = Username or Student ID
    const [identity, setIdentity] = useState('');
    // Contact = Email or Phone Number
    const [contact, setContact] = useState('');

    // Step 2 inputs
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Steps: 1 = Verify Credentials, 2 = Verify OTP & Reset
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Helper function to get friendly error message
    const getFriendlyError = (error) => {
        if (!error) return 'An unexpected error occurred. Please try again.';
        const errorMsg = error.message || error.response?.data?.message || error.toString();
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        if (lowerMsg.includes('unauthorized') || lowerMsg.includes('token')) {
            return 'Your session has expired. Please log in again.';
        }
        if (lowerMsg.includes('validation') || lowerMsg.includes('invalid')) {
            return 'Please check your input and try again.';
        }
        if (lowerMsg.includes('500') || lowerMsg.includes('server error')) {
            return 'A server error occurred. Please try again later.';
        }
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await api.post('/users/forgot-password', { identity, contact });
            setMessage('✅ ' + response.data.message);
            
            // DEVELOPMENT ONLY: Log OTP
            if (response.data.otp) {
                console.log('DEV ONLY - OTP:', response.data.otp);
            }

            setStep(2);
        } catch (err) {
            setError('⚠️ ' + getFriendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (newPassword.length < 6) {
            setError('⚠️ New password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await api.post('/users/reset-password', {
                contact,
                otp,
                newPassword
            });

            setMessage('✅ Password reset successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('⚠️ ' + getFriendlyError(err));
        } finally {
            setLoading(false);
        }
    };

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
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        background: '#f0f2f5',
                        width: '80px',
                        height: '80px',
                        lineHeight: '80px',
                        borderRadius: '50%',
                        display: 'inline-block'
                    }}>
                        🔐
                    </div>
                    <h2 style={{ fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' }}>
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {step === 1
                            ? "Verify your account to receive a code."
                            : "Enter the 6-digit code received."}
                    </p>
                </div>

                {message && (
                    <div className="alert alert-success" style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleRequestOTP}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>Username or Student ID</label>
                            <input
                                type="text"
                                className="form-control"
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                required
                                style={{ padding: '0.8rem 1rem', borderRadius: '10px' }}
                                placeholder="Enter your username or ID"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>Email or Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                required
                                style={{ padding: '0.8rem 1rem', borderRadius: '10px' }}
                                placeholder="Enter your registered contact"
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
                                background: '#E53935',
                                border: 'none',
                                color: 'white',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify & Send Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                placeholder="######"
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '10px',
                                    letterSpacing: '5px',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" style={{ fontWeight: '600', color: '#444' }}>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="6"
                                style={{ padding: '0.8rem 1rem', borderRadius: '10px' }}
                                placeholder="Min 6 characters"
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
                                background: '#E53935',
                                border: 'none',
                                color: 'white',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Reseting...' : 'Reset Password'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                Back to Verification
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                    }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
