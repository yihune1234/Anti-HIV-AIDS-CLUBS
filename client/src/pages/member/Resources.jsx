import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import { useTheme } from '../../context/ThemeContext';

const Resources = () => {
    const { theme } = useTheme();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedContent, setSelectedContent] = useState(null);
    const [myCompletions, setMyCompletions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        'All', 'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'Prevention', 'Treatment', 'Support Services', 'Research',
        'Training Materials', 'Other'
    ];

    const types = [
        'All', 'document', 'video', 'image', 'audio', 'infographic', 'presentation',
        'link', 'book', 'article', 'toolkit', 'guideline', 'other'
    ];

    useEffect(() => {
        fetchResources();
        fetchMyCompletions();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await resourceService.getAllResources();
            const resourceData = response?.data;
            if (resourceData) {
                setResources(Array.isArray(resourceData.resources) ? resourceData.resources : Array.isArray(resourceData) ? resourceData : []);
            } else {
                setResources([]);
            }
        } catch (err) {
            console.error('Failed to load resources:', err);
            setResources([]);
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

    const isCompleted = (id) => {
        if (!Array.isArray(myCompletions)) return false;
        return myCompletions.some(c => 
            (c.resource?._id === id) || 
            (c.resource === id) || 
            (c === id)
        );
    };

    const getResourceInfo = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('video')) return { icon: '🎥', label: 'VIDEO', color: '#E53935', bg: '#FFEBEE' };
        if (t.includes('presentation') || t.includes('slides')) return { icon: '📊', label: 'SLIDES', color: '#1976D2', bg: '#E3F2FD' };
        if (t.includes('document')) return { icon: '📄', label: 'DOC', color: '#388E3C', bg: '#E8F5E9' };
        if (t.includes('infographic')) return { icon: '🖼️', label: 'INFOGRAPHIC', color: '#F57C00', bg: '#FFF3E0' };
        if (t.includes('guideline')) return { icon: '📋', label: 'GUIDELINE', color: '#7B1FA2', bg: '#F3E5F5' };
        if (t.includes('article')) return { icon: '📰', label: 'ARTICLE', color: '#0097A7', bg: '#E0F7FA' };
        if (t.includes('book')) return { icon: '📖', label: 'BOOK', color: '#5D4037', bg: '#EFEBE9' };
        if (t.includes('toolkit')) return { icon: '🛠️', label: 'TOOLKIT', color: '#455A64', bg: '#ECEFF1' };
        if (t.includes('link')) return { icon: '🔗', label: 'LINK', color: '#0288D1', bg: '#E1F5FE' };
        if (t.includes('image')) return { icon: '🖼️', label: 'IMAGE', color: '#C2185B', bg: '#FCE4EC' };
        if (t.includes('audio')) return { icon: '🎧', label: 'AUDIO', color: '#512DA8', bg: '#EDE7F6' };
        return { icon: '📁', label: 'RESOURCE', color: '#616161', bg: '#F5F5F5' };
    };

    const filteredResources = resources.filter(r =>
        (selectedCategory === 'All' || r.category === selectedCategory) &&
        (selectedType === 'All' || (r.resourceType || '').toLowerCase().includes(selectedType.toLowerCase())) &&
        ((r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
         (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()))
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
                background: theme.headerStyle === 'gradient' ? 'linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)' : theme.primaryColor, 
                padding: '3rem 2rem', 
                borderRadius: '16px', 
                marginBottom: '2rem',
                color: 'white',
                boxShadow: `0 10px 30px ${theme.primaryColor}33`
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
                        {resources?.length || 0}
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
                        {myCompletions?.length || 0}
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
                        {Math.round(((myCompletions?.length || 0) / (resources?.length || 1)) * 100)}%
                    </div>
                    <div style={{ color: '#666', fontSize: '1rem' }}>Progress</div>
                </div>
            </div>

            {/* Filters Dashboard */}
            <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '24px', 
                marginBottom: '2.5rem', 
                boxShadow: '0 4px 25px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                border: '1px solid #f0f0f0'
            }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <input 
                        type="text"
                        placeholder="Search for resources, modules, or training materials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1.2rem 1.5rem 1.2rem 3.5rem',
                            borderRadius: '18px',
                            border: '2px solid #f0f0f0',
                            fontSize: '1rem',
                            fontWeight: '600',
                            outline: 'none',
                            transition: 'all 0.3s',
                            background: '#fcfcfc',
                            color: '#1a1a2e'
                        }}
                        onFocus={(e) => { e.target.style.borderColor = theme.primaryColor; e.target.style.background = '#fff'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#f0f0f0'; e.target.style.background = '#fcfcfc'; }}
                    />
                    <div style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.4rem' }}>
                        🔍
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                    <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>Quick Filter by Type</div>
                        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {['All', 'video', 'document', 'presentation', 'toolkit', 'link'].map(t => {
                                const isSelected = selectedType === t;
                                const icon = t === 'All' ? '📁' : t === 'video' ? '🎥' : t === 'document' ? '📄' : t === 'presentation' ? '📊' : t === 'toolkit' ? '🛠️' : '🔗';
                                return (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedType(t)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '14px',
                                            border: 'none',
                                            background: isSelected ? theme.primaryColor : '#f5f5f7',
                                            color: isSelected ? 'white' : '#555',
                                            fontSize: '0.85rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: isSelected ? `0 4px 12px ${theme.primaryColor}44` : 'none'
                                        }}
                                    >
                                        <span>{icon}</span> {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ height: '1px', background: '#f0f0f0', width: '100%' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${theme.primaryColor}15`, color: theme.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                                🏷️
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase' }}>Filter by Topic/Subject</div>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={filterSelectStyle}
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c === 'All' ? 'All Subjects' : c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedCategory !== 'All' && (
                            <button 
                                onClick={() => setSelectedCategory('All')} 
                                style={{ 
                                    background: 'none', 
                                    border: `1.5px solid ${theme.primaryColor}22`, 
                                    color: theme.primaryColor, 
                                    fontSize: '0.75rem', 
                                    fontWeight: '800', 
                                    cursor: 'pointer',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '8px'
                                }}
                            >
                                SHOW ALL SUBJECTS
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Resources Grouped by Category */}
            {categories.filter(cat => cat !== 'All' && (selectedCategory === 'All' || selectedCategory === cat)).map((category) => {
                const categoryResources = filteredResources.filter(r => r.category === category);
                if (categoryResources.length === 0) return null;

                return (
                    <div key={category} style={{ marginBottom: '4rem' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem', 
                            marginBottom: '1.5rem',
                            borderLeft: `5px solid ${theme.primaryColor}`,
                            paddingLeft: '1.2rem'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
                                {category}
                            </h2>
                            <div style={{ height: '2px', flex: 1, background: 'linear-gradient(to right, #f0f0f0, transparent)' }}></div>
                            <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: '600' }}>{categoryResources.length} Materials</span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {categoryResources.map((resource) => {
                                const info = getResourceInfo(resource.resourceType);
                                const completed = isCompleted(resource._id);
                                
                                return (
                                    <div key={resource._id} style={{ 
                                        backgroundColor: 'white',
                                        borderRadius: '24px',
                                        overflow: 'hidden',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                                        border: completed ? `2px solid ${theme.primaryColor}33` : '1px solid #f0f0f0',
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
                                    }}
                                    className="resource-card"
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-10px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)';
                                    }}
                                    >
                                        {resource.thumbnailUrl ? (
                                            <div style={{ position: 'relative' }}>
                                                <img src={resource.thumbnailUrl} alt={resource.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                                <div style={{ position: 'absolute', bottom: '15px', right: '15px', padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontSize: '0.75rem', fontWeight: '800', color: info.color, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                                    {info.icon} {info.label}
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ height: '180px', background: `linear-gradient(45deg, ${theme.primaryColor}08, ${theme.primaryColor}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                                {info.icon}
                                            </div>
                                        )}
                                        
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                                {completed && (
                                                    <div style={{ background: '#E8F5E9', color: '#388E3C', padding: '0.3rem 0.8rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                        Completed ✓
                                                    </div>
                                                )}
                                                {!completed && (
                                                    <div style={{ color: '#aaa', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>New Material</div>
                                                )}
                                            </div>
                                            <h3 style={{ margin: 0, marginBottom: '0.8rem', fontSize: '1.15rem', fontWeight: '800', color: '#1a1a2e', lineHeight: '1.4' }}>{resource.title}</h3>
                                            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem', minHeight: '3.6rem' }}>
                                                {resource.description?.substring(0, 85)}...
                                            </p>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '16px', marginBottom: '1.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', fontWeight: '700' }}>Duration</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#333' }}>{resource.metadata?.duration || '5'} Min</div>
                                                </div>
                                                <div style={{ width: '1px', height: '20px', background: '#ddd' }}></div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', fontWeight: '700' }}>Impact</div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#333' }}>{resource.views || 0} Learners</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button onClick={() => setSelectedContent(resource)} style={{ ...actionButtonStyle, background: '#1a1a2e', color: 'white' }}>
                                                    Open
                                                </button>
                                                {!completed && (
                                                    <button onClick={() => handleMarkCompleted(resource._id)} style={{ ...actionButtonStyle, background: theme.primaryColor, color: 'white', boxShadow: `0 4px 15px ${theme.primaryColor}33` }}>
                                                        Complete
                                                    </button>
                                                )}
                                                {completed && resource.downloadable && (
                                                    <button onClick={() => handleDownload(resource._id, resource.resourceUrl)} style={{ ...actionButtonStyle, background: '#f0f0f0', color: '#333' }}>
                                                        Get PDF
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

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

const actionButtonStyle = {
    flex: 1,
    padding: '0.8rem',
    borderRadius: '14px',
    border: 'none',
    fontWeight: '800',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const filterSelectStyle = {
    border: 'none', 
    background: 'transparent', 
    fontSize: '0.95rem', 
    fontWeight: '700', 
    color: '#333', 
    outline: 'none',
    cursor: 'pointer',
    padding: '4px 0',
    width: '100%',
    minWidth: '150px'
};

export default Resources;
