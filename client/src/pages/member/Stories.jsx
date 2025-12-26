import React, { useState, useEffect } from 'react';
import storyService from '../../services/storyService';
import uploadService from '../../services/uploadService';
import { useAuth } from '../../context/AuthContext';

const StoryCard = ({ story, onLike, onCommentToggle, isActive, commentTexts, setCommentTexts, onCommentSubmit }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuth();
    const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?._id;
    const hasLiked = (story.likes || []).some(l => (l._id || l) === currentUserId);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="story-card"
            style={{
                background: 'white',
                borderRadius: '35px',
                overflow: 'hidden',
                boxShadow: isHovered ? '0 30px 60px -12px rgba(0, 0, 0, 0.15)' : '0 10px 40px -20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #f0f0f0',
                transform: isHovered ? 'translateY(-15px) scale(1.02)' : 'translateY(0) scale(1)',
                position: 'relative'
            }}
        >
            {story.featuredImage && (
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={story.featuredImage}
                        alt={story.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 1.2s ease',
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '1.5rem',
                        left: '1.5rem',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        fontSize: '0.65rem',
                        fontWeight: '900',
                        color: '#D32F2F',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {(story.category || 'IMPACT').replace('_', ' ')}
                    </div>
                </div>
            )}

            <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '1.6rem',
                    fontWeight: '800',
                    marginBottom: '1.2rem',
                    lineHeight: '1.3',
                    letterSpacing: '-0.5px',
                    color: '#1a1a1a'
                }}>{story.title}</h3>
                <p style={{
                    color: '#555',
                    fontSize: '1rem',
                    lineHeight: '1.8',
                    marginBottom: '2rem',
                    display: '-webkit-box',
                    WebkitLineClamp: '4',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {story.content}
                </p>

                <div style={{
                    marginTop: 'auto',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #f5f5f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button
                            onClick={() => onLike(story._id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: hasLiked ? '#D32F2F' : '#999',
                                fontWeight: '700',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>❤</span> {story.totalLikes || (story.likes ? story.likes.length : 0)}
                        </button>
                        <button
                            onClick={() => onCommentToggle(story._id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: isActive ? '#D32F2F' : '#999',
                                fontWeight: '700'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>💬</span> {story.totalComments || (story.comments ? story.comments.length : 0)}
                        </button>
                    </div>
                    <div style={{ color: '#ccc', fontSize: '0.8rem', fontWeight: '600' }}>
                        <span style={{ marginRight: '0.3rem' }}>👁</span> {story.views || 0}
                    </div>
                </div>

                {isActive && (
                    <div style={{ marginTop: '2rem', animation: 'fadeInDown 0.4s ease' }}>
                        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Write a supportive comment..."
                                value={commentTexts[story._id] || ''}
                                onChange={(e) => setCommentTexts({ ...commentTexts, [story._id]: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && onCommentSubmit(story._id)}
                                style={{
                                    borderRadius: '15px',
                                    background: '#f8f9fa',
                                    border: '1px solid #eee',
                                    padding: '0.8rem 1.2rem',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => onCommentSubmit(story._id)}
                                style={{ borderRadius: '15px', padding: '0 1.5rem', fontWeight: '700' }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>→</span>
                            </button>
                        </div>
                        {story.comments && story.comments.length > 0 && (
                            <div className="custom-scrollbar" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {story.comments.map((comment, idx) => (
                                    <div key={idx} style={{
                                        marginBottom: '1rem',
                                        padding: '1.2rem',
                                        background: '#fcfcfc',
                                        borderRadius: '20px',
                                        border: '1px solid #f0f0f0',
                                        animation: 'fadeInUp 0.3s ease'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#333' }}>{comment.user?.firstName || 'Club Member'}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#ccc' }}>{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.5' }}>{comment.content}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div style={{
                padding: '1.5rem 2.5rem',
                background: '#fafafa',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    color: '#D32F2F',
                    fontSize: '0.9rem',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                    {story.isAnonymous ? 'A' : (story.author?.profileImage ? (
                        <img src={story.author.profileImage} alt="Author" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        story.author?.firstName?.[0] || 'U'
                    ))}
                </div>
                <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#333' }}>
                        {story.isAnonymous ? 'Anonymous' : (story.author ? `${story.author.firstName} ${story.author.lastName}` : 'Club Member')}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#bbb', fontWeight: '600' }}>{new Date(story.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
            </div>
        </div>
    );
};

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [commentTexts, setCommentTexts] = useState({});
    const [activeCommentId, setActiveCommentId] = useState(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'awareness',
        imageUrl: '',
        isAnonymous: false
    });

    const categories = [
        'personal_journey', 'recovery', 'awareness', 'prevention',
        'support', 'education', 'advocacy', 'inspiration', 'other'
    ];

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const response = await storyService.getAllStories();
            const storyData = response.data;

            if (storyData && Array.isArray(storyData.stories)) {
                setStories(storyData.stories);
            } else if (Array.isArray(storyData)) {
                setStories(storyData);
            } else {
                setStories([]);
            }
        } catch (err) {
            setError('Failed to load stories.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            await storyService.likeStory(id);
            setStories(stories.map(s => {
                if (s._id === id) {
                    const currentUserId = user?._id || JSON.parse(localStorage.getItem('user'))?._id;
                    const likes = s.likes || [];
                    const hasLiked = likes.some(l => (l._id || l) === currentUserId);
                    return {
                        ...s,
                        likes: hasLiked ? likes.filter(l => (l._id || l) !== currentUserId) : [...likes, currentUserId],
                        totalLikes: hasLiked ? (s.totalLikes || 1) - 1 : (s.totalLikes || 0) + 1
                    };
                }
                return s;
            }));
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const handleComment = async (id) => {
        const text = commentTexts[id];
        if (!text?.trim()) return;

        try {
            await storyService.commentOnStory(id, text);
            setCommentTexts({ ...commentTexts, [id]: '' });
            // Refresh this specific story's data or whole list
            const response = await storyService.getAllStories(); // Simplify for now
            const storyData = response.data;
            const updatedStories = storyData.stories || storyData;
            setStories(Array.isArray(updatedStories) ? updatedStories : stories);
        } catch (err) {
            console.error('Comment failed:', err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
            }
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitStory = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                featuredImage: formData.imageUrl,
                status: 'pending_review'
            };
            await storyService.createStory(payload);
            alert('Your story has been submitted for review! It will be visible once approved.');
            setIsModalOpen(false);
            setFormData({ title: '', content: '', category: 'awareness', imageUrl: '', isAnonymous: false });
        } catch (err) {
            alert('Submission failed: ' + err);
        }
    };

    if (loading && stories.length === 0) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-danger" role="status"></div>
            <p style={{ marginTop: '1rem', color: '#666', fontWeight: '500' }}>Loading voices...</p>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <style>
                {`
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D32F2F; }
                `}
            </style>

            <div className="mb-5 text-center" style={{ animation: 'fadeInDown 0.8s ease' }}>
                <span style={{
                    color: '#D32F2F',
                    fontWeight: '900',
                    letterSpacing: '5px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    display: 'block'
                }}>Collective Voices</span>
                <h1 style={{ fontSize: '3.8rem', fontWeight: '900', marginBottom: '1.2rem', letterSpacing: '-2px' }}>Success <span style={{ color: '#D32F2F' }}>Stories</span></h1>
                <p className="text-muted" style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.7', marginBottom: '3rem' }}>
                    Real narratives that inspire change. Share your journey and become a catalyst for hope in our community.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '1.2rem 3rem',
                        borderRadius: '100px',
                        fontWeight: '800',
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 20px 40px rgba(211, 47, 47, 0.2)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    + Share Your Narrative
                </button>
            </div>

            {stories.length === 0 ? (
                <div className="card" style={{
                    textAlign: 'center',
                    padding: '6rem',
                    borderRadius: '40px',
                    border: '2px dashed #eee',
                    background: 'transparent',
                    animation: 'fadeInUp 1s ease'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✍️</div>
                    <h3 style={{ fontWeight: '800', fontSize: '2rem', marginBottom: '1rem' }}>The Canvas is Empty</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>No stories have been approved yet. Be the visionary who starts the movement!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                    gap: '3rem',
                    animation: 'fadeInUp 1s ease 0.2s',
                    animationFillMode: 'both'
                }}>
                    {stories.map(story => (
                        <StoryCard
                            key={story._id}
                            story={story}
                            onLike={handleLike}
                            onCommentToggle={(id) => setActiveCommentId(activeCommentId === id ? null : id)}
                            isActive={activeCommentId === story._id}
                            commentTexts={commentTexts}
                            setCommentTexts={setCommentTexts}
                            onCommentSubmit={handleComment}
                        />
                    ))}
                </div>
            )}

            {/* Premium Submit Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
                    <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div>
                                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.8rem', letterSpacing: '-0.5px' }}>Lead the Conversation</h3>
                                <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Your words can change a life today.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} style={{
                                background: '#f8f9fa',
                                border: 'none',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmitStory}>
                            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="form-group" style={{ flex: 2 }}>
                                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Headline</label>
                                    <input
                                        type="text" className="form-control" required
                                        placeholder="Catchy and meaningful"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Focus</label>
                                    <select
                                        className="form-control"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={inputStyle}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Narrative</label>
                                <textarea
                                    className="form-control" rows="5" required
                                    placeholder="Pour your heart out here..."
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    style={{ ...inputStyle, borderRadius: '20px' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', padding: '1.5rem', background: '#fcfcfc', borderRadius: '25px', border: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div>
                                        <input
                                            type="file" accept="image/*"
                                            id="user-story-upload" style={{ display: 'none' }}
                                            onChange={handleFileUpload}
                                        />
                                        <label htmlFor="user-story-upload" style={{
                                            cursor: 'pointer',
                                            margin: 0,
                                            background: '#D32F2F',
                                            color: 'white',
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700'
                                        }}>
                                            {uploading ? 'Processing...' : '📸 Add Cover'}
                                        </label>
                                    </div>
                                    {formData.imageUrl && (
                                        <div style={{ position: 'relative' }}>
                                            <img src={formData.imageUrl} alt="Preview" style={{ height: '45px', width: '45px', borderRadius: '10px', objectFit: 'cover' }} />
                                            <button type="button" onClick={() => setFormData({ ...formData, imageUrl: '' })} style={{
                                                position: 'absolute',
                                                top: '-8px',
                                                right: '-8px',
                                                background: 'black',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }}>&times;</button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <div className="custom-control custom-switch">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="isAnonymous"
                                            checked={formData.isAnonymous}
                                            onChange={e => setFormData({ ...formData, isAnonymous: e.target.checked })}
                                        />
                                        <label className="custom-control-label" htmlFor="isAnonymous" style={{ fontWeight: '700', fontSize: '0.9rem' }}>Post Anonymously</label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', borderRadius: '100px', fontWeight: '800', fontSize: '1rem', letterSpacing: '1px' }} disabled={uploading}>
                                PUBLISH FOR REVIEW
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100,
    backdropFilter: 'blur(15px)',
    animation: 'fadeIn 0.3s ease'
};

const modalContentStyle = {
    backgroundColor: 'white', padding: '3.5rem', borderRadius: '40px', width: '750px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
    animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
};

const inputStyle = {
    borderRadius: '15px',
    padding: '0.8rem 1.2rem',
    border: '1px solid #eee',
    background: '#f8f9fa',
    fontSize: '0.95rem'
};

export default Stories;
