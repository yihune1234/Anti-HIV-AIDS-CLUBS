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
        setIsMenuOpen(!isMenuOpen);
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

                {/* Hamburger Menu Button */}
                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links */}
                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
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
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '4px 6px 4px 14px',
                                    background: 'white',
                                    border: '1px solid #eee',
                                    borderRadius: '35px',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#d32f2f';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#eee';
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                }}
                            >
                                <span style={{ color: '#333' }}>Hi, {user.firstName}</span>
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '38px',
                                        height: '38px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #1a1a2e 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                    </div>
                                )}
                            </button>

                            {isMenuOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '0.5rem',
                                    background: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    minWidth: '200px',
                                    zIndex: 1000
                                }}>
                                    <Link
                                        to="/member/profile"
                                        onClick={closeMenu}
                                        style={dropdownLinkStyle}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8f8'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                                        <span>My Profile</span>
                                    </Link>

                                    {(user?.role === 'admin' || user?.role === 'superadmin' || (Array.isArray(user?.roles) && (user.roles.includes('admin') || user.roles.includes('superadmin')))) && (
                                        <Link
                                            to="/admin"
                                            onClick={closeMenu}
                                            style={dropdownLinkStyle}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f8f8f8'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        >
                                            <span style={{ fontSize: '1.2rem' }}>🛠️</span>
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            width: '100%',
                                            border: 'none',
                                            background: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            color: '#E53935',
                                            fontWeight: '500',
                                            borderRadius: '0 0 8px 8px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#FFEBEE'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
