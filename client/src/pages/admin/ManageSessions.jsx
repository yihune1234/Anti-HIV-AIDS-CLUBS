import React, { useState, useEffect } from 'react';
import sessionService from '../../services/sessionService';
import adminService from '../../services/adminService';


const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
};

const ManageSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [users, setUsers] = useState([]);
    const [viewingParticipants, setViewingParticipants] = useState(null);

    // Helper function to get friendly error message
    const getFriendlyError = (error) => {
        if (!error) return 'An unexpected error occurred. Please try again.';
        const errorMsg = error.message || error.response?.data?.message || error.toString();
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        if (lowerMsg.includes('unauthorized') || lowerMsg.includes('token')) {
            return 'Your session has expired. Please log in again.';
        }
        if (lowerMsg.includes('validation') || lowerMsg.includes('invalid')) {
            return 'Please check your input and try again.';
        }
        if (lowerMsg.includes('500') || lowerMsg.includes('server error')) {
            return 'A server error occurred. Please try again later.';
        }
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: 'HIV/AIDS Awareness',
        sessionType: 'workshop',
        educators: [],
        date: '',
        startTime: '',
        endTime: '',
        location: {
            venue: '',
            room: '',
            building: '',
            isOnline: false,
            onlineLink: ''
        },
        expectedParticipants: 0,
        status: 'upcoming'
    });

    const topics = [
        'HIV/AIDS Awareness', 'Sexual Health', 'Mental Health', 'Substance Abuse Prevention',
        'Gender-Based Violence', 'Reproductive Health', 'STI Prevention', 'Healthy Relationships',
        'Consent Education', 'Life Skills', 'Stress Management', 'Other'
    ];

    const sessionTypes = [
        'workshop', 'seminar', 'group_discussion', 'one_on_one',
        'presentation', 'interactive', 'online', 'other'
    ];

    useEffect(() => {
        fetchSessions();
        fetchUsers();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await sessionService.getAllSessions({});
            setSessions(response.data || []);
        } catch (error) {
            alert('⚠️ Error loading sessions: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await adminService.getAllUsers({ limit: 100 });
            if (data.success) {
                setUsers(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const viewParticipants = async (sessionId) => {
        try {
            const response = await sessionService.getSessionById(sessionId);
            setViewingParticipants(response.data);
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleCreate = () => {
        setEditingSession(null);
        setFormData({
            title: '',
            description: '',
            topic: 'HIV/AIDS Awareness',
            sessionType: 'workshop',
            educators: [],
            date: '',
            startTime: '',
            endTime: '',
            location: { venue: '', room: '', building: '', isOnline: false, onlineLink: '' },
            expectedParticipants: 0,
            status: 'upcoming'
        });
        setIsModalOpen(true);
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setFormData({
            title: session.title,
            description: session.description,
            topic: session.topic,
            sessionType: session.sessionType,
            educators: session.educators.map(e => e._id),
            date: session.date.split('T')[0],
            startTime: session.startTime,
            endTime: session.endTime,
            location: session.location,
            expectedParticipants: session.expectedParticipants || 0,
            status: session.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSession) {
                await sessionService.updateSession(editingSession._id, formData);
                alert('✅ Session updated successfully!');
            } else {
                await sessionService.createSession(formData);
                alert('✅ Session created successfully!');
            }
            setIsModalOpen(false);
            fetchSessions();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            try {
                await sessionService.deleteSession(id);
                alert('✅ Session deleted successfully!');
                fetchSessions();
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [field]: type === 'checkbox' ? checked : value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            upcoming: { backgroundColor: '#E3F2FD', color: '#1976D2' },
            ongoing: { backgroundColor: '#E8F5E9', color: '#388E3C' },
            completed: { backgroundColor: '#F5F5F5', color: '#616161' },
            cancelled: { backgroundColor: '#FFEBEE', color: '#D32F2F' }
        };
        return (
            <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem',
                fontWeight: '500', textTransform: 'capitalize', ...styles[status]
            }}>
                {status}
            </span>
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Peer Education Sessions</h2>
                <button className="btn btn-primary" onClick={handleCreate}>+ Create New Session</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Session</th>
                                <th>Topic & Type</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Participants</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td data-label="Session">
                                        <div style={{ fontWeight: 'bold' }}>{session.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {session.description}
                                        </div>
                                    </td>
                                    <td data-label="Topic & Type">
                                        <div style={{ fontSize: '0.9rem' }}>{session.topic}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'capitalize' }}>
                                            {session.sessionType.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td data-label="Date & Time">
                                        <div>{new Date(session.date).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>
                                            {session.startTime} - {session.endTime}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                                            📍 {session.location?.venue}
                                        </div>
                                    </td>
                                    <td data-label="Status">{getStatusBadge(session.status)}</td>
                                    <td data-label="Participants">
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#388E3C' }}>
                                            {session.totalParticipants || 0}
                                        </div>
                                        <button
                                            onClick={() => viewParticipants(session._id)}
                                            style={{ fontSize: '0.75rem', color: '#1976D2', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            View List
                                        </button>
                                    </td>
                                    <td data-label="Actions">
                                        <button
                                            className="btn btn-outline"
                                            style={{ marginRight: '0.5rem', color: '#333', borderColor: '#ddd', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleEdit(session)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleDelete(session._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {sessions.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                            No sessions found. Create your first session!
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{editingSession ? 'Edit Session' : 'Create New Session'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Session Title</label>
                                <input type="text" className="form-control" required name="title" value={formData.title} onChange={handleChange} placeholder="e.g., HIV Prevention Workshop" />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Topic</label>
                                    <select className="form-control" name="topic" value={formData.topic} onChange={handleChange} required>
                                        {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Session Type</label>
                                    <select className="form-control" name="sessionType" value={formData.sessionType} onChange={handleChange} required>
                                        {sessionTypes.map(type => <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="3" required name="description" value={formData.description} onChange={handleChange}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Date</label>
                                    <input type="date" className="form-control" required name="date" value={formData.date} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Start Time</label>
                                    <input type="time" className="form-control" required name="startTime" value={formData.startTime} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">End Time</label>
                                    <input type="time" className="form-control" required name="endTime" value={formData.endTime} onChange={handleChange} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label className="form-label">Venue</label>
                                    <input type="text" className="form-control" required name="location.venue" value={formData.location.venue} onChange={handleChange} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Room</label>
                                    <input type="text" className="form-control" name="location.room" value={formData.location.room} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><input type="checkbox" name="location.isOnline" checked={formData.location.isOnline} onChange={handleChange} /> Online Session</label>
                            </div>

                            {formData.location.isOnline && (
                                <div className="form-group">
                                    <label className="form-label">Meeting Link</label>
                                    <input type="url" className="form-control" name="location.onlineLink" value={formData.location.onlineLink} onChange={handleChange} />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingSession ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Participants Modal */}
            {viewingParticipants && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Session Details - {viewingParticipants.title}</h3>

                        {/* Educators Section */}
                        {viewingParticipants.educators && viewingParticipants.educators.length > 0 && (
                            <div style={{ marginTop: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#333' }}>Educators</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {viewingParticipants.educators.map((educator) => (
                                        <div key={educator._id} style={{
                                            padding: '0.5rem 1rem',
                                            backgroundColor: '#E53935',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {educator.firstName} {educator.lastName}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Participants Section */}
                        <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#333' }}>Participants ({viewingParticipants.participants?.length || 0})</h4>
                        <div style={{ marginTop: '1rem' }}>
                            {viewingParticipants.participants && viewingParticipants.participants.length > 0 ? (
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee' }}>
                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewingParticipants.participants.map((p, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '0.5rem' }}>{p.user?.firstName} {p.user?.lastName}</td>
                                                <td style={{ padding: '0.5rem' }}>{p.user?.email}</td>
                                                <td style={{ padding: '0.5rem' }}>{new Date(p.participationDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No participants yet</p>
                            )}
                        </div>
                        <button className="btn btn-outline" onClick={() => setViewingParticipants(null)} style={{ marginTop: '1rem' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSessions;
