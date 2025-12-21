import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import eventService from '../../services/eventService';
import anonymousQuestionService from '../../services/anonymousQuestionService';
import storyService from '../../services/storyService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalEvents: 0,
        pendingQuestions: 0,
        totalStories: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllStats();
    }, []);

    const fetchAllStats = async () => {
        try {
            // Parallel fetching for performance
            const [userRes, eventRes, questionRes, storyRes] = await Promise.allSettled([
                userService.getUserStats(),
                eventService.getEventStats(),
                anonymousQuestionService.getQuestionStats(),
                storyService.getAllStories() // No stats endpoint, using list count
            ]);

            const newStats = {
                totalMembers: 0,
                totalEvents: 0,
                pendingQuestions: 0,
                totalStories: 0
            };

            // Process Users
            if (userRes.status === 'fulfilled' && userRes.value?.data) {
                // Backend might return { totalUsers: N, activeUsers: M, ... } or just N
                newStats.totalMembers = userRes.value.data.totalUsers || 0;
            }

            // Process Events
            if (eventRes.status === 'fulfilled' && eventRes.value?.data) {
                newStats.totalEvents = eventRes.value.data.totalEvents || 0;
            }

            // Process Questions
            if (questionRes.status === 'fulfilled' && questionRes.value?.data) {
                newStats.pendingQuestions = questionRes.value.data.pendingQuestions || 0;
            }

            // Process Stories (Manual Count)
            if (storyRes.status === 'fulfilled' && storyRes.value?.data) {
                // If paginated response: { data: { stories: [], pagination: { totalDocs: N } } }
                if (storyRes.value.data.pagination) {
                    newStats.totalStories = storyRes.value.data.pagination.totalDocs || 0;
                } else if (Array.isArray(storyRes.value.data.stories)) {
                    newStats.totalStories = storyRes.value.data.stories.length;
                } else if (Array.isArray(storyRes.value.data)) {
                    newStats.totalStories = storyRes.value.data.length;
                }
            }

            setStats(newStats);
        } catch (error) {
            console.error("Error loading dashboard stats:", error);
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* Stats Cards */}
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.totalMembers}</h3>
                    <p className="text-muted">Total Members</p>
                    <Link to="/admin/members" className="btn btn-sm btn-outline mt-2">Manage</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.totalEvents}</h3>
                    <p className="text-muted">Total Events</p>
                    <Link to="/admin/events" className="btn btn-sm btn-outline mt-2">Manage</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>❓</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#D32F2F' }}>{stats.pendingQuestions}</h3>
                    <p className="text-muted">Pending Questions</p>
                    <Link to="/admin/questions" className="btn btn-sm btn-outline mt-2">View</Link>
                </div>
                <div className="card" style={statCardStyle}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{stats.totalStories}</h3>
                    <p className="text-muted">Stories Published</p>
                    <Link to="/admin/stories" className="btn btn-sm btn-outline mt-2">Manage</Link>
                </div>
            </div>

            <div className="card">
                <h3>System Status</h3>
                <p>All systems operational. Select an item from the sidebar to manage content.</p>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e3f2fd', borderRadius: '4px', color: '#0d47a1' }}>
                    <strong>Tip:</strong> You can manage users, approve stories, and answer anonymous questions from the sidebar menu.
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
