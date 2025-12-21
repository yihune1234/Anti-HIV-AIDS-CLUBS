import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#E53935', marginBottom: '0.5rem' }}>HU ANTI-HIV/AIDS CLUB</h3>
                        <p style={{ color: '#aaaaaa', fontSize: '0.9rem', maxWidth: '300px' }}>
                            Dedicated to creating an HIV-free generation through education, support, and community engagement.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/awareness">Awareness</Link></li>
                            <li><Link to="/login">Member Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4>Contact</h4>
                        <div className="footer-contact-item">
                            <span>📍</span> Haramaya University, Main Campus
                        </div>
                        <div className="footer-contact-item">
                            <span>✉️</span> anti-hiv-club@haramaya.edu.et
                        </div>
                        <div className="footer-contact-item">
                            <span>📞</span> +251 25 553 0334
                        </div>
                    </div>
                </div>

                <div className="copyright">
                    &copy; {new Date().getFullYear()} Haramaya University Anti-HIV/AIDS Club. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
