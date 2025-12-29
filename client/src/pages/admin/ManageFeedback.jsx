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
                setFeedbacks(prev => prev.map(f => f._id === id ? { ...f, status } : f));
                setSelectedFeedback(prev => prev && prev._id === id ? { ...prev, status } : prev);
            }
        } catch (err) {
            console.error('Failed to update status:', err);
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

            <div className={`feedback-container ${selectedFeedback ? 'has-selection' : ''}`}>
                {/* List Section */}
                <div className={`card list-section ${selectedFeedback ? 'hide-on-mobile' : ''}`} style={{ padding: '0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div className="table-responsive">
                        <table className="admin-table responsive-table" style={{ margin: 0 }}>
                            <thead style={{ background: '#f8f9fa' }}>
                                <tr>
                                    <th className="hide-mobile">Status</th>
                                    <th>Subject</th>
                                    <th>From</th>
                                    <th className="hide-tablet">Date</th>
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
                                            <td data-label="Status" className="hide-mobile" style={{ verticalAlign: 'middle' }}>
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
                                            <td data-label="Date" className="hide-tablet" style={{ verticalAlign: 'middle', fontSize: '0.85rem' }}>
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

                @media screen and (max-width: 768px) {
                    .admin-table.responsive-table thead {
                        display: none;
                    }

                    .admin-table.responsive-table tbody tr {
                        display: block;
                        margin-bottom: 1.5rem;
                        background: #fff;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                        padding: 1.25rem;
                        border: 1px solid #f0f0f0;
                    }

                    .admin-table.responsive-table tbody td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0.75rem 0;
                        border: none;
                        border-bottom: 1px solid #f8f9fa;
                        text-align: right;
                    }

                    .admin-table.responsive-table tbody td:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }

                    .admin-table.responsive-table tbody td:before {
                        content: attr(data-label);
                        font-weight: 700;
                        color: #666;
                        text-align: left;
                        padding-right: 1rem;
                        text-transform: uppercase;
                        font-size: 0.8rem;
                    }
                    
                    /* Specific adjustments for content cells */
                    .admin-table.responsive-table tbody td[data-label="Subject"],
                    .admin-table.responsive-table tbody td[data-label="From"] {
                        flex-direction: column;
                        align-items: flex-end;
                        text-align: right;
                    }
                    
                    .admin-table.responsive-table tbody td[data-label="Subject"]:before,
                    .admin-table.responsive-table tbody td[data-label="From"]:before {
                         align-self: flex-start;
                         margin-bottom: 0.25rem;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ManageFeedback;
