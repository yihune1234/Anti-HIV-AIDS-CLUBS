import { useState, useEffect } from 'react';
import trainingContentService from '../../services/trainingContentService';

const TrainingContent = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', contentType: '' });
    const [selectedContent, setSelectedContent] = useState(null);
    const [myCompletions, setMyCompletions] = useState([]);

    useEffect(() => {
        fetchContents();
        fetchMyCompletions();
    }, [filter]);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const response = await trainingContentService.getAllContent(filter);
            setContents(response.data || []);
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyCompletions = async () => {
        try {
            const response = await trainingContentService.getMyCompletions();
            setMyCompletions(response.data || []);
        } catch (error) {
            console.error('Failed to load completions', error);
        }
    };

    const handleMarkCompleted = async (contentId) => {
        try {
            await trainingContentService.markCompleted(contentId);
            alert('Marked as completed!');
            fetchMyCompletions();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to mark as completed');
        }
    };

    const handleDownload = async (content) => {
        try {
            await trainingContentService.recordDownload(content._id);
            if (content.fileUrl) {
                window.open(content.fileUrl, '_blank');
            }
        } catch (error) {
            console.error('Failed to record download');
        }
    };

    const isCompleted = (contentId) => {
        return myCompletions.some(c => c.content._id === contentId);
    };

    const getTypeIcon = (type) => {
        const icons = {
            video: '🎥', slides: '📊', document: '📄',
            infographic: '🖼️', guideline: '📋', manual: '📖', article: '📰'
        };
        return icons[type] || '📁';
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '1rem' }}>Training & Awareness Materials</h1>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: '#667eea', color: 'white' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{contents.length}</div>
                    <div>Available Materials</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: '#f5576c', color: 'white' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{myCompletions.length}</div>
                    <div>Completed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })} className="form-control">
                        <option value="">All Categories</option>
                        <option value="HIV/AIDS Awareness">HIV/AIDS Awareness</option>
                        <option value="Prevention Methods">Prevention Methods</option>
                        <option value="Sexual Health">Sexual Health</option>
                        <option value="Mental Health">Mental Health</option>
                    </select>
                    <select value={filter.contentType} onChange={(e) => setFilter({ ...filter, contentType: e.target.value })} className="form-control">
                        <option value="">All Types</option>
                        <option value="video">Videos</option>
                        <option value="document">Documents</option>
                        <option value="slides">Slides</option>
                        <option value="infographic">Infographics</option>
                    </select>
                </div>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {contents.map((content) => (
                    <div key={content._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {content.thumbnailUrl && (
                            <img src={content.thumbnailUrl} alt={content.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        )}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(content.contentType)}</span>
                                {isCompleted(content._id) && (
                                    <span style={{ background: '#E8F5E9', color: '#388E3C', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                                        ✓ Completed
                                    </span>
                                )}
                            </div>
                            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{content.title}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{content.description.substring(0, 100)}...</p>
                            <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                                <div>📁 {content.category}</div>
                                {content.duration > 0 && <div>⏱ {content.duration} minutes</div>}
                                <div>👁 {content.viewCount || 0} views</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setSelectedContent(content)} className="btn btn-outline" style={{ flex: 1 }}>
                                    View
                                </button>
                                {content.downloadable && content.fileUrl && (
                                    <button onClick={() => handleDownload(content)} className="btn btn-outline" style={{ flex: 1 }}>
                                        Download
                                    </button>
                                )}
                                {!isCompleted(content._id) && (
                                    <button onClick={() => handleMarkCompleted(content._id)} className="btn btn-primary" style={{ flex: 1 }}>
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {contents.length === 0 && (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                    No training materials found
                </div>
            )}

            {/* Content Modal */}
            {selectedContent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '8px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setSelectedContent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            <h2 style={{ marginBottom: '1rem' }}>{selectedContent.title}</h2>
                            <div style={{ marginBottom: '1rem', color: '#666' }}>
                                <span>{getTypeIcon(selectedContent.contentType)} {selectedContent.contentType}</span>
                                <span style={{ margin: '0 1rem' }}>•</span>
                                <span>{selectedContent.category}</span>
                            </div>
                            <p style={{ marginBottom: '1.5rem' }}>{selectedContent.description}</p>
                            
                            {selectedContent.videoUrl && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <iframe
                                        width="100%"
                                        height="400"
                                        src={selectedContent.videoUrl.replace('watch?v=', 'embed/')}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            )}
                            
                            {selectedContent.fileUrl && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <a href={selectedContent.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        Open Document
                                    </a>
                                </div>
                            )}
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {!isCompleted(selectedContent._id) && (
                                    <button onClick={() => { handleMarkCompleted(selectedContent._id); setSelectedContent(null); }} className="btn btn-primary">
                                        Mark as Completed
                                    </button>
                                )}
                                {selectedContent.downloadable && selectedContent.fileUrl && (
                                    <button onClick={() => handleDownload(selectedContent)} className="btn btn-outline">
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainingContent;
