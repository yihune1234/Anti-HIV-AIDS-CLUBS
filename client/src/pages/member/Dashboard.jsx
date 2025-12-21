import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mt-5 mb-5">
            <div className="mb-4">
                <h1>Welcome back, {user?.firstName}!</h1>
                <p className="text-muted">Here's what's happening in your club.</p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Events Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: '#FFEBEE', color: '#D32F2F', padding: '0.8rem', borderRadius: '8px', fontSize: '1.5rem' }}>📅</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Upcoming Events</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>3 this month</h3>
                        </div>
                    </div>
                    <Link to="/member/events" style={{ color: '#D32F2F', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' }}>View all</Link>
                </div>

                {/* Resources Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: '#E3F2FD', color: '#1976D2', padding: '0.8rem', borderRadius: '8px', fontSize: '1.5rem' }}>📖</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>New Resources</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>5 added</h3>
                        </div>
                    </div>
                    <Link to="/member/resources" style={{ color: '#1976D2', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' }}>Browse library</Link>
                </div>

                {/* Status Card */}
                <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: '#E8F5E9', color: '#388E3C', padding: '0.8rem', borderRadius: '8px', fontSize: '1.5rem' }}>👤</div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Membership Status</p>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#388E3C' }}>Active</h3>
                        </div>
                    </div>
                    <Link to="/member/profile" style={{ color: '#388E3C', fontSize: '0.9rem', fontWeight: '600', marginTop: 'auto' }}>Edit profile</Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Announcements */}
                <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Announcements</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontSize: '1rem', color: '#D32F2F', margin: 0 }}>World AIDS Day Preparation</h4>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>2 days ago</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>Volunteers needed for the upcoming campus rally. Please register at the office.</p>
                    </div>
                    <hr style={{ border: 0, borderTop: '1px solid #eee', margin: '1rem 0' }} />

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h4 style={{ fontSize: '1rem', color: '#D32F2F', margin: 0 }}>New Counseling Hours</h4>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>1 week ago</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>The clinic has extended counseling hours to include Saturday mornings.</p>
                    </div>
                </div>

                {/* Next Event */}
                <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Next Event</h3>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                        <div style={{ background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center', minWidth: '70px' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#666', fontWeight: 'bold' }}>NOV</span>
                            <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 'bold' }}>24</span>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>Candlelight Vigil</h4>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>🕒 6:00 PM - 8:00 PM</div>
                            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>📍 Main Campus Square</div>
                            <p style={{ fontSize: '0.9rem', color: '#555' }}>Join us to remember those we have lost and support those living with HIV.</p>
                            <button className="btn" style={{ background: '#FFEBEE', color: '#D32F2F', border: 'none', padding: '0.4rem 1rem', fontSize: '0.9rem' }}>I'll be there</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
