import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const ContentApproval = () => {
    const [pendingContent, setPendingContent] = useState({
        stories: [],
        resources: [],
        galleries: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stories');
    const [reviewNotes, setReviewNotes] = useState({});

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
        fetchPendingContent();
    }, []);

    const fetchPendingContent = async () => {
        try {
            const result = await adminService.getPendingContent();
            if (result.success) {
                setPendingContent(result.data);
            }
        } catch (error) {
            alert('⚠️ Error loading pending content: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (type, id) => {
        try {
            const notes = reviewNotes[id] || '';
            await adminService.approveContent(type, id, notes);
            alert('✅ Content approved successfully!');

            // Remove from pending list
            setPendingContent(prev => ({
                ...prev,
                [type + 's']: prev[type + 's'].filter(item => item._id !== id)
            }));

            setReviewNotes(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleReject = async (type, id) => {
        const notes = reviewNotes[id];
        if (!notes) {
            alert('⚠️ Please provide rejection notes');
            return;
        }

        try {
            await adminService.rejectContent(type, id, notes);
            alert('✅ Content rejected successfully');

            // Remove from pending list
            setPendingContent(prev => ({
                ...prev,
                [type + 's']: prev[type + 's'].filter(item => item._id !== id)
            }));

            setReviewNotes(prev => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    if (loading) return <div className="text-center p-5">Loading pending content...</div>;

    const renderStories = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingContent.stories.length > 0 ? (
                pendingContent.stories.map(story => (
                    <div key={story._id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{story.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#777' }}>
                                    By: {story.isAnonymous ? 'Anonymous' : `${story.author?.firstName} ${story.author?.lastName}`}
                                    {' • '}
                                    {new Date(story.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <span style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: '#FFF3E0',
                                color: '#EF6C00'
                            }}>
                                {story.category}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1rem', color: '#555', lineHeight: '1.6' }}>
                            {story.content.substring(0, 300)}
                            {story.content.length > 300 && '...'}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Review Notes</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                placeholder="Add notes for approval/rejection..."
                                value={reviewNotes[story._id] || ''}
                                onChange={(e) => setReviewNotes(prev => ({ ...prev, [story._id]: e.target.value }))}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleApprove('story', story._id)}
                            >
                                ✓ Approve & Publish
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ borderColor: '#ffcdd2', color: '#d32f2f' }}
                                onClick={() => handleReject('story', story._id)}
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>
                    No pending stories to review
                </div>
            )}
        </div>
    );

    const renderResources = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingContent.resources.length > 0 ? (
                pendingContent.resources.map(resource => (
                    <div key={resource._id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{resource.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#777' }}>
                                    Uploaded by: {resource.uploadedBy?.firstName} {resource.uploadedBy?.lastName}
                                    {' • '}
                                    {new Date(resource.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem', color: '#555' }}>
                            {resource.description}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Review Notes</label>
                            <textarea
                                className="form-control"
                                rows="2"
                                value={reviewNotes[resource._id] || ''}
                                onChange={(e) => setReviewNotes(prev => ({ ...prev, [resource._id]: e.target.value }))}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleApprove('resource', resource._id)}
                            >
                                ✓ Approve
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ borderColor: '#ffcdd2', color: '#d32f2f' }}
                                onClick={() => handleReject('resource', resource._id)}
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>
                    No pending resources to review
                </div>
            )}
        </div>
    );

    const renderGalleries = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingContent.galleries.length > 0 ? (
                pendingContent.galleries.map(gallery => (
                    <div key={gallery._id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{gallery.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#777' }}>
                                    Uploaded by: {gallery.uploadedBy?.firstName} {gallery.uploadedBy?.lastName}
                                    {' • '}
                                    {new Date(gallery.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleApprove('gallery', gallery._id)}
                            >
                                ✓ Approve
                            </button>
                            <button
                                className="btn btn-outline"
                                style={{ borderColor: '#ffcdd2', color: '#d32f2f' }}
                                onClick={() => handleReject('gallery', gallery._id)}
                            >
                                ✗ Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#777' }}>
                    No pending gallery items to review
                </div>
            )}
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Content Approval</h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #eee', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setActiveTab('stories')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'stories' ? '3px solid #ffeb3b' : 'none',
                        fontWeight: activeTab === 'stories' ? '600' : '400',
                        color: activeTab === 'stories' ? '#1a1a2e' : '#777'
                    }}
                >
                    Stories ({pendingContent.stories.length})
                </button>
                <button
                    onClick={() => setActiveTab('resources')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'resources' ? '3px solid #ffeb3b' : 'none',
                        fontWeight: activeTab === 'resources' ? '600' : '400',
                        color: activeTab === 'resources' ? '#1a1a2e' : '#777'
                    }}
                >
                    Resources ({pendingContent.resources.length})
                </button>
                <button
                    onClick={() => setActiveTab('galleries')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'galleries' ? '3px solid #ffeb3b' : 'none',
                        fontWeight: activeTab === 'galleries' ? '600' : '400',
                        color: activeTab === 'galleries' ? '#1a1a2e' : '#777'
                    }}
                >
                    Gallery ({pendingContent.galleries.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'stories' && renderStories()}
            {activeTab === 'resources' && renderResources()}
            {activeTab === 'galleries' && renderGalleries()}
        </div>
    );
};

export default ContentApproval;
