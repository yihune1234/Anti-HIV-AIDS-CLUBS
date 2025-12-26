import { useState, useEffect } from 'react';
import sessionService from '../../services/sessionService';
import './PeerEducationSessions.css';

const PeerEducationSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', topic: '' });
    const [selectedSession, setSelectedSession] = useState(null);
    const [myParticipation, setMyParticipation] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchSessions();
        fetchMyParticipation();
    }, [filter]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await sessionService.getAllSessions(filter);
            setSessions(response.data || []);
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyParticipation = async () => {
        try {
            const response = await sessionService.getMyParticipation();
            setMyParticipation(response.data || []);
        } catch (error) {
            console.error('Failed to load participation history', error);
        }
    };

    const handleParticipate = async (sessionId) => {
        try {
            await sessionService.markParticipation(sessionId);
            alert('Successfully registered for the session!');
            fetchSessions();
            fetchMyParticipation();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register');
        }
    };

    const viewSessionDetails = async (sessionId) => {
        try {
            const response = await sessionService.getSessionById(sessionId);
            setSelectedSession(response.data);
        } catch (error) {
            alert('Failed to load details');
        }
    };

    const hasParticipated = (sessionId) => {
        return myParticipation.some(p => p.session?._id === sessionId || p.session === sessionId);
    };

    const topics = [
        'HIV/AIDS Awareness', 'Mental Health', 'Substance Abuse Prevention',
        'Gender-Based Violence', 'Reproductive Health', 'STI Prevention',
        'Healthy Relationships', 'Stress Management', 'Life Skills'
    ];

    if (loading && sessions.length === 0) return (
        <div className="sessions-loading">
            <div className="spinner"></div>
            <p>Loading sessions...</p>
        </div>
    );

    const filteredList = sessions.filter(s => {
        if (activeTab === 'registered') return hasParticipated(s._id);
        if (activeTab === 'upcoming') return s.status === 'upcoming' && !hasParticipated(s._id);
        return true;
    });

    return (
        <div className="peer-sessions-container">
            <div className="page-header">
                <div className="header-content">
                    <h1>Peer Education & Awareness</h1>
                    <p>Join sessions led by peer educators to learn, share, and grow.</p>
                </div>
                <div className="participation-summary glass-card">
                    <div className="stat">
                        <span className="value">{myParticipation.length}</span>
                        <span className="label">My Sessions</span>
                    </div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="controls-grid">
                <div className="tabs-bar glass-card">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Sessions
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Available
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'registered' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registered')}
                    >
                        My Registration
                    </button>
                </div>

                <div className="filters-bar glass-card">
                    <select
                        value={filter.topic}
                        onChange={(e) => setFilter({ ...filter, topic: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Topics</option>
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">Any Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Sessions Grid */}
            <div className="sessions-grid">
                {filteredList.map((session) => (
                    <div key={session._id} className="session-card-modern glass-card">
                        <div className="card-status">
                            <span className={`badge ${session.status}`}>{session.status}</span>
                            {hasParticipated(session._id) && <span className="badge-participated">Registered</span>}
                        </div>

                        <div className="card-content">
                            <div className="topic-icon">
                                {session.topic.includes('Awareness') ? '🛡️' :
                                    session.topic.includes('Mental') ? '🧠' :
                                        session.topic.includes('Health') ? '🏥' : '📚'}
                            </div>
                            <h3>{session.title}</h3>
                            <p className="topic-text">{session.topic}</p>

                            <div className="meta-info">
                                <div className="meta-item">
                                    <span className="icon">📅</span>
                                    <span>{new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="icon">⏰</span>
                                    <span>{session.startTime}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="icon">📍</span>
                                    <span>{session.location.venue}</span>
                                </div>
                            </div>

                            <p className="description-preview">
                                {session.description.substring(0, 120)}...
                            </p>
                        </div>

                        <div className="card-footer">
                            <button onClick={() => viewSessionDetails(session._id)} className="btn-details">
                                View Details
                            </button>

                            {session.status === 'upcoming' && !hasParticipated(session._id) ? (
                                <button onClick={() => handleParticipate(session._id)} className="btn-participate">
                                    Register Now
                                </button>
                            ) : hasParticipated(session._id) ? (
                                <button className="btn-registered" disabled>
                                    ✓ Attending
                                </button>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>

            {filteredList.length === 0 && (
                <div className="empty-state-container glass-card">
                    <div className="empty-icon">🌱</div>
                    <h3>No sessions found</h3>
                    <p>Check back later for new peer education workshops and sessions.</p>
                </div>
            )}

            {/* Session Detail Modal */}
            {selectedSession && (
                <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
                    <div className="modal-content-modern glass-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className={`status-tag ${selectedSession.status}`}>{selectedSession.status}</span>
                            <button className="close-btn" onClick={() => setSelectedSession(null)}>×</button>
                        </div>

                        <div className="modal-body">
                            <h2 className="modal-title">{selectedSession.title}</h2>
                            <div className="modal-topic">{selectedSession.topic}</div>

                            <div className="info-grid">
                                <div className="info-box">
                                    <span className="label">Date</span>
                                    <span className="value">{new Date(selectedSession.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="info-box">
                                    <span className="label">Time</span>
                                    <span className="value">{selectedSession.startTime} - {selectedSession.endTime}</span>
                                </div>
                                <div className="info-box">
                                    <span className="label">Venue</span>
                                    <span className="value">{selectedSession.location.venue}</span>
                                </div>
                                <div className="info-box">
                                    <span className="label">Type</span>
                                    <span className="value">{selectedSession.sessionType}</span>
                                </div>
                            </div>

                            <div className="description-section">
                                <h3>About the Session</h3>
                                <p>{selectedSession.description}</p>
                            </div>

                            {selectedSession.educators?.length > 0 && (
                                <div className="educators-section">
                                    <h3>Peer Educators</h3>
                                    <div className="educator-list">
                                        {selectedSession.educators.map(e => (
                                            <div key={e._id} className="educator-item">
                                                <div className="avatar-small">{e.firstName[0]}</div>
                                                <span>{e.firstName} {e.lastName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedSession.status === 'upcoming' && !hasParticipated(selectedSession._id) && (
                                <button
                                    onClick={() => handleParticipate(selectedSession._id)}
                                    className="modal-action-btn"
                                >
                                    Confirm Registration
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerEducationSessions;
