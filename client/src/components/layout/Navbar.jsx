import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

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
                    <Link to="/" onClick={closeMenu}>Anti-HIV/AIDS Club</Link>
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
                    <NavLink to="/" onClick={closeMenu}>Home</NavLink>

                    {!user ? (
                        <>
                            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
                            <NavLink to="/vision" onClick={closeMenu}>Vision</NavLink>
                            <NavLink to="/awareness" onClick={closeMenu}>Awareness</NavLink>
                            <NavLink to="/questions" onClick={closeMenu}>Questions</NavLink>
                            <div className="auth-buttons-mobile">
                                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Join Club</Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <NavLink to="/member" end onClick={closeMenu}>Dashboard</NavLink>
                            <NavLink to="/member/events" onClick={closeMenu}>Events</NavLink>
                            <NavLink to="/member/gallery" onClick={closeMenu}>Gallery</NavLink>
                            <NavLink to="/member/stories" onClick={closeMenu}>Stories</NavLink>
                            <NavLink to="/member/resources" onClick={closeMenu}>Resources</NavLink>
                            <NavLink to="/member/profile" onClick={closeMenu}>Profile</NavLink>
                            <div className="auth-buttons-mobile">
                                <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', borderColor: 'red', color: 'red' }}>Logout</button>
                            </div>
                        </>
                    )}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="auth-buttons-desktop">
                    {!user ? (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Join Club</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Hi, {user.firstName}</span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'red', color: 'red', padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
