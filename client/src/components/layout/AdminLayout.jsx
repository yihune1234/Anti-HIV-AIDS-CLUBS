import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? '#3b3b58' : 'transparent';
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#1a1a2e',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                left: 0,
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #2a2a40' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#E53935' }}>HIV/AIDS Club<br /><span style={{ color: 'white', fontSize: '1rem' }}>Admin Panel</span></h2>
                </div>

                <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li>
                            <Link to="/admin" style={{ ...navItemStyle, backgroundColor: isActive('/admin') }}>
                                <span>📊</span> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/members" style={{ ...navItemStyle, backgroundColor: isActive('/admin/members') }}>
                                <span>👥</span> Manage Members
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/events" style={{ ...navItemStyle, backgroundColor: isActive('/admin/events') }}>
                                <span>📅</span> Manage Events
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/gallery" style={{ ...navItemStyle, backgroundColor: isActive('/admin/gallery') }}>
                                <span>🖼️</span> Manage Gallery
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/stories" style={{ ...navItemStyle, backgroundColor: isActive('/admin/stories') }}>
                                <span>📝</span> Manage Stories
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/questions" style={{ ...navItemStyle, backgroundColor: isActive('/admin/questions') }}>
                                <span>❓</span> Anonymous Q&A
                            </Link>
                        </li>
                        {/* Divider */}
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
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <Outlet />
            </main>
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
