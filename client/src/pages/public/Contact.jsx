import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Contact = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user ? user.email : '',
        subject: 'Feedback',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        contactEmail: 'anti-hiv-club@haramaya.edu.et',
        contactPhone: '+251 25 553 0334',
        siteName: 'HU Anti-HIV/AIDS Club'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/admin/public-settings');
                if (response.data.success) {
                    setSettings({
                        ...settings,
                        ...response.data.data
                    });
                }
            } catch (err) {
                console.log('Using default settings');
            }
        };
        fetchSettings();
    }, []);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const response = await api.post('/feedback', formData);

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    msg: '✅ Thank you for your message! We will get back to you soon.'
                });
                setFormData({ ...formData, message: '' });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                msg: '⚠️ ' + getFriendlyError(error)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .contact-card {
                    background: white;
                    border-radius: 30px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                }
                @media (max-width: 992px) {
                    .contact-card { grid-template-columns: 1fr; }
                }
                .info-sidebar {
                    background: linear-gradient(135deg, #1a1a2e 0%, #D32F2F 100%);
                    padding: 4rem 3rem;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .contact-form {
                    padding: 4rem 3rem;
                }
                .input-group {
                    margin-bottom: 2rem;
                }
                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    color: #333;
                }
                .input-group input, .input-group textarea, .input-group select {
                    width: 100%;
                    padding: 1rem;
                    border: 2px solid #eee;
                    border-radius: 12px;
                    transition: border-color 0.3s;
                    font-size: 1rem;
                }
                .input-group input:focus, .input-group textarea:focus {
                    border-color: #D32F2F;
                    outline: none;
                }
                `}
            </style>

            <div style={{ background: '#f8f9fa', padding: 'clamp(4rem, 10vw, 6rem) 0' }}>
                <div className="container">
                    <div className="contact-card" style={{ animation: 'slideUp 1s ease' }}>
                        <div className="info-sidebar">
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '2rem' }}>Get in <span style={{ color: '#FF5252' }}>Touch</span></h2>
                            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '3rem' }}>
                                Have questions? Suggestions? Or just want to say hi? We'd love to hear from you. Our team is dedicated to supporting the HU community.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', fontSize: '1.5rem' }}>📍</div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>Location</h4>
                                        <p style={{ opacity: 0.7, margin: 0 }}>Haramaya University Main Campus</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', fontSize: '1.5rem' }}>📧</div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>Email Us</h4>
                                        <p style={{ opacity: 0.7, margin: 0 }}>{settings.contactEmail}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', fontSize: '1.5rem' }}>📱</div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>Phone</h4>
                                        <p style={{ opacity: 0.7, margin: 0 }}>{settings.contactPhone}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                {settings.socialMedia?.facebook && (
                                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', textDecoration: 'none', fontWeight: 'bold' }}>f</a>
                                )}
                                {settings.socialMedia?.twitter && (
                                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', textDecoration: 'none', fontWeight: 'bold' }}>t</a>
                                )}
                                {settings.socialMedia?.instagram && (
                                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', textDecoration: 'none', fontWeight: 'bold' }}>i</a>
                                )}
                                {settings.socialMedia?.linkedin && (
                                    <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', textDecoration: 'none', fontWeight: 'bold' }}>l</a>
                                )}
                                {settings.socialMedia?.youtube && (
                                    <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a1a2e', textDecoration: 'none', fontWeight: 'bold' }}>y</a>
                                )}
                            </div>
                        </div>

                        <div className="contact-form">
                            {status.msg && (
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '15px',
                                    marginBottom: '2rem',
                                    backgroundColor: status.type === 'success' ? '#E8F5E9' : '#FFEBEE',
                                    color: status.type === 'success' ? '#2E7D32' : '#C62828',
                                    fontWeight: '700',
                                    textAlign: 'center'
                                }}>
                                    {status.msg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label>Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label>Subject</label>
                                    <select name="subject" value={formData.subject} onChange={handleChange}>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Question">General Question</option>
                                        <option value="Suggestion">Suggestion</option>
                                        <option value="Support">Technical Support</option>
                                        <option value="Join">Join Leadership</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Tell us what's on your mind..."
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '15px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(211,47,47,0.2)' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Sending Message...' : 'Send Message →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support section */}
            <div className="container py-5" style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: '3rem', fontWeight: '800' }}>Common Inquiries</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '20px' }}>
                        <h4 style={{ color: '#D32F2F', marginBottom: '1rem' }}>How to Join?</h4>
                        <p style={{ color: '#666' }}>Simply register on our platform. Once verified, you'll gain access to all club activities and resources.</p>
                    </div>
                    <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '20px' }}>
                        <h4 style={{ color: '#D32F2F', marginBottom: '1rem' }}>Is it Anonymous?</h4>
                        <p style={{ color: '#666' }}>Our wellness questions are 100% anonymous. This contact form is for general communication.</p>
                    </div>
                    <div style={{ padding: '2rem', border: '1px solid #eee', borderRadius: '20px' }}>
                        <h4 style={{ color: '#D32F2F', marginBottom: '1rem' }}>Collaboration?</h4>
                        <p style={{ color: '#666' }}>We welcome partnerships with other campus clubs and organizations. Use the "Other" category above.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
