import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import resourceService from '../../services/resourceService';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        upcomingEvents: 0,
        newResources: 0
    });
    const [loading, setLoading] = useState(true);
    const [nextEvent, setNextEvent] = useState(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchDashboardData = async () => {
            try {
                const [eventsRes, resourcesRes] = await Promise.all([
                    eventService.getAllEvents(),
                    resourceService.getAllResources()
                ]);

                // Process Events
                const now = new Date();
                const events = (eventsRes.data && (eventsRes.data.events || eventsRes.data)) || [];
                const futureEvents = events
                    .filter(e => new Date(e.startDate || e.date) > now)
                    .sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date));

                // Process Resources
                const resources = (resourcesRes.data && (resourcesRes.data.resources || resourcesRes.data)) || [];

                setStats({
                    upcomingEvents: futureEvents.length,
                    newResources: resources.length
                });

                if (futureEvents.length > 0) {
                    setNextEvent(futureEvents[0]);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-danger" role="status"></div>
            <p style={{ marginTop: '1rem', color: '#666', fontWeight: '500' }}>Synchronizing your dashboard...</p>
        </div>
    );

    return (
        <div className="container mt-5 mb-5" style={{ animation: 'fadeIn 0.8s ease' }}>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-subtle {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                .stat-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
                .action-btn:hover {
                    letter-spacing: 1px;
                }
                `}
            </style>

            {/* Premium Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1e2f 0%, #111119 100%)',
                padding: 'clamp(1.5rem, 5vw, 4rem) clamp(1rem, 4vw, 3rem)',
                borderRadius: 'clamp(16px, 4vw, 40px)',
                color: 'white',
                marginBottom: 'clamp(1.5rem, 4vw, 3rem)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'clamp(1rem, 3vw, 2rem)'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <span style={{
                        color: '#D32F2F',
                        fontWeight: '800',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '0.8rem',
                        display: 'block',
                        marginBottom: '0.5rem'
                    }}>
                        {greeting}, Advocate
                    </span>
                    <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>
                        {user?.firstName} <span style={{ color: '#D32F2F' }}>{user?.middleName}</span>
                    </h1>
                    <p style={{ opacity: 0.7, fontSize: 'clamp(0.95rem, 2.5vw, 1.2rem)', maxWidth: 'clamp(280px, 80%, 500px)', lineHeight: '1.6' }}>
                        Welcome to your central hub for advocacy, education, and community support. Together, we make a difference.
                    </p>
                </div>

                <div style={{
                    zIndex: 2,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    padding: 'clamp(1.5rem, 4vw, 2rem)',
                    borderRadius: 'clamp(12px, 3vw, 30px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    minWidth: 'clamp(140px, 35vw, 200px)',
                    flexShrink: 0
                }}>
                    <div style={{
                        width: 'clamp(50px, 12vw, 80px)',
                        height: 'clamp(50px, 12vw, 80px)',
                        borderRadius: '50%',
                        background: '#D32F2F',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                        fontWeight: 'bold',
                        boxShadow: '0 0 20px rgba(211, 47, 47, 0.4)'
                    }}>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{user?.idNumber || user?.studentId || 'Member ID'}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Active Member</div>

                    {(user?.role === 'admin' || user?.role === 'superadmin' || user?.roles?.includes('admin') || user?.roles?.includes('superadmin')) && (
                        <Link
                            to="/admin"
                            className="btn btn-primary"
                            style={{
                                fontSize: '0.75rem',
                                padding: '0.5rem 1rem',
                                width: '100%',
                                borderRadius: '15px',
                                background: 'white',
                                color: '#D32F2F',
                                border: 'none',
                                fontWeight: '800'
                            }}
                        >
                            ADMIN PANEL
                        </Link>
                    )}
                </div>

                {/* Decorative background blobs */}
                <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(211, 47, 47, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', left: '10%', bottom: '-30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(30, 136, 229, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}></div>
            </div>

            {/* Dashboard Analytics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 'clamp(2rem, 5vw, 4rem)' }}>
                {/* Event Stat */}
                <div className="stat-card" style={{
                    background: 'white',
                    borderRadius: 'clamp(16px, 4vw, 35px)',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ width: 'clamp(45px, 10vw, 60px)', height: 'clamp(45px, 10vw, 60px)', background: '#FFF5F5', color: '#D32F2F', borderRadius: 'clamp(10px, 2.5vw, 18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)' }}>
                            📅
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#BDBDBD', letterSpacing: '1px' }}>UPCOMING</div>
                            <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>{stats.upcomingEvents}</div>
                        </div>
                    </div>
                    <h4 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '800', marginBottom: '0.5rem' }}>Active Events</h4>
                    <p style={{ color: '#777', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>Workshops, seminars and campaigns waiting for you.</p>
                    <Link className="action-btn" to="/member/events" style={{ color: '#D32F2F', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
                        JOIN NOW <span>→</span>
                    </Link>
                </div>

                {/* Library Stat */}
                <div className="stat-card" style={{
                    background: 'white',
                    borderRadius: 'clamp(16px, 4vw, 35px)',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ width: 'clamp(45px, 10vw, 60px)', height: 'clamp(45px, 10vw, 60px)', background: '#F0F7FF', color: '#1976D2', borderRadius: 'clamp(10px, 2.5vw, 18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)' }}>
                            📂
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#BDBDBD', letterSpacing: '1px' }}>KNOWLEDGE</div>
                            <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '900', color: '#1a1a1a', lineHeight: '1' }}>{stats.newResources}</div>
                        </div>
                    </div>
                    <h4 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '800', marginBottom: '0.5rem' }}>Learning Hub</h4>
                    <p style={{ color: '#777', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>Curated materials to expand your understanding.</p>
                    <Link className="action-btn" to="/member/resources" style={{ color: '#1976D2', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
                        EXPLORE <span>→</span>
                    </Link>
                </div>

                {/* Membership Stat */}
                <div className="stat-card" style={{
                    background: 'white',
                    borderRadius: 'clamp(16px, 4vw, 35px)',
                    padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div style={{ width: 'clamp(45px, 10vw, 60px)', height: 'clamp(45px, 10vw, 60px)', background: '#F2FFF4', color: '#388E3C', borderRadius: 'clamp(10px, 2.5vw, 18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)' }}>
                            👑
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: '#BDBDBD', letterSpacing: '1px' }}>STATUS</div>
                            <div style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: '900', color: user?.isActive ? '#388E3C' : '#D32F2F', lineHeight: '2' }}>
                                {user?.isActive ? 'VERIFIED' : 'PENDING'}
                            </div>
                        </div>
                    </div>
                    <h4 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: '800', marginBottom: '0.5rem' }}>Club Standing</h4>
                    <p style={{ color: '#777', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>Your current engagement and verification status.</p>
                    <Link className="action-btn" to="/member/profile" style={{ color: '#388E3C', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s ease' }}>
                        MY PROFILE <span>→</span>
                    </Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'clamp(2rem, 5vw, 3rem)' }}>
                {/* Community Announcements */}
                <div style={{
                    background: 'white',
                    borderRadius: 'clamp(20px, 5vw, 40px)',
                    padding: 'clamp(2rem, 5vw, 3rem)',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: '900', letterSpacing: '-0.5px' }}>Club <span style={{ color: '#D32F2F' }}>Bulletins</span></h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: '900', background: '#f8f9fa', padding: '6px 15px', borderRadius: '100px', border: '1px solid #eee' }}>LATEST UPDATES</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                        <div style={{ position: 'relative', paddingLeft: 'clamp(1.5rem, 3vw, 2rem)', borderLeft: '3px solid #D32F2F' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#D32F2F', marginBottom: '0.5rem', opacity: 0.8 }}>SYSTEM ANNOUNCEMENT • TODAY</div>
                            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: '800' }}>Platform Evolution Complete</h4>
                            <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.7', margin: 0 }}>
                                We've successfully integrated the club's administrative systems. You can now track your participation, access exclusive resources, and submit stories seamlessly.
                            </p>
                        </div>

                        <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '3px solid #eee' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#999', marginBottom: '0.5rem' }}>PEER ADVISORY • 2 DAYS AGO</div>
                            <h4 style={{ margin: '0 0 0.8rem 0', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: '800' }}>Confidential Peer Support</h4>
                            <p style={{ color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1rem)', lineHeight: '1.7', margin: 0 }}>
                                Remember that our peer educators are available for confidential counselling every weekday. Visit the 'Team' section to connect with a mentor.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Featured Highlight Card */}
                <div style={{
                    background: nextEvent ? 'white' : '#1e1e2f',
                    borderRadius: '40px',
                    overflow: 'hidden',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                }}>
                    {nextEvent ? (
                        <>
                            <div style={{ height: '240px', position: 'relative' }}>
                                <img
                                    src={(nextEvent.images && nextEvent.images.length > 0) ? nextEvent.images[0].url : 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                                    alt="Event"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                                <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem' }}>
                                    <span style={{
                                        background: '#D32F2F',
                                        color: 'white',
                                        padding: '5px 15px',
                                        borderRadius: '100px',
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        letterSpacing: '1px'
                                    }}>PRIMARY FOCUS</span>
                                </div>
                            </div>
                            <div style={{ padding: '3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', color: '#D32F2F', fontWeight: '800', fontSize: '0.9rem' }}>
                                    <span>{new Date(nextEvent.startDate || nextEvent.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</span>
                                    <span>•</span>
                                    <span>{new Date(nextEvent.startDate || nextEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>{nextEvent.title}</h3>
                                <div style={{ color: '#777', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                                    📍 {nextEvent.location?.venue || 'Main Campus Auditorium'}
                                </div>
                                <div style={{ marginTop: 'auto' }}>
                                    <Link to="/member/events" style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        padding: '1.2rem',
                                        background: '#1a1a1a',
                                        color: 'white',
                                        borderRadius: '100px',
                                        fontWeight: '800',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    >
                                        JOIN ACTIVITY
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: '4rem 3rem', color: 'white', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>✨</div>
                            <h3 style={{ fontSize: '2rem', color: 'white', fontWeight: '800', marginBottom: '1rem' }}>Quiet Horizon</h3>
                            <p style={{ opacity: 0.6, fontSize: '1.1rem', marginBottom: '3rem' }}>No immediate upcoming events. Why not explore our latest awareness resources?</p>
                            <Link to="/member/resources" style={{
                                display: 'inline-block',
                                padding: '1rem 2.5rem',
                                border: '2px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '100px',
                                fontWeight: '800',
                                textDecoration: 'none'
                            }}>VISIT LIBRARY</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

