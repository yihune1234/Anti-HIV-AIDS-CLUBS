import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSettingsModal from '../utils/ThemeSettingsModal';
import logo from '../../assets/logo.png';

const MemberLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 1024;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === '/member') return 'DASHBOARD';
        if (path.includes('events')) return 'EVENTS & CAMPAIGNS';
        if (path.includes('sessions')) return 'PEER EDUCATION';
        if (path.includes('gallery')) return 'MEDIA GALLERY';
        if (path.includes('resources')) return 'RESOURCE LIBRARY';
        if (path.includes('stories')) return 'MEMBER STORIES';
        if (path.includes('profile')) return 'MY PROFILE';
        return 'MEMBER PORTAL';
    };

    const getHeaderBackground = () => {
        if (theme.headerStyle === 'solid') return theme.primaryColor;
        
        const path = location.pathname;
        if (path === '/member') return 'linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)';
        if (path.includes('events')) return 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        if (path.includes('sessions')) return 'linear-gradient(135deg, #4c0519 0%, #881337 100%)';
        if (path.includes('gallery')) return 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)';
        if (path.includes('resources')) return 'linear-gradient(135deg, #78350f 0%, #92400e 100%)';
        if (path.includes('stories')) return 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)';
        if (path.includes('profile')) return 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
        return theme.primaryColor;
    };

    const getAccentColor = () => {
        if (theme.headerStyle === 'solid') return 'white';
        
        const path = location.pathname;
        if (path === '/member') return '#ff4d4d';
        if (path.includes('events')) return '#38bdf8';
        if (path.includes('sessions')) return '#fb7185';
        if (path.includes('gallery')) return '#34d399';
        if (path.includes('resources')) return '#fbbf24';
        if (path.includes('stories')) return '#a78bfa';
        if (path.includes('profile')) return '#94a3b8';
        return theme.primaryColor;
    };

    const isDarkHeader = true; // All our new gradients are dark for a professional look

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', position: 'relative' }}>
            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                backgroundColor: theme.sidebarTheme === 'dark' ? '#111827' : 'white',
                color: theme.sidebarTheme === 'dark' ? '#f3f4f6' : '#333',
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'fixed' : 'fixed',
                height: '100vh',
                left: isSidebarOpen ? 0 : '-280px',
                top: 0,
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: theme.sidebarTheme === 'dark' ? '15px 0 35px rgba(0,0,0,0.3)' : '10px 0 30px rgba(0,0,0,0.05)',
                borderRight: theme.sidebarTheme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f0f0f0'
            }}>
                <div style={{ padding: '2rem', borderBottom: `1px solid ${theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa'}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/member" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
                            <img src={logo} alt="Logo" style={{ height: '40px', width: 'auto' }} />
                            <span style={{ fontWeight: '900', color: theme.sidebarTheme === 'dark' ? 'white' : '#1a1a2e', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>HU CLUB</span>
                        </Link>
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                style={{ background: theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8f9fa', border: 'none', color: theme.sidebarTheme === 'dark' ? 'white' : '#666', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={sectionHeaderStyle}>MENU</li>
                        {[
                            { path: '/member', icon: '🏠', label: 'Dashboard' },
                            { path: '/member/events', icon: '📅', label: 'Events' },
                            { path: '/member/sessions', icon: '🎓', label: 'Peer Education' },
                        ].map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isActive(item.path) 
                                            ? (theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.08)' : `${theme.primaryColor}11`) 
                                            : 'transparent',
                                        color: isActive(item.path) 
                                            ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) 
                                            : (theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.66)' : '#666'),
                                        fontWeight: isActive(item.path) ? '700' : '500'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', opacity: isActive(item.path) ? 1 : 0.7, filter: theme.sidebarTheme === 'light' && !isActive(item.path) ? 'grayscale(100%)' : 'none' }}>{item.icon}</span> {item.label}
                                    {isActive(item.path) && <div style={{ ...activeIndicatorStyle, backgroundColor: theme.primaryColor }} />}
                                </Link>
                            </li>
                        ))}

                        <li style={sectionHeaderStyle}>DISCOVER</li>
                        {[
                            { path: '/member/gallery', icon: '🖼️', label: 'Gallery' },
                            { path: '/member/resources', icon: '📚', label: 'Library' },
                            { path: '/member/stories', icon: '📝', label: 'Stories' },
                        ].map((item) => (
                            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isActive(item.path) 
                                            ? (theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.08)' : `${theme.primaryColor}11`) 
                                            : 'transparent',
                                        color: isActive(item.path) 
                                            ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) 
                                            : (theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.66)' : '#666'),
                                        fontWeight: isActive(item.path) ? '700' : '500'
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', opacity: isActive(item.path) ? 1 : 0.7, filter: theme.sidebarTheme === 'light' && !isActive(item.path) ? 'grayscale(100%)' : 'none' }}>{item.icon}</span> {item.label}
                                    {isActive(item.path) && <div style={{ ...activeIndicatorStyle, backgroundColor: theme.primaryColor }} />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', background: theme.sidebarTheme === 'dark' ? 'rgba(0,0,0,0.2)' : '#fcfcfc', borderTop: `1px solid ${theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', borderRadius: '15px', background: theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white', border: `1px solid ${theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#eee'}`, marginBottom: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: theme.primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.firstName?.charAt(0) || 'M'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: theme.sidebarTheme === 'dark' ? 'white' : '#1a1a2e', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.firstName} {user?.lastName}</div>
                            <div style={{ fontSize: '0.7rem', color: theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.4)' : '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Advocate</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            width: '100%', 
                            padding: '0.8rem', 
                            borderRadius: '12px', 
                            background: theme.sidebarTheme === 'dark' ? 'rgba(255,255,255,0.1)' : '#f8f9fa', 
                            color: theme.sidebarTheme === 'dark' ? 'white' : '#E53935', 
                            border: 'none', 
                            fontWeight: '800', 
                            fontSize: '0.85rem', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            transition: 'all 0.3s'
                        }}
                    >
                        <span>🚪</span> LOGOUT
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: isMobile ? 0 : '280px', transition: 'margin-left 0.4s ease' }}>
                {/* Header */}
                <header style={{
                    height: '80px',
                    background: getHeaderBackground(),
                    borderBottom: `1px solid rgba(255,255,255,0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 2.5rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 30px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                style={{ 
                                    background: 'rgba(255,255,255,0.1)', 
                                    border: '1px solid rgba(255,255,255,0.2)', 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '10px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    cursor: 'pointer', 
                                    color: 'white' 
                                }}
                            >
                                ☰
                            </button>
                        )}
                        <div>
                            <h3 style={{ margin: 0, fontSize: '0.65rem', color: getAccentColor(), fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{getPageTitle()}</h3>
                            <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'white', fontWeight: '800', letterSpacing: '-0.5px' }}>{getPageTitle() === 'DASHBOARD' ? 'Welcome Back!' : getPageTitle()}</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        {/* Theme Settings Icon */}
                        <button 
                            onClick={() => setIsThemeModalOpen(true)}
                            title="Theme Customization"
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#333'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </button>

                        <Link 
                            to="/member/profile" 
                            title="My Profile"
                            style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#333'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </Link>
                        
                        <button 
                            onClick={handleLogout}
                            style={{ 
                                background: getAccentColor(), 
                                color: 'white', 
                                border: 'none', 
                                padding: isMobile ? '0.6rem' : '0.6rem 1.4rem', 
                                borderRadius: '10px', 
                                fontWeight: '800', 
                                fontSize: '0.8rem', 
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: `0 4px 15px ${getAccentColor()}44`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>🚪</span>
                            {!isMobile && "SIGN OUT"}
                        </button>
                    </div>
                </header>

                <main style={{ padding: isMobile ? '1.5rem' : '2.5rem', flex: 1, overflowX: 'hidden' }}>
                    <Outlet />
                </main>
            </div>

            {/* Theme Customization Modal */}
            <ThemeSettingsModal 
                isOpen={isThemeModalOpen} 
                onClose={() => setIsThemeModalOpen(false)} 
            />
        </div>
    );
};

const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '16px',
    color: '#666',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.95rem',
    position: 'relative'
};

const activeIndicatorStyle = {
    position: 'absolute',
    left: '0',
    top: '20%',
    bottom: '20%',
    width: '4px',
    backgroundColor: '#D32F2F',
    borderRadius: '10px'
};

const sectionHeaderStyle = {
    padding: '1.5rem 1rem 0.8rem',
    fontSize: '0.7rem',
    fontWeight: '900',
    color: 'rgba(120,120,120,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px'
};

export default MemberLayout;
