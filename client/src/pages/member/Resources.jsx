import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedContent, setSelectedContent] = useState(null);
    const [myCompletions, setMyCompletions] = useState([]);

    const categories = [
        'All', 'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Reproductive Health', 'Prevention', 'Support Services', 'Training Materials'
    ];

    const types = ['All', 'video', 'document', 'presentation', 'infographic', 'guideline', 'article'];

    useEffect(() => {
        fetchResources();
        fetchMyCompletions();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await resourceService.getAllResources();
            const resourceData = response.data;
            setResources(Array.isArray(resourceData.resources) ? resourceData.resources : Array.isArray(resourceData) ? resourceData : []);
        } catch (err) {
            console.error('Failed to load resources:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyCompletions = async () => {
        try {
            const response = await resourceService.getUserCompletions();
            setMyCompletions(response.data || []);
        } catch (error) {
            console.error('Failed to load completions', error);
        }
    };

    const handleDownload = async (id, url) => {
        try {
            await resourceService.downloadResource(id);
            if (url) window.open(url, '_blank');
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkCompleted = async (id) => {
        try {
            await resourceService.markCompleted(id);
            alert('Marked as completed!');
            fetchMyCompletions();
        } catch (error) {
            alert('Failed to mark as completed');
        }
    };

    const isCompleted = (id) => myCompletions.some(c => c.resource._id === id);

    const getResourceInfo = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('video')) return { icon: '🎥', label: 'VIDEO', color: '#E53935', bg: '#FFEBEE' };
        if (t.includes('presentation') || t.includes('slides')) return { icon: '📊', label: 'SLIDES', color: '#1976D2', bg: '#E3F2FD' };
        if (t.includes('document')) return { icon: '📄', label: 'DOC', color: '#388E3C', bg: '#E8F5E9' };
        if (t.includes('infographic')) return { icon: '🖼️', label: 'INFOGRAPHIC', color: '#F57C00', bg: '#FFF3E0' };
        if (t.includes('guideline')) return { icon: '📋', label: 'GUIDELINE', color: '#7B1FA2', bg: '#F3E5F5' };
        if (t.includes('article')) return { icon: '📰', label: 'ARTICLE', color: '#0097A7', bg: '#E0F7FA' };
        return { icon: '📁', label: 'RESOURCE', color: '#757575', bg: '#F5F5F5' };
    };

    const filteredResources = resources.filter(r =>
        (selectedCategory === 'All' || r.category === selectedCategory) &&
        (selectedType === 'All' || r.resourceType === selectedType)
    );

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #E53935', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                <p style={{ marginTop: '1rem', color: '#666' }}>Loading resources...</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Modern Header */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '3rem 2rem', 
                borderRadius: '16px', 
                marginBottom: '2rem',
                color: 'white',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}>
                <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    📚 Resources & Training
                </h1>
                <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
                    Explore educational materials, guidelines, and training content
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #667eea'
                }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '0.5rem' }}>
                        {resources.length}
                    </div>
                    <div style={{ color: '#666', fontSize: '1rem' }}>Total Resources</div>
                </div>
                <div style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #f5576c'
                }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f5576c', marginBottom: '0.5rem' }}>
                        {myCompletions.length}
                    </div>
                    <div style={{ color: '#666', fontSize: '1rem' }}>Completed</div>
                </div>
                <div style={{ 
                    background: 'white', 
                    padding: '2rem', 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderLeft: '4px solid #4CAF50'
                }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50', marginBottom: '0.5rem' }}>
                        {Math.round((myCompletions.length / (resources.length || 1)) * 100)}%
                    </div>
                    <div style={{ color: '#666', fontSize: '1rem' }}>Progress</div>
                </div>
            </div>

            {/* Dynamic Category Filters */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: 0, marginBottom: '1.5rem', fontSize: '1.3rem', color: '#333' }}>
                    🎯 Filter by Category
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {categories.map((cat, idx) => {
                        const colors = [
                            { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', shadow: 'rgba(102, 126, 234, 0.3)' },
                            { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', shadow: 'rgba(245, 87, 108, 0.3)' },
                            { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', shadow: 'rgba(79, 172, 254, 0.3)' },
                            { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', shadow: 'rgba(67, 233, 123, 0.3)' },
                            { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', shadow: 'rgba(250, 112, 154, 0.3)' },
                            { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', shadow: 'rgba(48, 207, 208, 0.3)' },
                            { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', shadow: 'rgba(168, 237, 234, 0.3)' },
                            { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', shadow: 'rgba(255, 154, 158, 0.3)' }
                        ];
                        const color = colors[idx % colors.length];
                        const isSelected = selectedCategory === cat;
                        
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    background: isSelected ? color.bg : 'white',
                                    color: isSelected ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: isSelected ? 'bold' : '500',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isSelected ? `0 8px 20px ${color.shadow}` : '0 2px 8px rgba(0,0,0,0.08)',
                                    transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                                    border: isSelected ? 'none' : '2px solid #f0f0f0'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                    }
                                }}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Type Filters */}
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <h3 style={{ margin: 0, marginBottom: '1rem', fontSize: '1.1rem', color: '#333' }}>
                    📂 Resource Type
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {types.map(type => {
                        const icons = { All: '📁', video: '🎥', document: '📄', presentation: '📊', infographic: '🖼️', guideline: '📋', article: '📰' };
                        const isSelected = selectedType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '25px',
                                    border: isSelected ? '2px solid #667eea' : '2px solid #e0e0e0',
                                    background: isSelected ? '#667eea' : 'white',
                                    color: isSelected ? 'white' : '#666',
                                    cursor: 'pointer',
                                    fontWeight: isSelected ? 'bold' : '500',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {icons[type] || '📁'} {type}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Resources Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredResources.map((resource) => {
                    const info = getResourceInfo(resource.resourceType);
                    const completed = isCompleted(resource._id);
                    
                    return (
                        <div key={resource._id} className="card" style={{ padding: 0, overflow: 'hidden', border: completed ? '2px solid #4CAF50' : '1px solid #e0e0e0' }}>
                            {resource.thumbnailUrl && (
                                <img src={resource.thumbnailUrl} alt={resource.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            )}
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', background: info.bg, color: info.color }}>
                                        {info.icon} {info.label}
                                    </span>
                                    {completed && (
                                        <span style={{ background: '#E8F5E9', color: '#388E3C', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                                            ✓ Completed
                                        </span>
                                    )}
                                </div>
                                <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>{resource.title}</h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    {resource.description?.substring(0, 100)}...
                                </p>
                                <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                                    <div>📁 {resource.category}</div>
                                    {resource.metadata?.duration && <div>⏱ {resource.metadata.duration} min</div>}
                                    <div>👁 {resource.views || 0} views • ⬇ {resource.downloads || 0} downloads</div>
                                    {resource.averageRating > 0 && <div>⭐ {resource.averageRating} ({resource.totalRatings} ratings)</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => setSelectedContent(resource)} className="btn btn-outline" style={{ flex: 1 }}>
                                        View
                                    </button>
                                    {resource.downloadable && resource.resourceUrl && (
                                        <button onClick={() => handleDownload(resource._id, resource.resourceUrl)} className="btn btn-outline" style={{ flex: 1 }}>
                                            Download
                                        </button>
                                    )}
                                    {!completed && (
                                        <button onClick={() => handleMarkCompleted(resource._id)} className="btn btn-primary" style={{ flex: 1 }}>
                                            Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredResources.length === 0 && (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>
                    No resources found for the selected filters
                </div>
            )}

            {/* Resource Modal */}
            {selectedContent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
                    <div style={{ background: 'white', borderRadius: '8px', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ padding: '2rem', position: 'relative' }}>
                            <button onClick={() => setSelectedContent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            <h2 style={{ marginBottom: '1rem' }}>{selectedContent.title}</h2>
                            <div style={{ marginBottom: '1rem', color: '#666' }}>
                                <span>{getResourceInfo(selectedContent.resourceType).icon} {selectedContent.resourceType}</span>
                                <span style={{ margin: '0 1rem' }}>•</span>
                                <span>{selectedContent.category}</span>
                            </div>
                            <p style={{ marginBottom: '1.5rem' }}>{selectedContent.description}</p>
                            
                            {selectedContent.resourceUrl && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <a href={selectedContent.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        Open Resource
                                    </a>
                                </div>
                            )}
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {!isCompleted(selectedContent._id) && (
                                    <button onClick={() => { handleMarkCompleted(selectedContent._id); setSelectedContent(null); }} className="btn btn-primary">
                                        Mark as Completed
                                    </button>
                                )}
                                {selectedContent.downloadable && selectedContent.resourceUrl && (
                                    <button onClick={() => handleDownload(selectedContent._id, selectedContent.resourceUrl)} className="btn btn-outline">
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

export default Resources;
