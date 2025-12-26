import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';
import { useAuth } from '../../context/AuthContext';

const GalleryItem = ({ item, onClick, onLike, currentUserId, onCommentSubmit }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const imageUrl = (item.images && item.images.length > 0) ? item.images[0].url : (item.imageUrl || 'https://via.placeholder.com/400');
    const hasLiked = (item.likes || []).some(l => (l._id || l) === currentUserId);
    const likeCount = item.totalLikes || (item.likes ? item.likes.length : 0);
    const commentCount = item.totalComments || (item.comments ? item.comments.length : 0);

    const handleQuickComment = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            await onCommentSubmit(item._id, commentText);
            setCommentText('');
            setIsCommentOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(item)}
            className="gallery-card"
            style={{
                background: 'white',
                borderRadius: '32px',
                overflow: 'hidden',
                boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' : '0 10px 30px -15px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                border: '1px solid #f0f0f0'
            }}
        >
            <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
                <img
                    src={imageUrl}
                    alt={item.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                />

                {/* Visual Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isHovered ? 'rgba(0,0,0,0.3)' : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '2rem',
                    color: 'white',
                    transition: 'all 0.4s ease'
                }}>
                    <div style={{
                        transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease',
                        opacity: 1
                    }}>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            background: 'rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            padding: '4px 10px',
                            borderRadius: '100px',
                            marginBottom: '0.8rem',
                            display: 'inline-block'
                        }}>
                            {item.albumType?.replace('_', ' ') || 'COLLECTION'}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.2' }}>{item.title}</h4>
                    </div>
                </div>

                {/* Quick Actions Overlay */}
                {isHovered && (
                    <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        animation: 'fadeInRight 0.4s ease'
                    }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onLike && onLike(item._id); }}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                border: 'none',
                                background: hasLiked ? '#D32F2F' : 'rgba(255,255,255,0.9)',
                                color: hasLiked ? 'white' : '#D32F2F',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            ❤
                        </button>
                    </div>
                )}
            </div>

            {/* Interaction Footer */}
            <div style={{
                padding: '1.2rem 2rem',
                background: 'white'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isCommentOpen ? '1rem' : '0'
                }}>
                    <div style={{ display: 'flex', gap: '1.2rem' }}>
                        <div
                            onClick={(e) => { e.stopPropagation(); onLike && onLike(item._id); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasLiked ? '#D32F2F' : '#666', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>❤</span> {likeCount}
                        </div>
                        <div
                            onClick={(e) => { e.stopPropagation(); setIsCommentOpen(!isCommentOpen); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isCommentOpen ? '#D32F2F' : '#666', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                        >
                            <span style={{ fontSize: '1.1rem' }}>💬</span> {commentCount}
                        </div>
                    </div>
                    <div style={{ color: '#D32F2F', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                        VIEW DETAILS →
                    </div>
                </div>

                {isCommentOpen && (
                    <form
                        onSubmit={handleQuickComment}
                        onClick={e => e.stopPropagation()}
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            animation: 'fadeInUp 0.3s ease'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="form-control"
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            style={{
                                borderRadius: '20px',
                                background: '#f8f9fa',
                                border: '1px solid #eee',
                                padding: '0.5rem 1rem',
                                fontSize: '0.85rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary btn-sm"
                            style={{ borderRadius: '20px', padding: '0 1rem' }}
                        >
                            {submitting ? '...' : 'Post'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const Gallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDetails, setItemDetails] = useState(null);
    const [comment, setComment] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const { user } = useAuth();
    const currentUserId = user?._id;

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryService.getAllGalleryItems();
            const galleryData = response.data;
            setItems(galleryData.galleries || galleryData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = async (item) => {
        setSelectedItem(item);
        setLoadingDetails(true);
        try {
            const details = await galleryService.getGalleryItemById(item._id);
            setItemDetails(details.data || details);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setSelectedItem(null);
        setItemDetails(null);
        setComment('');
    };

    const handleLike = async (id) => {
        try {
            await galleryService.likeGalleryItem(id);
            // Local update for immediate feedback
            setItems(items.map(item => {
                if (item._id === id) {
                    const likes = item.likes || [];
                    const hasLiked = likes.some(l => (l._id || l) === currentUserId);
                    return {
                        ...item,
                        likes: hasLiked ? likes.filter(l => (l._id || l) !== currentUserId) : [...likes, currentUserId],
                        totalLikes: hasLiked ? (item.totalLikes || 1) - 1 : (item.totalLikes || 0) + 1
                    };
                }
                return item;
            }));

            if (selectedItem && selectedItem._id === id) {
                const details = await galleryService.getGalleryItemById(id);
                setItemDetails(details.data || details);
            }
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await galleryService.commentOnGalleryItem(selectedItem._id, comment);
            const details = await galleryService.getGalleryItemById(selectedItem._id);
            setItemDetails(details.data || details);
            setComment('');
            // Also update total comments in the main list
            setItems(items.map(it => it._id === selectedItem._id ? { ...it, totalComments: (it.totalComments || 0) + 1 } : it));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-danger" role="status"></div>
            <p style={{ marginTop: '1rem', color: '#666', fontWeight: '500' }}>Preparing the gallery...</p>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <style>
                {`
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }
                .gallery-card:hover img {
                    transform: scale(1.08);
                }
                `}
            </style>

            <div className="mb-5 text-center" style={{ animation: 'fadeInDown 0.8s ease' }}>
                <span style={{
                    color: '#D32F2F',
                    fontWeight: '900',
                    letterSpacing: '4px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    display: 'block'
                }}>Visual Legacy</span>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px' }}>Captured <span style={{ color: '#D32F2F' }}>Moments</span></h1>
                <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Authentic stories and shared experiences from our vibrant community of change-makers.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2.5rem',
                animation: 'fadeInUp 1s ease'
            }}>
                {items.map(item => (
                    <GalleryItem
                        key={item._id}
                        item={item}
                        onClick={openModal}
                        onLike={handleLike}
                        onCommentSubmit={(id, text) => galleryService.commentOnGalleryItem(id, text).then(() => {
                            setItems(items.map(it => it._id === id ? { ...it, totalComments: (it.totalComments || 0) + 1 } : it));
                        })}
                        currentUserId={currentUserId}
                    />
                ))}
            </div>

            {/* Premium Lightbox Modal */}
            {selectedItem && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.98)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backdropFilter: 'blur(15px)'
                }} onClick={closeModal}>

                    <button
                        onClick={closeModal}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: 'white',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            fontSize: '2rem',
                            cursor: 'pointer',
                            zIndex: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        &times;
                    </button>

                    <div style={{
                        background: 'white',
                        width: '100%',
                        maxWidth: '1200px',
                        height: '85vh',
                        borderRadius: '40px',
                        display: 'grid',
                        gridTemplateColumns: '1.4fr 1fr',
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
                    }} onClick={e => e.stopPropagation()}>

                        {/* Image Viewer */}
                        <div style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <img
                                src={(selectedItem.images && selectedItem.images.length > 0) ? selectedItem.images[0].url : selectedItem.imageUrl}
                                alt={selectedItem.title}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </div>

                        {/* Interaction Bar */}
                        <div style={{ display: 'flex', flexDirection: 'column', background: 'white', height: '100%' }}>
                            <div style={{ padding: '3rem', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '900', background: '#F8F9FA', color: '#D32F2F', padding: '6px 15px', borderRadius: '100px', border: '1px solid #eee' }}>MEMBER EXCLUSIVE</span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '2.2rem', fontWeight: '800', marginBottom: '1.2rem', letterSpacing: '-0.5px' }}>{selectedItem.title}</h3>
                                <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>{selectedItem.description}</p>

                                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                                    <button
                                        onClick={() => handleLike(selectedItem._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: (itemDetails?.likes || []).some(l => (l._id || l) === currentUserId) ? '#D32F2F' : '#111',
                                            fontWeight: '700',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.4rem' }}>❤</span> {itemDetails?.totalLikes || itemDetails?.likes?.length || 0}
                                    </button>
                                    <button
                                        onClick={() => document.getElementById('modal-comment-input')?.focus()}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.6rem',
                                            color: '#666',
                                            fontWeight: '600'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.4rem' }}>💬</span> {itemDetails?.comments?.length || 0}
                                    </button>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#666', fontWeight: '600' }}>
                                        <span style={{ fontSize: '1.4rem' }}>👁</span> {itemDetails?.views || 0} Views
                                    </div>
                                </div>
                            </div>

                            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '3rem' }}>
                                <h4 style={{ fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '2.5rem' }}>
                                    Conversation ({itemDetails?.comments?.length || 0})
                                </h4>

                                {loadingDetails ? (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <div className="spinner-border spinner-border-sm text-danger"></div>
                                    </div>
                                ) : (
                                    (itemDetails?.comments || []).length > 0 ? (
                                        (itemDetails?.comments || []).map((c, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '1.2rem', marginBottom: '2.5rem', animation: 'fadeInUp 0.4s ease' }}>
                                                <div style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '16px',
                                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '0.9rem',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                                                }}>
                                                    {c.user?.profileImage ? <img src={c.user.profileImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (c.user?.firstName?.[0] || 'U')}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{c.user ? `${c.user.firstName} ${c.user.lastName}` : 'Club Member'}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#bbb' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>{c.content}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '2rem', color: '#bbb' }}>
                                            <p>No comments yet. Start the conversation!</p>
                                        </div>
                                    )
                                )}
                            </div>

                            <form onSubmit={handleCommentSubmit} style={{ padding: '2rem 3rem', borderTop: '1px solid #f0f0f0', background: '#fcfcfc', display: 'flex', gap: '1.2rem' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        id="modal-comment-input"
                                        type="text"
                                        className="form-control"
                                        placeholder="Add to the conversation..."
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        style={{
                                            borderRadius: '20px',
                                            background: 'white',
                                            border: '1px solid #efefef',
                                            padding: '1.2rem 1.8rem',
                                            fontSize: '1rem',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.02)'
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '0 2.5rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
