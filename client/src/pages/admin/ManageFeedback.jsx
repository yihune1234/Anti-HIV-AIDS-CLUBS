import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/feedback');
            if (response.data.success) {
                setFeedbacks(response.data.data);
            }
        } catch (err) {
            setError('Failed to fetch feedback messages');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await api.patch(`/feedback/${id}`, { status });
            if (response.data.success) {
                setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status } : f));
                if (selectedFeedback?._id === id) {
                    setSelectedFeedback({ ...selectedFeedback, status });
                }
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteFeedback = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await api.delete(`/feedback/${id}`);
            if (response.data.success) {
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                setSelectedFeedback(null);
            }
        } catch (err) {
            alert('Failed to delete message');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'unread': return '#E53935';
            case 'read': return '#43A047';
            case 'archived': return '#757575';
            default: return '#000';
        }
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontWeight: '800', margin: 0 }}>Manage <span style={{ color: '#D32F2F' }}>Feedback</span></h2>
                    <p style={{ color: '#666', margin: 0 }}>Review and respond to messages from the club community.</p>
                </div>
                <button onClick={fetchFeedbacks} className="btn btn-outline btn-sm">Refresh List</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedFeedback ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                {/* List Section */}
                <div className="card" style={{ padding: '0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="admin-table responsive-table" style={{ margin: 0 }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th>Status</th>
                                    <th>Subject</th>
                                    <th>From</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-5">No messages found</td></tr>
                                ) : (
                                    feedbacks.map(feedback => (
                                        <tr key={feedback._id}
                                            style={{
                                                cursor: 'pointer',
                                                background: selectedFeedback?._id === feedback._id ? '#fff5f5' : 'transparent',
                                                fontWeight: feedback.status === 'unread' ? 'bold' : 'normal'
                                            }}
                                            onClick={() => setSelectedFeedback(feedback)}
                                        >
                                            <td data-label="Status" style={{ verticalAlign: 'middle' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '100px',
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    background: `${getStatusColor(feedback.status)}20`,
                                                    color: getStatusColor(feedback.status),
                                                    border: `1px solid ${getStatusColor(feedback.status)}`
                                                }}>
                                                    {feedback.status}
                                                </span>
                                            </td>
                                            <td data-label="Subject" style={{ verticalAlign: 'middle' }}>
                                                <div>{feedback.subject}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 'normal' }}>
                                                    {feedback.message.substring(0, 30)}...
                                                </div>
                                            </td>
                                            <td data-label="From" style={{ verticalAlign: 'middle' }}>
                                                <div>{feedback.name}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.6, fontWeight: 'normal' }}>{feedback.email}</div>
                                            </td>
                                            <td data-label="Date" style={{ verticalAlign: 'middle', fontSize: '0.85rem' }}>
                                                {new Date(feedback.createdAt).toLocaleDateString()}
                                            </td>
                                            <td data-label="Actions" style={{ verticalAlign: 'middle' }} onClick={e => e.stopPropagation()}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => updateStatus(feedback._id, feedback.status === 'read' ? 'unread' : 'read')} className="btn btn-sm" title="Toggle Read Status">
                                                        {feedback.status === 'unread' ? '👁️' : '📩'}
                                                    </button>
                                                    <button onClick={() => deleteFeedback(feedback._id)} className="btn btn-sm text-danger" title="Delete">🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detail view */}
                {selectedFeedback && (
                    <div className="card" style={{ padding: '2rem', borderRadius: '30px', animation: 'slideInRight 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontWeight: '800' }}>Message Details</h3>
                            <button onClick={() => setSelectedFeedback(null)} className="btn-close"></button>
                        </div>

                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', color: '#666' }}>From:</span>
                                <div>
                                    <strong>{selectedFeedback.name}</strong><br />
                                    <span style={{ color: '#D32F2F' }}>{selectedFeedback.email}</span>
                                </div>
                                <span style={{ fontWeight: 'bold', color: '#666' }}>Subject:</span>
                                <span>{selectedFeedback.subject}</span>
                                <span style={{ fontWeight: 'bold', color: '#666' }}>Date:</span>
                                <span>{new Date(selectedFeedback.createdAt).toLocaleString()}</span>
                            </div>
                            <hr style={{ opacity: 0.1 }} />
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.1rem' }}>
                                {selectedFeedback.message}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href={`mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject} - HU Anti-HIV/AIDS Club`}
                                className="btn btn-primary" style={{ flex: 1, borderRadius: '12px' }}>
                                Reply via Email
                            </a>
                            {selectedFeedback.status !== 'archived' && (
                                <button onClick={() => updateStatus(selectedFeedback._id, 'archived')} className="btn btn-outline" style={{ flex: 1, borderRadius: '12px' }}>
                                    Archive Message
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .table th { border: none; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; color: #666; letter-spacing: 1px; padding: 1.2rem 1rem; }
                .table td { border-top: 1px solid #f0f0f0; padding: 1.2rem 1rem; }
                `}
            </style>
        </div>
    );
};

export default ManageFeedback;
