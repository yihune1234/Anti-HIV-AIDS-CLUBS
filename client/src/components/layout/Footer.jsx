import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import api from '../../services/api';

const Footer = () => {
    const [settings, setSettings] = useState({
        contactEmail: 'anti-hiv-club@haramaya.edu.et',
        contactPhone: '+251 25 553 0334',
        socialMedia: {}
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch public site settings for everyone
                const response = await api.get('/admin/public-settings');
                if (response.data && response.data.success) {
                    setSettings({
                        contactEmail: response.data.data.contactEmail || settings.contactEmail,
                        contactPhone: response.data.data.contactPhone || settings.contactPhone,
                        socialMedia: response.data.data.socialMedia || {}
                    });
                }
            } catch (err) {
                // Silent fail for non-authenticated public users
                console.log('Using default contact info');
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="footer" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div style={{ animation: 'fadeIn 1s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                            <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(229,57,53,0.3))' }} />
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'white', margin: 0, letterSpacing: '1px' }}>HARAMAYA UNIVERSITY</h3>
                                <h3 style={{ fontSize: '1.2rem', color: '#E53935', margin: 0, fontWeight: '900' }}>ANTI-HIV/AIDS CLUB</h3>
                            </div>
                        </div>
                        <p style={{ color: '#aaaaaa', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '350px', marginBottom: '1.5rem' }}>
                            A pioneering student-led organization dedicated to awareness, advocacy, and creating an inclusive campus environment since 1998.
                        </p>

                        {/* Social Media Links */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {settings.socialMedia?.facebook && (
                                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                                    style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#1877F2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>f</a>
                            )}
                            {settings.socialMedia?.twitter && (
                                <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer"
                                    style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#000000'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>𝕏</a>
                            )}
                            {settings.socialMedia?.instagram && (
                                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                                    style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#E4405F'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>i</a>
                            )}
                            {settings.socialMedia?.linkedin && (
                                <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                                    style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#0A66C2'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>in</a>
                            )}
                            {settings.socialMedia?.youtube && (
                                <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                                    style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', fontSize: '0.9rem', transition: 'all 0.3s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>▶</a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Sitemap</h4>
                        <ul className="footer-links" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/vision">Vision & Mission</Link></li>
                            <li><Link to="/awareness">Health Awareness</Link></li>
                            <li><Link to="/questions">Anonymous Q&A</Link></li>
                            <li><Link to="/developer">Developer</Link></li>
                            <li><Link to="/login">Member Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Contact Us</h4>
                        <div className="footer-contact-item" style={{ marginBottom: '1rem', display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.2rem' }}>📍</span>
                            <span style={{ color: '#aaa' }}>Main Campus, Youth Center Building</span>
                        </div>
                        <div className="footer-contact-item" style={{ marginBottom: '1rem', display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.2rem' }}>✉️</span>
                            <a href={`mailto:${settings.contactEmail}`} style={{ color: '#E53935', textDecoration: 'none', fontWeight: '600' }}>{settings.contactEmail}</a>
                        </div>
                        <div className="footer-contact-item" style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ fontSize: '1.2rem' }}>📞</span>
                            <a href={`tel:${settings.contactPhone}`} style={{ color: '#E53935', textDecoration: 'none', fontWeight: '600' }}>{settings.contactPhone}</a>
                        </div>
                    </div>
                </div>

                <div className="copyright" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                    &copy; {new Date().getFullYear()} Haramaya University Anti-HIV/AIDS CLUB. Designed with precision for health & awareness.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
