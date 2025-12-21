import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';

const Resources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await resourceService.getAllResources();
                // Controller returns: { success: true, data: { resources: [...], pagination: {} } }
                const resourceData = response.data; // response.data.data

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

    const handleDownload = async (id, title) => {
        try {
            await resourceService.downloadResource(id);
            alert(`Thanks for downloading "${title}"!`);
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download resource");
        }
    };

    const getFileIcon = (type) => {
        if (!type) return '📄';
        if (type.includes('pdf')) return '📕'; // Using Emoji for now, easy to swap for SVG/Image
        if (type.includes('word') || type.includes('doc')) return '📘';
        return '📄';
    };

    if (loading) return <div className="container mt-5 text-center">Loading resources...</div>;
    if (error) return <div className="container mt-5 text-center text-danger">{error}</div>;

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Educational Resources</h2>

            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {resources.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">No resources available.</div>
                ) : (
                    resources.map((resource, index) => (
                        <div
                            key={resource._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.5rem',
                                borderBottom: index < resources.length - 1 ? '1px solid #f0f0f0' : 'none',
                                gap: '1.5rem'
                            }}
                        >
                            {/* Icon */}
                            <div style={{ fontSize: '2rem', opacity: 0.8 }}>
                                {getFileIcon(resource.fileType || 'pdf')}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 0.25rem 0', color: '#D32F2F', fontSize: '1rem' }}>{resource.title}</h4>
                                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                                    {resource.fileType || 'PDF'} • {resource.size || 'Unknown Size'} • {resource.category}
                                </div>
                            </div>

                            {/* Action */}
                            <button
                                className="btn"
                                style={{
                                    backgroundColor: '#E8F5E9',
                                    color: '#2E7D32',
                                    fontSize: '0.85rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}
                                onClick={() => handleDownload(resource._id, resource.title)}
                            >
                                Download
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Resources;
