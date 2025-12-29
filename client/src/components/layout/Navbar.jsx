import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Navbar.css';

const dropdownLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    textDecoration: 'none',
    color: '#333',
    borderBottom: '1px solid #f0f0f0'
};

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(prev => prev === true ? false : true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <div className="logo">
                    <Link
                        to={user ? ((user.role === 'admin' || user.role === 'superadmin' || (Array.isArray(user?.roles) && (user.roles.includes('admin') || user.roles.includes('superadmin')))) ? "/admin" : "/member") : "/"}
                        onClick={closeMenu}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <img src={logo} alt="HU Anti-HIV/AIDS Club Logo" style={{ height: '40px', width: 'auto' }} />
                        {!user && <span>Anti-HIV/AIDS Club</span>}
                    </Link>
                </div>

                {/* User Settings & Hamburger Wrapper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                    {/* Settings Icon - Visible to Authenticated Users on ALL devices */}
                    {user && (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsMenuOpen(prev => prev === 'settings' ? false : 'settings')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '5px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%',
                                    transition: 'background 0.3s'
                                }}
                                aria-label="Settings"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </button>

                            {/* Settings Dropdown */}
                            {isMenuOpen === 'settings' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '120%',
                                    right: '-10px',
                                    background: 'white',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    minWidth: '220px',
                                    padding: '0.5rem',
                                    zIndex: 1001,
                                    border: '1px solid #eee'
                                }}>
                                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0', marginBottom: '0.5rem' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold', color: '#333' }}>{user.firstName} {user.lastName}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>@{user.username}</p>
                                    </div>

                                    <Link
                                        to="/member/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{ ...dropdownLinkStyle, borderRadius: '8px' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span>👤</span> My Profile
                                    </Link>

                                    {(user?.role === 'admin' || user?.role === 'superadmin' || user.roles?.includes('admin')) && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{ ...dropdownLinkStyle, borderRadius: '8px' }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <span>🛠️</span> Admin Panel
                                        </Link>
                                    )}

                                    <div style={{ height: '1px', background: '#f0f0f0', margin: '0.5rem 0' }}></div>

                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            ...dropdownLinkStyle,
                                            width: '100%',
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#D32F2F',
                                            cursor: 'pointer',
                                            borderRadius: '8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FFEBEE'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hamburger Menu Button */}
                    <button
                        className={`hamburger ${isMenuOpen === true ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Navigation Links */}
                <div className={`nav-links ${isMenuOpen === true ? 'active' : ''}`}>
                    {!user && <NavLink to="/" onClick={closeMenu}>Home</NavLink>}

                    {!user ? (
                        <>
                            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                            <NavLink to="/vision" onClick={closeMenu}>Vision</NavLink>
                            <NavLink to="/awareness" onClick={closeMenu}>Awareness</NavLink>
                            <NavLink to="/questions" onClick={closeMenu}>Questions</NavLink>
                            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
                            <div className="auth-buttons-mobile">
                                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Join Club</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Role-based Dashboard link */}
                            {(user.role === 'admin' || user.role === 'superadmin' || user.roles?.includes('admin') || user.roles?.includes('superadmin')) ? (
                                <NavLink to="/admin" end onClick={closeMenu}>Admin Panel</NavLink>
                            ) : (
                                <NavLink to="/member" end onClick={closeMenu}>Dashboard</NavLink>
                            )}

                            <NavLink to="/member/events" onClick={closeMenu}>Events</NavLink>
                            <NavLink to="/member/sessions" onClick={closeMenu}>Peer Education</NavLink>
                            <NavLink to="/member/gallery" onClick={closeMenu}>Gallery</NavLink>
                            <NavLink to="/member/stories" onClick={closeMenu}>Stories</NavLink>
                            <NavLink to="/member/resources" onClick={closeMenu}>Resources</NavLink>

                            {/* Mobile Admin Link if not already at top */}
                            {(user.roles?.includes('admin') || user.roles?.includes('superadmin')) && (
                                <NavLink to="/member" onClick={closeMenu}>Member View</NavLink>
                            )}

                            <div className="auth-buttons-mobile">
                                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>Logout</button>
                            </div>
                        </>
                    )}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="auth-buttons-desktop">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ borderRadius: '25px', fontWeight: '600' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ borderRadius: '25px', fontWeight: '600', padding: '0.6rem 1.5rem', boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)' }}>Join Club</Link>
                        </>
                    ) : null}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
