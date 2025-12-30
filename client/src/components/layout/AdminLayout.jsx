import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSettingsModal from '../utils/ThemeSettingsModal';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
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

    const isLinkActive = (path) => {
        return location.pathname === path;
    };


    const getSidebarBg = () => {
        return theme.sidebarTheme === 'dark' ? '#1a1a2e' : '#fff';
    };

    const getSidebarColor = () => {
        return theme.sidebarTheme === 'dark' ? 'white' : '#333';
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8', position: 'relative' }}>
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
                width: '260px',
                backgroundColor: getSidebarBg(),
                color: getSidebarColor(),
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'fixed' : 'fixed',
                height: '100vh',
                left: isSidebarOpen ? 0 : '-260px',
                top: 0,
                zIndex: 1000,
                transition: 'left 0.3s ease',
                boxShadow: theme.sidebarTheme === 'dark' ? '15px 0 35px rgba(0,0,0,0.3)' : '10px 0 30px rgba(0,0,0,0.05)',
                borderRight: theme.sidebarTheme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e0e0e0'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: `1px solid ${theme.sidebarTheme === 'dark' ? '#2a2a40' : '#f0f0f0'}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '45px', width: 'auto' }} />
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                style={{ background: 'transparent', border: 'none', color: getSidebarColor(), fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <h2 style={{ fontSize: '1.1rem', margin: 0, color: theme.primaryColor }}>
                        Anti-HIV/AIDS Club<br />
                        <span style={{ color: getSidebarColor(), fontSize: '0.9rem' }}>Admin Panel</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {/* Main Section */}
                        <li style={sectionHeaderStyle}>MAIN NAVIGATION</li>
                        {[
                            { path: '/admin', icon: '📊', label: 'Dashboard', roles: ['superadmin', 'admin'] },
                        ].filter(item => item.roles.some(role => user?.roles?.includes(role))).map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? '#3b3b58' : `${theme.primaryColor}11`) : 'transparent',
                                        color: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) : (theme.sidebarTheme === 'dark' ? '#e0e0e0' : '#666'),
                                        borderLeft: isLinkActive(item.path) ? `4px solid ${theme.primaryColor}` : '4px solid transparent'
                                    }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* People Management */}
                        <li style={sectionHeaderStyle}>PEOPLE MANAGEMENT</li>
                        {[
                            { path: '/admin/members', icon: '👥', label: 'Manage Members', roles: ['superadmin', 'admin'] },
                            { path: '/admin/member-contacts', icon: '📇', label: 'Member Contacts', roles: ['superadmin', 'admin'] },
                            { path: '/admin/users', icon: '👤', label: 'Manage Users', roles: ['superadmin'] },
                        ].filter(item => item.roles.some(role => user?.roles?.includes(role))).map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? '#3b3b58' : `${theme.primaryColor}11`) : 'transparent',
                                        color: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) : (theme.sidebarTheme === 'dark' ? '#e0e0e0' : '#666'),
                                        borderLeft: isLinkActive(item.path) ? `4px solid ${theme.primaryColor}` : '4px solid transparent'
                                    }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* Programs & Content */}
                        <li style={sectionHeaderStyle}>PROGRAMS & CONTENT</li>
                        {[
                            { path: '/admin/events', icon: '📅', label: 'Manage Events', roles: ['superadmin', 'admin'] },
                            { path: '/admin/sessions', icon: '🎓', label: 'Peer Education', roles: ['superadmin', 'admin'] },
                            { path: '/admin/gallery', icon: '🖼️', label: 'Manage Gallery', roles: ['superadmin', 'admin'] },
                            { path: '/admin/resources', icon: '📚', label: 'Manage Resources', roles: ['superadmin', 'admin'] },
                            { path: '/admin/stories', icon: '📝', label: 'Manage Stories', roles: ['superadmin', 'admin'] },
                            { path: '/admin/content-approval', icon: '✅', label: 'Content Approval', roles: ['superadmin', 'admin'] },
                        ].filter(item => item.roles.some(role => user?.roles?.includes(role))).map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? '#3b3b58' : `${theme.primaryColor}11`) : 'transparent',
                                        color: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) : (theme.sidebarTheme === 'dark' ? '#e0e0e0' : '#666'),
                                        borderLeft: isLinkActive(item.path) ? `4px solid ${theme.primaryColor}` : '4px solid transparent'
                                    }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        {/* Communication & System */}
                        <li style={sectionHeaderStyle}>SYSTEM & COMMS</li>
                        {[
                            { path: '/admin/questions', icon: '❓', label: 'Anonymous Q&A', roles: ['superadmin', 'admin'] },
                            { path: '/admin/feedback', icon: '💬', label: 'Manage Feedback', roles: ['superadmin', 'admin'] },
                            { path: '/admin/reports', icon: '📈', label: 'Reports', roles: ['superadmin'] },
                            { path: '/admin/settings', icon: '⚙️', label: 'System Settings', roles: ['superadmin'] },
                        ].filter(item => item.roles.some(role => user?.roles?.includes(role))).map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ 
                                        ...navItemStyle, 
                                        backgroundColor: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? '#3b3b58' : `${theme.primaryColor}11`) : 'transparent',
                                        color: isLinkActive(item.path) ? (theme.sidebarTheme === 'dark' ? 'white' : theme.primaryColor) : (theme.sidebarTheme === 'dark' ? '#e0e0e0' : '#666'),
                                        borderLeft: isLinkActive(item.path) ? `4px solid ${theme.primaryColor}` : '4px solid transparent'
                                    }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        <li style={{ height: '1px', background: '#2a2a40', margin: '1rem 0' }}></li>

                        <li>
                            <Link to="/member" style={{ ...navItemStyle, color: theme.sidebarTheme === 'dark' ? 'white' : '#666' }}>
                                <span>🏠</span> View Member Site
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: `1px solid ${theme.sidebarTheme === 'dark' ? '#2a2a40' : '#f0f0f0'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme.primaryColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: getSidebarColor() }}>{user?.firstName}</div>
                            <div style={{ fontSize: '0.75rem', color: theme.sidebarTheme === 'dark' ? '#aaa' : '#888' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem', background: theme.primaryColor, color: 'white', border: 'none', borderRadius: '8px' }}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: isMobile ? 0 : '260px', transition: 'margin-left 0.3s ease' }}>
                {/* Admin Header */}
                <header style={{
                    minHeight: '70px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: isMobile ? '1rem 1.5rem' : '1.5rem 2rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900,
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#1a1a2e',
                                    flexShrink: 0
                                }}
                            >
                                ☰
                            </button>
                        )}
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: isMobile ? '1.25rem' : '1.75rem', 
                                color: '#1a1a2e', 
                                fontWeight: '900',
                                letterSpacing: '-0.5px',
                                lineHeight: 1.2,
                                textTransform: 'uppercase'
                            }}>
                                {location.pathname.split('/').pop().replace('-', ' ') || 'DASHBOARD'}
                            </h1>
                            {!isMobile && (
                                <p style={{ 
                                    margin: '0.25rem 0 0 0', 
                                    fontSize: '0.85rem', 
                                    color: '#666', 
                                    fontWeight: '500' 
                                }}>
                                    Manage and monitor your platform
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                        <button 
                            onClick={() => setIsThemeModalOpen(true)}
                            title="Theme Customization"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#f8f9fa',
                                color: '#555',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#555'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </button>

                        <Link 
                            to="/admin/settings" 
                            title="System Settings"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: '#f8f9fa',
                                color: '#555',
                                textDecoration: 'none',
                                transition: 'all 0.3s',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.primaryColor; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.color = '#555'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                            </svg>
                        </Link>
                    </div>
                </header>
                <main style={{ padding: isMobile ? '1rem' : '2rem', flex: 1, width: '100%', overflowX: 'hidden' }}>
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
    padding: '10px 24px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontSize: '0.9rem'
};

const sectionHeaderStyle = {
    padding: '1.5rem 1.5rem 0.5rem',
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '1.2px'
};

export default AdminLayout;

