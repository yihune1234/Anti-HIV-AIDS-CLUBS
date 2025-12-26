import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = [
        'All', 'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Reproductive Health', 'Prevention', 'Support Services', 'Training Materials'
    ];

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await resourceService.getAllResources();
                const resourceData = response.data;

                if (resourceData && Array.isArray(resourceData.resources)) {
                    setResources(resourceData.resources);
                } else if (Array.isArray(resourceData)) {
                    setResources(resourceData);
                } else {
                    setResources([]);
                }
            } catch (err) {
                setError('Failed to load resources.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const handleDownload = async (id, title, url) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            try {
                await resourceService.downloadResource(id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const getResourceInfo = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('video')) return { icon: '🎬', label: 'VIDEO', color: '#673AB7', bg: '#EDE7F6' };
        if (t.includes('image')) return { icon: '🖼️', label: 'PHOTO', color: '#E91E63', bg: '#FCE4EC' };
        if (t.includes('pdf')) return { icon: '📕', label: 'PDF', color: '#F44336', bg: '#FFEBEE' };
        if (t.includes('doc')) return { icon: '📘', label: 'DOC', color: '#2196F3', bg: '#E3F2FD' };
        if (t.includes('link')) return { icon: '🔗', label: 'LINK', color: '#009688', bg: '#E0F2F1' };
        return { icon: '📄', label: 'ASSET', color: '#607D8B', bg: '#F5F5F5' };
    };

    const filteredResources = resources.filter(r =>
        selectedCategory === 'All' || r.category === selectedCategory
    );

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-danger" role="status"></div>
            <p style={{ marginTop: '1rem', color: '#666', fontWeight: '500' }}>Curating your knowledge base...</p>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <style>
                {`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .resource-card:hover {
                    background: #fdfdfd !important;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important;
                    transform: translateX(10px);
                }
                .category-chip {
                    padding: 10px 25px;
                    border-radius: 100px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    border: 1px solid #eee;
                    background: white;
                    color: #555;
                    white-space: nowrap;
                }
                .category-chip.active {
                    background: #D32F2F;
                    color: white;
                    border-color: #D32F2F;
                    box-shadow: 0 10px 20px rgba(211, 47, 47, 0.2);
                }
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
                }}>Knowledge Repository</span>
                <h1 style={{ fontSize: '3.8rem', fontWeight: '900', marginBottom: '1.2rem', letterSpacing: '-2px' }}>Resource <span style={{ color: '#D32F2F' }}>Library</span></h1>
                <p className="text-muted" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.7', marginBottom: '3rem' }}>
                    Access our collection of guides, awareness videos, and expert materials designed to empower your journey.
                </p>

                {/* Category Filter */}
                <div className="custom-scrollbar" style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    overflowX: 'auto',
                    padding: '1rem',
                    marginBottom: '2rem'
                }}>
                    {categories.map(cat => (
                        <div
                            key={cat}
                            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '2rem',
                animation: 'fadeInUp 1s ease 0.2s',
                animationFillMode: 'both'
            }}>
                {filteredResources.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '6rem',
                        borderRadius: '40px',
                        border: '2px dashed #eee',
                        background: '#fafafa'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📚</div>
                        <h3 style={{ fontWeight: '800', color: '#444' }}>No Assets in this Category</h3>
                        <p className="text-muted">We're constantly updating our library. Check back soon!</p>
                    </div>
                ) : (
                    filteredResources.map((resource) => {
                        const info = getResourceInfo(resource.resourceType || resource.fileType);
                        return (
                            <div
                                key={resource._id}
                                className="resource-card"
                                style={{
                                    padding: '2rem',
                                    borderRadius: '35px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    background: 'white',
                                    border: '1px solid #f0f0f0',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)'
                                }}
                            >
                                {/* Left Icon Decoration */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '24px',
                                    background: info.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    flexShrink: 0,
                                    boxShadow: `0 10px 20px -5px ${info.bg}`
                                }}>
                                    {info.icon}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '0.65rem',
                                        fontWeight: '900',
                                        color: info.color,
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1.5px',
                                        padding: '4px 12px',
                                        background: info.bg,
                                        borderRadius: '100px',
                                        display: 'inline-block'
                                    }}>
                                        {resource.category || info.label}
                                    </div>
                                    <h4 style={{
                                        margin: '0 0 0.8rem 0',
                                        fontSize: '1.3rem',
                                        fontWeight: '800',
                                        color: '#1a1a1a',
                                        letterSpacing: '-0.3px'
                                    }}>{resource.title}</h4>
                                    <p style={{
                                        color: '#777',
                                        fontSize: '0.9rem',
                                        margin: '0 0 1.5rem 0',
                                        lineHeight: '1.5',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {resource.description || 'Comprehensive material curated for your educational journey.'}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#bbb', display: 'flex', gap: '0.8rem' }}>
                                            <span>{resource.resourceType?.toUpperCase() || 'ASSET'}</span>
                                            <span>•</span>
                                            <span>LIBRARY ITEM</span>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(resource._id, resource.title, resource.resourceUrl || resource.externalUrl)}
                                            style={{
                                                background: '#1a1a1a',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '15px',
                                                fontSize: '0.8rem',
                                                fontWeight: '800',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {resource.resourceType === 'video' ? 'Play Now ⏯' : 'Access 📥'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Resources;
