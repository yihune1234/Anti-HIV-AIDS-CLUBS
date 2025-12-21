import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        department: user?.department || '',
        year: user?.year || '',
        email: user?.email || '', // Often email is read-only, but let's see
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        // Remove email if it's meant to be immutable or hasn't changed to avoid unique constraint issues if backend is picky
        // For now, submitting all fields
        const result = await updateProfile(formData);

        if (result.success) {
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            username: user?.username || '',
            department: user?.department || '',
            year: user?.year || '',
            email: user?.email || '',
        });
        setIsEditing(false);
        setMessage(null);
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>My Profile</h3>
                    {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleCancel}
                                className="btn btn-outline"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', borderColor: '#888', color: '#888' }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{ background: 'none', border: 'none', color: '#D32F2F', fontWeight: '600', cursor: 'pointer' }}
                        >
                            Edit
                        </button>
                    )}
                </div>

                {/* Feedback Message */}
                {message && (
                    <div style={{
                        padding: '1rem',
                        margin: '1rem',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'success' ? '#E8F5E9' : '#MMFFEBEE',
                        color: message.type === 'success' ? '#2E7D32' : '#C62828',
                        textAlign: 'center'
                    }}>
                        {message.text}
                    </div>
                )}

                <div style={{ padding: '2rem' }}>
                    {/* Header w/ Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: '#eee',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            color: '#888'
                        }}>
                            👤
                        </div>
                        <div>
                            {isEditing ? (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        className="form-control"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        style={{ width: '150px' }}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        className="form-control"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        style={{ width: '150px' }}
                                    />
                                </div>
                            ) : (
                                <h2 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user?.firstName} {user?.lastName}</h2>
                            )}
                            <p className="text-muted" style={{ margin: 0 }}>Member</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Username</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div style={{ fontSize: '1rem', color: '#333' }}>{user?.username}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Department</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="e.g. Computer Science"
                                    className="form-control"
                                    value={formData.department}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div style={{ fontSize: '1rem', color: '#333' }}>{user?.department || 'Not Provided'}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Year of Study</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="year"
                                    placeholder="e.g. 3rd Year"
                                    className="form-control"
                                    value={formData.year}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div style={{ fontSize: '1rem', color: '#333' }}>{user?.year || 'Not Provided'}</div>
                            )}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>Email</label>
                            {/* Usually users shouldn't change email easily without verification, but allowing edit if backend supports it */}
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div style={{ fontSize: '1rem', color: '#333' }}>{user?.email}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
