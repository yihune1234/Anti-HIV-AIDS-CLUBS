import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';
import { useAuth } from '../../context/AuthContext';

const GalleryItem = ({ item, onClick, onCommentSuccess }) => {
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleQuickComment = async (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent opening modal
        if (!comment.trim()) return;

        setSubmitting(true);
        try {
            await galleryService.commentOnGalleryItem(item._id, comment);
            alert('Comment posted!');
            setComment('');
            if (onCommentSuccess) onCommentSuccess();
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="card p-0"
            style={{
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '320px', // Increased height for comment section
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            onClick={() => onClick(item)}
        >
            {/* Image Section */}
            <div style={{
                flex: 1,
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'url(https://via.placeholder.com/400)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
            }}>
                {/* Gradient Overlay w/ Title */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '1.5rem 1rem 0.5rem',
                    color: 'white'
                }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{item.title}</h4>
                </div>
            </div>

            {/* Inline Comment Section */}
            <div
                style={{ padding: '0.75rem', borderTop: '1px solid #eee' }}
                onClick={e => e.stopPropagation()} // Allow typing without opening modal
            >
                <form onSubmit={handleQuickComment} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="form-control"
                        style={{
                            fontSize: '0.85rem',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            flex: 1
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        disabled={submitting}
                        style={{
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.8rem',
                            minWidth: '60px'
                        }}
                    >
                        {submitting ? '...' : 'Post'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDetails, setItemDetails] = useState(null); // Full details with comments
    const [comment, setComment] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryService.getAllGalleryItems();
            const galleryData = response.data; // response.data.data

            if (galleryData && Array.isArray(galleryData.galleries)) {
                setItems(galleryData.galleries);
            } else if (Array.isArray(galleryData)) {
                setItems(galleryData);
            } else {
                setItems([]);
            }
        } catch (err) {
            setError('Failed to load gallery.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (item) => {
        setSelectedItem(item);
        setLoadingDetails(true);
        try {
            // Fetch full details to get comments
            const details = await galleryService.getGalleryItemById(item._id);
            // API returns { success: true, data: { ... } }
            setItemDetails(details.data || details);
        } catch (err) {
            console.error("Failed to load details", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setSelectedItem(null);
        setItemDetails(null);
        setComment('');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const newComment = await galleryService.commentOnGalleryItem(selectedItem._id, comment);
            // Refresh details
            const details = await galleryService.getGalleryItemById(selectedItem._id);
            setItemDetails(details.data || details);
            setComment('');
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to post comment");
        }
    };

    if (loading) return <div className="container mt-5 text-center">Loading gallery...</div>;
    if (error) return <div className="container mt-5 text-center text-danger">{error}</div>;

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Photo Gallery</h2>

            {/* Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {items.length === 0 ? (
                    <p className="text-muted">No photos available.</p>
                ) : (
                    items.map(item => (
                        <GalleryItem
                            key={item._id}
                            item={item}
                            onClick={openModal}
                        />
                    ))
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedItem && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem'
                }} onClick={closeModal}>

                    <div style={{
                        backgroundColor: 'white',
                        width: '100%',
                        maxWidth: '1000px',
                        height: '80vh',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column', // Vertically stacked as requested
                    }} onClick={e => e.stopPropagation()}>

                        {/* Image Side - Fixed Height or Auto */}
                        <div style={{ flex: '0 0 auto', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', maxHeight: '60vh' }}>
                            <img
                                src={selectedItem.imageUrl}
                                alt={selectedItem.title}
                                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }}
                            />
                        </div>

                        {/* Details & Comments Section */}
                        <div style={{ flex: '1 1 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', borderTop: '1px solid #eee', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 0.5rem' }}>{selectedItem.title}</h3>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{selectedItem.description}</p>
                            </div>

                            <hr style={{ margin: '0 0 1rem 0', borderTop: '1px solid #eee' }} />

                            {/* Comments Section */}
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                                <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Comments</h4>
                                {loadingDetails ? (
                                    <p className="text-muted text-center">Loading comments...</p>
                                ) : (
                                    (itemDetails?.comments && itemDetails.comments.length > 0) ? (
                                        itemDetails.comments.map((c, idx) => (
                                            <div key={idx} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                                    {c.user?.name?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{c.user?.name || 'User'}</div>
                                                    <div style={{ fontSize: '0.9rem', color: '#333' }}>{c.content}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center" style={{ fontSize: '0.9rem' }}>No comments yet. Be the first!</p>
                                    )
                                )}
                            </div>

                            {/* Comment Input */}
                            <form onSubmit={handleCommentSubmit} style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    style={{ fontSize: '0.9rem' }}
                                />
                                <button type="submit" className="btn btn-primary mt-2" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Post</button>
                            </form>
                        </div>

                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '2rem',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
