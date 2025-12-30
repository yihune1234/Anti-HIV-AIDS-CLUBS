import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

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
            setError('⚠️ Error loading feedbacks: ' + getFriendlyError(err));
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const response = await api.patch(`/feedback/${id}`, { status });
            if (response.data.success) {
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
                setSelectedFeedback(prev => prev && prev._id === id ? { ...prev, status } : prev);
            }
        } catch (err) {
            alert('⚠️ ' + getFriendlyError(err));
        }
    };

    const handleSelectFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        if (feedback.status === 'unread') {
            updateStatus(feedback._id, 'read');
        }
    };

    const deleteFeedback = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            const response = await api.delete(`/feedback/${id}`);
            if (response.data.success) {
                alert('✅ Feedback deleted successfully!');
                setFeedbacks(feedbacks.filter(f => f._id !== id));
                setSelectedFeedback(null);
            }
        } catch (err) {
            alert('⚠️ ' + getFriendlyError(err));
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

            <div className={`feedback-container ${selectedFeedback ? 'has-selection' : ''}`}>
                {/* List Section */}
                <div className={`card list-section ${selectedFeedback ? 'hide-on-mobile' : ''}`} style={{ padding: '0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="admin-table" style={{ margin: 0 }}>
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
                                            onClick={() => handleSelectFeedback(feedback)}
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button 
                                    onClick={() => setSelectedFeedback(null)} 
                                    className="btn btn-sm btn-outline show-on-mobile"
                                    style={{ padding: '4px 8px' }}
                                >
                                    ← Back
                                </button>
                                <h3 style={{ margin: 0, fontWeight: '800' }}>Message Details</h3>
                            </div>
                            <button onClick={() => setSelectedFeedback(null)} className="btn-close hide-on-mobile"></button>
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

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <a href={`mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject} - HU Anti-HIV/AIDS Club`}
                                className="btn btn-primary" style={{ flex: '2 1 200px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ✉️ Reply via Email
                            </a>
                            <button 
                                onClick={() => updateStatus(selectedFeedback._id, selectedFeedback.status === 'read' ? 'unread' : 'read')} 
                                className="btn btn-outline" 
                                style={{ flex: '1 1 150px', borderRadius: '12px' }}
                            >
                                {selectedFeedback.status === 'unread' ? '👁️ Mark as Read' : '📩 Mark Unread'}
                            </button>
                            {selectedFeedback.status !== 'archived' && (
                                <button onClick={() => updateStatus(selectedFeedback._id, 'archived')} className="btn btn-outline" style={{ flex: '1 1 150px', borderRadius: '12px' }}>
                                    📦 Archive
                                </button>
                            )}
                            <button 
                                onClick={() => deleteFeedback(selectedFeedback._id)} 
                                className="btn btn-outline text-danger" 
                                style={{ flex: '1 1 150px', borderRadius: '12px', borderColor: '#ffcdd2' }}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                
                 /* Desktop Grid Layout */
                .feedback-container {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                
                @media screen and (min-width: 1025px) {
                    .feedback-container.has-selection {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                 /* Card/Grid Layout for Mobile */
                @media screen and (max-width: 1024px) {
                    .feedback-container.has-selection {
                        grid-template-columns: 1fr;
                    }
                    
                    .hide-on-mobile {
                        display: none !important;
                    }
                    
                    .show-on-mobile {
                        display: flex !important;
                    }
                }

                .show-on-mobile {
                    display: none;
                }

                 }
                 `}
             </style>
        </div>
    );
};

export default ManageFeedback;
