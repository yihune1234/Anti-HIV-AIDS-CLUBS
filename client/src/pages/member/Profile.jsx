import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import uploadService from '../../services/uploadService';

const Profile = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        middleName: user?.middleName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        department: user?.department || '',
        year: user?.year || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumbers?.[0]?.number || '',
        bio: user?.bio || '',
        profileImage: user?.profileImage || ''
    });

    // Password change state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const [passMessage, setPassMessage] = useState(null);
    const fileInputRef = useRef(null);

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
        if (lowerMsg.includes('password')) {
            if (lowerMsg.includes('current')) return 'The current password you entered is incorrect.';
            if (lowerMsg.includes('match')) return 'The passwords do not match.';
            return 'Invalid password. Please try again.';
        }
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadService.uploadFile(file);
            if (res.success) {
                setFormData(prev => ({ ...prev, profileImage: res.data.url }));
            } else {
                setMessage({ type: 'error', text: getFriendlyError(res.message || 'Failed to upload image') });
            }
        } catch (error) {
            console.error('Image upload failed', error);
            setMessage({ type: 'error', text: getFriendlyError(error) });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        const result = await updateProfile({
            ...formData,
            year: Number(formData.year) || undefined
        });

        if (result.success) {
            setIsEditing(false);
            setMessage({ type: 'success', text: '✅ Profile updated successfully!' });
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } else {
            setMessage({ type: 'error', text: '⚠️ ' + getFriendlyError(result.message) });
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPassMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPassMessage({ type: 'error', text: '⚠️ New passwords do not match' });
            return;
        }

        setPassLoading(true);
        const result = await changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });

        if (result.success) {
            setPassMessage({ type: 'success', text: '✅ Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setPassMessage(null);
                setShowPasswordForm(false);
            }, 3000);
        } else {
            setPassMessage({ type: 'error', text: '⚠️ ' + getFriendlyError(result.message) });
        }
        setPassLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            middleName: user?.middleName || '',
            lastName: user?.lastName || '',
            username: user?.username || '',
            department: user?.department || '',
            year: user?.year || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumbers?.[0]?.number || '',
            profileImage: user?.profileImage || '',
            bio: user?.bio || ''
        });
        setIsEditing(false);
        setMessage(null);
    };

    return (
        <div className="container mt-5 mb-5">
            {/* Modern Profile Header */}
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #D32F2F 100%)',
                height: '200px',
                borderRadius: '24px 24px 0 0',
                position: 'relative',
                marginBottom: '100px'
            }}>
                {/* Profile Picture Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '-80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center'
                }}>
                    <div
                        style={{
                            width: '160px',
                            height: '160px',
                            borderRadius: '50%',
                            border: '8px solid white',
                            backgroundColor: '#f8f9fa',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: isEditing ? 'pointer' : 'default'
                        }}
                        onClick={() => isEditing && fileInputRef.current.click()}
                    >
                        {formData.profileImage ? (
                            <img src={formData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#ccc' }}>👤</div>
                        )}

                        {isEditing && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {uploading ? '...' : 'UPLOAD'}
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

                    {!isEditing && (
                        <div style={{ marginTop: '1rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.75rem' }}>{user?.firstName} {user?.lastName}</h2>
                            <p className="text-muted" style={{ fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Member • {user?.department || 'Haramaya University'}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '24px', padding: '2.5rem', paddingTop: isEditing ? '2.5rem' : '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ opacity: 0.5 }}>Account</span> Settings
                    </h3>
                    {!isEditing && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn btn-outline btn-sm" style={{ borderRadius: '20px' }}>
                                {showPasswordForm ? 'Close Password' : 'Change Password'}
                            </button>
                            <button onClick={() => setIsEditing(true)} className="btn btn-outline btn-sm" style={{ borderRadius: '20px' }}>
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '2rem',
                        borderRadius: '12px',
                        backgroundColor: message.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                        color: message.type === 'success' ? '#2E7D32' : '#C62828',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Password Change Form Overlay-style section */}
                {showPasswordForm && !isEditing && (
                    <div style={{
                        background: '#f8f9fa',
                        padding: '2rem',
                        borderRadius: '20px',
                        marginBottom: '2.5rem',
                        border: '1px solid #eee'
                    }}>
                        <h4 style={{ marginBottom: '1.5rem' }}>Update Password</h4>
                        {passMessage && (
                            <div style={{
                                padding: '0.75rem',
                                marginBottom: '1.5rem',
                                borderRadius: '8px',
                                backgroundColor: passMessage.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                                color: passMessage.type === 'success' ? '#2E7D32' : '#C62828',
                                fontSize: '0.85rem'
                            }}>
                                {passMessage.text}
                            </div>
                        )}
                        <form onSubmit={handlePasswordSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        type="password" name="currentPassword"
                                        className="form-control" value={passwordData.currentPassword}
                                        onChange={handlePasswordChange} required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password" name="newPassword"
                                        className="form-control" value={passwordData.newPassword}
                                        onChange={handlePasswordChange} required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm New Password</label>
                                    <input
                                        type="password" name="confirmPassword"
                                        className="form-control" value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange} required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }} disabled={passLoading}>
                                {passLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="row" style={{ marginBottom: '2rem' }}>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700' }}>First Name</label>
                            {isEditing ? (
                                <input type="text" name="firstName" className="form-control" value={formData.firstName} onChange={handleChange} style={{ borderRadius: '12px' }} />
                            ) : (
                                <div style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '12px' }}>{formData.firstName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700' }}>Middle Name</label>
                            {isEditing ? (
                                <input type="text" name="middleName" className="form-control" value={formData.middleName} onChange={handleChange} style={{ borderRadius: '12px' }} />
                            ) : (
                                <div style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '12px' }}>{formData.middleName || '-'}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: '700' }}>Last Name</label>
                            {isEditing ? (
                                <input type="text" name="lastName" className="form-control" value={formData.lastName} onChange={handleChange} style={{ borderRadius: '12px' }} />
                            ) : (
                                <div style={{ padding: '0.8rem', background: '#f8f9fa', borderRadius: '12px' }}>{formData.lastName}</div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        {isEditing ? (
                            <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                        ) : (
                            <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>@{user?.username}</p>
                        )}
                    </div>

                    {/* Academic Info */}
                    <div className="form-group">
                        <label className="form-label">Department</label>
                        {isEditing ? (
                            <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} />
                        ) : (
                            <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>{user?.department || '—'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Year of Study</label>
                        {isEditing ? (
                            <input type="number" name="year" className="form-control" value={formData.year} onChange={handleChange} />
                        ) : (
                            <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>{user?.year ? `Year ${user.year}` : '—'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0, color: '#888' }}>{user?.email}</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phoneNumber"
                                className="form-control"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="e.g. 0912345678"
                            />
                        ) : (
                            <p style={{ fontSize: '1.1rem', fontWeight: '500', margin: 0 }}>{user?.phoneNumbers?.[0]?.number || 'Not provided'}</p>
                        )}
                    </div>

                    {/* Bio - Full Width */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="form-label">Personal Bio</label>
                        {isEditing ? (
                            <textarea name="bio" rows="4" className="form-control" value={formData.bio} onChange={handleChange} placeholder="Share something about yourself..."></textarea>
                        ) : (
                            <div style={{
                                padding: '1.25rem',
                                background: '#f8f9fa',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                lineHeight: '1.6',
                                color: '#555'
                            }}>
                                {user?.bio || 'You haven\'t added a bio yet. Tell the club about yourself!'}
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'flex-end' }}>
                        <button onClick={handleCancel} className="btn btn-outline" style={{ borderRadius: '20px', minWidth: '120px' }}>Cancel</button>
                        <button onClick={handleSave} className="btn btn-primary" style={{ borderRadius: '20px', minWidth: '150px' }} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
