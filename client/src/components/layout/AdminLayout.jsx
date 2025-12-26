import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

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
        return location.pathname === path ? '#3b3b58' : 'transparent';
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
                backgroundColor: '#1a1a2e',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: isMobile ? 'fixed' : 'fixed',
                height: '100vh',
                left: isSidebarOpen ? 0 : '-260px',
                top: 0,
                zIndex: 1000,
                transition: 'left 0.3s ease'
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #2a2a40', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '45px', width: 'auto' }} />
                        {isMobile && (
                            <button
                                onClick={toggleSidebar}
                                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#E53935' }}>
                        Anti-HIV/AIDS Club<br />
                        <span style={{ color: 'white', fontSize: '0.9rem' }}>Admin Panel</span>
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {[
                            { path: '/admin', icon: '📊', label: 'Dashboard' },
                            { path: '/admin/members', icon: '👥', label: 'Manage Members' },
                            { path: '/admin/events', icon: '📅', label: 'Manage Events' },
                            { path: '/admin/sessions', icon: '🎓', label: 'Peer Education' },
                            { path: '/admin/training', icon: '📚', label: 'Training Content' },
                            { path: '/admin/gallery', icon: '🖼️', label: 'Manage Gallery' },
                            { path: '/admin/resources', icon: '📚', label: 'Manage Resources' },
                            { path: '/admin/stories', icon: '📝', label: 'Manage Stories' },
                            { path: '/admin/questions', icon: '❓', label: 'Anonymous Q&A' },
                        ].map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ ...navItemStyle, backgroundColor: isActive(item.path) }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        <li style={{ height: '1px', background: '#2a2a40', margin: '1rem 0' }}></li>

                        {[
                            { path: '/admin/content-approval', icon: '✅', label: 'Content Approval' },
                            { path: '/admin/reports', icon: '📈', label: 'Reports' },
                            { path: '/admin/settings', icon: '⚙️', label: 'System Settings' },
                        ].map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                    style={{ ...navItemStyle, backgroundColor: isActive(item.path) }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </Link>
                            </li>
                        ))}

                        <li style={{ height: '1px', background: '#2a2a40', margin: '1rem 0' }}></li>

                        <li>
                            <Link to="/member" style={navItemStyle}>
                                <span>🏠</span> View Member Site
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid #2a2a40' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#E53935', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.firstName?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user?.firstName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', fontSize: '0.9rem', padding: '0.5rem' }}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, marginLeft: isMobile ? 0 : '260px', transition: 'margin-left 0.3s ease' }}>
                {/* Admin Header */}
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 1.5rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 900
                }}>
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                marginRight: '1rem',
                                color: '#1a1a2e'
                            }}
                        >
                            ☰
                        </button>
                    )}
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1a1a2e' }}>
                        {location.pathname.split('/').pop().replace('-', ' ').toUpperCase() || 'DASHBOARD'}
                    </h3>
                </header>

                <main style={{ padding: isMobile ? '1rem' : '2rem', flex: 1, width: '100%', overflowX: 'hidden' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

const navItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    color: '#e0e0e0',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    fontSize: '0.95rem'
};

export default AdminLayout;

