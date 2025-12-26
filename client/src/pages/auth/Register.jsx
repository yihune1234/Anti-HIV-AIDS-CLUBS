import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        department: '',
        year: '',
        studentId: '',
        phoneNumber: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const { success, message, user } = await register(formData);
        setLoading(false);

        if (success) {
            // Check if user has admin role (support both single role and roles array)
            const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
            const isAdmin = userRoles.includes('admin');

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
        <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 'clamp(1rem, 5vw, 2rem)' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: 'clamp(1.5rem, 5vw, 2.5rem)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>Join the Club</h2>
                    <p className="text-muted">Create an account to become a member</p>
                </div>

                {error && (
                    <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 250px' }} className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text" name="firstName" className="form-control" placeholder="John" required
                                value={formData.firstName} onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: '1 1 250px' }} className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text" name="lastName" className="form-control" placeholder="Doe" required
                                value={formData.lastName} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text" name="username" className="form-control" placeholder="johndoe123" required
                            value={formData.username} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email" name="email" className="form-control" placeholder="john@example.com" required
                            value={formData.email} onChange={handleChange}
                        />
                    </div>

                    {/* Dept/Year with improved spacing */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 200px' }} className="form-group">
                            <label className="form-label">Department</label>
                            <input
                                type="text" name="department" className="form-control" placeholder="Computer Science"
                                value={formData.department} onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }} className="form-group">
                            <label className="form-label">Year of Study</label>
                            <input
                                type="number" name="year" className="form-control" placeholder="3"
                                value={formData.year} onChange={handleChange} min="1" max="7"
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }} className="form-group">
                            <label className="form-label">Student ID</label>
                            <input
                                type="text" name="studentId" className="form-control" placeholder="ETS0123/14"
                                value={formData.studentId} onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: '1 1 200px' }} className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel" name="phoneNumber" className="form-control" placeholder="0911223344"
                                value={formData.phoneNumber} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password" name="password" className="form-control" placeholder="At least 6 characters" required
                            value={formData.password} onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#666' }}>
                    Already a member? <Link to="/login" style={{ color: '#D32F2F', fontWeight: 'bold' }}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
