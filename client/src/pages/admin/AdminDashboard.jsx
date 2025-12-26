import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: { total: 0, active: 0 },
        events: { total: 0, upcoming: 0 },
        sessions: { total: 0 },
        stories: { total: 0, pending: 0 },
        resources: { total: 0 }
    });
    const [recentActivity, setRecentActivity] = useState({
        recentUsers: [],
        recentEvents: [],
        recentStories: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, activityRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getRecentActivity(5)
            ]);

            if (statsRes.success) {
                setStats(statsRes.data);
            }

            if (activityRes.success) {
                setRecentActivity(activityRes.data);
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5">Loading dashboard data...</div>;
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Admin Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* Stats Cards */}
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.users.total}</h3>
                    <p className="text-muted">Total Users ({stats.users.active} active)</p>
                    <Link to="/admin/members" className="btn btn-sm btn-outline mt-2">Manage</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.events.total}</h3>
                    <p className="text-muted">Total Events ({stats.events.upcoming} upcoming)</p>
                    <Link to="/admin/events" className="btn btn-sm btn-outline mt-2">Manage</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.sessions.total}</h3>
                    <p className="text-muted">Education Sessions</p>
                    <Link to="/admin/sessions" className="btn btn-sm btn-outline mt-2">View</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#D32F2F' }}>{stats.stories.pending}</h3>
                    <p className="text-muted">Pending Stories ({stats.stories.total} total)</p>
                    <Link to="/admin/stories" className="btn btn-sm btn-outline mt-2">Review</Link>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '1.5rem' }}>
                {/* Recent Users */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Users</h3>
                    {recentActivity.recentUsers.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentActivity.recentUsers.map(user => (
                                <div key={user._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{user.username}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>{user.email}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No recent users</p>
                    )}
                </div>

                {/* Recent Events */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Events</h3>
                    {recentActivity.recentEvents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentActivity.recentEvents.map(event => (
                                <div key={event._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>
                                            {new Date(event.startDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No recent events</p>
                    )}
                </div>

                {/* Recent Stories */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Recent Stories</h3>
                    {recentActivity.recentStories.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentActivity.recentStories.map(story => (
                                <div key={story._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{story.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>
                                            <span style={{
                                                padding: '0.15rem 0.4rem',
                                                borderRadius: '8px',
                                                fontSize: '0.7rem',
                                                backgroundColor: story.status === 'published' ? '#E8F5E9' : '#FFF3E0',
                                                color: story.status === 'published' ? '#2E7D32' : '#EF6C00'
                                            }}>
                                                {story.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No recent stories</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const statCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center'
};

export default AdminDashboard;
