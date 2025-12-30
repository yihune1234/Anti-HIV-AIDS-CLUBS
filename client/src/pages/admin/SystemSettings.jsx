import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const SystemSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    // Helper function to get friendly error message
    const getFriendlyError = (error) => {
        if (!error) return 'An unexpected error occurred. Please try again.';
        
        const errorMsg = error.message || error.toString();
        const lowerMsg = errorMsg.toLowerCase();
        
        // Network errors
        if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        // Authentication errors
        if (lowerMsg.includes('unauthorized') || lowerMsg.includes('token')) {
            return 'Your session has expired. Please log in again.';
        }
        // Validation errors
        if (lowerMsg.includes('validation') || lowerMsg.includes('invalid')) {
            return 'Please check your input and try again.';
        }
        // Server errors
        if (lowerMsg.includes('500') || lowerMsg.includes('server error')) {
            return 'A server error occurred. Please try again later.';
        }
        
        // If error message is already user-friendly (no technical jargon)
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const result = await adminService.getSystemSettings();
            if (result.success) {
                setSettings(result.data);
            } else {
                alert('⚠️ ' + getFriendlyError(result.message || 'Failed to load settings'));
            }
        } catch (error) {
            alert('⚠️ Error loading settings: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const result = await adminService.updateSystemSettings(settings);
            if (result.success) {
                alert('✅ Settings saved successfully!');
            } else {
                alert('⚠️ ' + getFriendlyError(result.message || 'Failed to save settings'));
            }
        } catch (error) {
            alert('⚠️ Error saving settings: ' + getFriendlyError(error));
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (path, value) => {
        setSettings(prev => {
            const updated = { ...prev };
            const keys = path.split('.');
            let current = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    if (loading) return <div className="text-center p-5">Loading settings...</div>;
    if (!settings) return <div className="text-center p-5">Failed to load settings</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>System Settings</h2>
                <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #eee', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '2px' }}>
                {['general', 'features', 'security', 'notifications'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            borderBottom: activeTab === tab ? '3px solid #ffeb3b' : 'none',
                            fontWeight: activeTab === tab ? '600' : '400',
                            color: activeTab === tab ? '#1a1a2e' : '#777',
                            textTransform: 'capitalize',
                            flexShrink: 0
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="card">
                    <h3>General Settings</h3>

                    <div className="form-group">
                        <label className="form-label">Site Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={settings.siteName || ''}
                            onChange={(e) => updateSetting('siteName', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Site Logo URL</label>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="https://example.com/logo.png"
                            value={settings.logo || ''}
                            onChange={(e) => updateSetting('logo', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Site Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={settings.siteDescription || ''}
                            onChange={(e) => updateSetting('siteDescription', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={settings.contactEmail || ''}
                            onChange={(e) => updateSetting('contactEmail', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contact Phone</label>
                        <input
                            type="tel"
                            className="form-control"
                            value={settings.contactPhone || ''}
                            onChange={(e) => updateSetting('contactPhone', e.target.value)}
                        />
                    </div>

                    <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#D32F2F', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Club Leadership</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Club President Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.leadership?.presidentName || ''}
                                onChange={(e) => updateSetting('leadership.presidentName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Vice President Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.leadership?.vicePresidentName || ''}
                                onChange={(e) => updateSetting('leadership.vicePresidentName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Secretary Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.leadership?.secretaryName || ''}
                                onChange={(e) => updateSetting('leadership.secretaryName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Club Advisor Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={settings.leadership?.advisorName || ''}
                                onChange={(e) => updateSetting('leadership.advisorName', e.target.value)}
                            />
                        </div>
                    </div>

                    <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#D32F2F', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Social Media Links</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map(platform => (
                            <div key={platform} className="form-group">
                                <label className="form-label" style={{ textTransform: 'capitalize' }}>{platform}</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder={`https://${platform}.com/...`}
                                    value={settings.socialMedia?.[platform] || ''}
                                    onChange={(e) => updateSetting(`socialMedia.${platform}`, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Settings */}
            {activeTab === 'features' && (
                <div className="card">
                    <h3>Feature Toggles</h3>

                    {[
                        { key: 'enableRegistration', label: 'Enable User Registration' },
                        { key: 'enableStories', label: 'Enable Stories' },
                        { key: 'enableEvents', label: 'Enable Events' },
                        { key: 'enableResources', label: 'Enable Resources' },
                        { key: 'enableGallery', label: 'Enable Gallery' },
                        { key: 'enableAnonymousQuestions', label: 'Enable Anonymous Questions' },
                        { key: 'requireEmailVerification', label: 'Require Email Verification' },
                        { key: 'requireContentApproval', label: 'Require Content Approval' }
                    ].map(feature => (
                        <div key={feature.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                id={feature.key}
                                checked={settings.features?.[feature.key] || false}
                                onChange={(e) => updateSetting(`features.${feature.key}`, e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor={feature.key} style={{ cursor: 'pointer', margin: 0 }}>
                                {feature.label}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
                <div className="card">
                    <h3>Security Settings</h3>

                    <div className="form-group">
                        <label className="form-label">Max Login Attempts</label>
                        <input
                            type="number"
                            className="form-control"
                            min="3"
                            max="10"
                            value={settings.security?.maxLoginAttempts || 5}
                            onChange={(e) => updateSetting('security.maxLoginAttempts', parseInt(e.target.value))}
                        />
                        <small className="text-muted">Number of failed login attempts before account lockout (3-10)</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Session Timeout (seconds)</label>
                        <input
                            type="number"
                            className="form-control"
                            min="300"
                            value={settings.security?.sessionTimeout || 3600}
                            onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value))}
                        />
                        <small className="text-muted">Minimum 300 seconds (5 minutes)</small>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password Minimum Length</label>
                        <input
                            type="number"
                            className="form-control"
                            min="6"
                            max="20"
                            value={settings.security?.passwordMinLength || 6}
                            onChange={(e) => updateSetting('security.passwordMinLength', parseInt(e.target.value))}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <input
                            type="checkbox"
                            id="requireStrongPassword"
                            checked={settings.security?.requireStrongPassword || false}
                            onChange={(e) => updateSetting('security.requireStrongPassword', e.target.checked)}
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <label htmlFor="requireStrongPassword" style={{ cursor: 'pointer', margin: 0 }}>
                            Require Strong Passwords (uppercase, lowercase, numbers, special characters)
                        </label>
                    </div>
                </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
                <div className="card">
                    <h3>Notification Settings</h3>

                    {[
                        { key: 'emailNotifications', label: 'Enable Email Notifications' },
                        { key: 'newUserNotification', label: 'Notify on New User Registration' },
                        { key: 'newContentNotification', label: 'Notify on New Content Submission' },
                        { key: 'eventReminders', label: 'Send Event Reminders' }
                    ].map(notification => (
                        <div key={notification.key} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                id={notification.key}
                                checked={settings.notifications?.[notification.key] || false}
                                onChange={(e) => updateSetting(`notifications.${notification.key}`, e.target.checked)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <label htmlFor={notification.key} style={{ cursor: 'pointer', margin: 0 }}>
                                {notification.label}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SystemSettings;
