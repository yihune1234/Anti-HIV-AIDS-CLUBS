import React, { useState, useEffect } from 'react';
import resourceService from '../../services/resourceService';
import uploadService from '../../services/uploadService';

const thStyle = { padding: '1.2rem 1rem', textAlign: 'left', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '1.5rem 1rem', verticalAlign: 'middle' };
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100,
    backdropFilter: 'blur(10px)'
};
const modalContentStyle = {
    backgroundColor: 'white', padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '30px', width: '650px', maxWidth: '95%', maxHeight: '95vh', overflowY: 'auto',
    boxShadow: '0 50px 100px rgba(0,0,0,0.3)'
};

const ManageResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        resourceType: 'document',
        category: 'HIV/AIDS Information',
        resourceUrl: '',
        externalUrl: '',
        accessLevel: 'public'
    });

    const resourceTypes = [
        'document', 'video', 'image', 'audio', 'infographic', 'presentation',
        'link', 'book', 'article', 'toolkit', 'guideline', 'other'
    ];

    const categories = [
        'HIV/AIDS Information', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'Prevention', 'Treatment', 'Support Services', 'Research',
        'Training Materials', 'Other'
    ];

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await resourceService.getAllResources();
            if (response.data && Array.isArray(response.data.resources)) {
                setResources(response.data.resources);
            } else if (response.data && Array.isArray(response.data)) {
                setResources(response.data);
            } else {
                setResources([]);
            }
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response.success) {
                setFormData(prev => ({
                    ...prev,
                    resourceUrl: response.data.url,
                    resourceType: file.type.startsWith('video/') ? 'video' :
                        file.type.startsWith('image/') ? 'image' :
                            'document'
                }));
            }
        } catch (error) {
            alert('Upload failed: ' + error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                await resourceService.deleteResource(id);
                setResources(resources.filter(r => r._id !== id));
            } catch (error) {
                alert('Failed to delete resource: ' + error);
            }
        }
    };

    const handleVerify = async (id) => {
        try {
            await resourceService.verifyResource(id);
            setResources(resources.map(r => r._id === id ? { ...r, status: 'published' } : r));
            alert('Resource verified and published.');
        } catch (error) {
            alert('Failed to verify resource: ' + error);
        }
    };

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            description: resource.description,
            resourceType: resource.resourceType || 'document',
            category: resource.category || 'HIV/AIDS Information',
            resourceUrl: resource.resourceUrl || '',
            externalUrl: resource.externalUrl || '',
            accessLevel: resource.accessLevel || 'public'
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingResource(null);
        setFormData({
            title: '',
            description: '',
            resourceType: 'document',
            category: 'HIV/AIDS Information',
            resourceUrl: '',
            externalUrl: '',
            accessLevel: 'public'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingResource) {
                await resourceService.updateResource(editingResource._id, formData);
                alert('Resource updated successfully');
            } else {
                await resourceService.createResource(formData);
                alert('Resource created successfully');
            }
            setIsModalOpen(false);
            fetchResources();
        } catch (error) {
            alert('Operation failed: ' + error);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-danger"></div>
        </div>
    );

    return (
        <div style={{ padding: 'clamp(1rem, 5vw, 2rem) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontWeight: '800', margin: 0 }}>Resource Repository</h2>
                    <p className="text-muted">Manage educational assets, videos, and documentation.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={handleCreate}
                    style={{ borderRadius: '12px', padding: '0.8rem 1.5rem', fontWeight: 'bold' }}
                >
                    + Add New Asset
                </button>
            </div>

            <div className="card" style={{ padding: 0, borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                            <tr>
                                <th style={thStyle}>Resource Detail</th>
                                <th style={thStyle}>Classification</th>
                                <th style={thStyle}>Privacy</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>
                                        No resources found. Tap "Add New Asset" to begin.
                                    </td>
                                </tr>
                            ) : (
                                resources.map(resource => (
                                    <tr key={resource._id} style={{ borderBottom: '1px solid #f8f8f8' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '12px',
                                                    background: '#f0f0f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem'
                                                }}>
                                                    {resource.resourceType === 'video' ? '🎬' : resource.resourceType === 'image' ? '🖼️' : '📄'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: '#1a1a1a' }}>{resource.title}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#888', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {resource.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>{resource.category}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase' }}>{resource.resourceType}</div>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: '800',
                                                textTransform: 'uppercase',
                                                backgroundColor: resource.accessLevel === 'public' ? '#e8f5e9' : '#fff3e0',
                                                color: resource.accessLevel === 'public' ? '#2e7d32' : '#ef6c00'
                                            }}>
                                                {resource.accessLevel.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <span style={{
                                                fontSize: '0.85rem',
                                                color: resource.status === 'published' ? '#2e7d32' : '#999',
                                                fontWeight: '700'
                                            }}>
                                                {resource.status}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    style={{ borderRadius: '8px' }}
                                                    onClick={() => handleEdit(resource)}
                                                >
                                                    Edit
                                                </button>
                                                {(resource.status === 'draft' || resource.status === 'pending_review') && (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        style={{ borderRadius: '8px' }}
                                                        onClick={() => handleVerify(resource._id)}
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    style={{ borderRadius: '8px' }}
                                                    onClick={() => handleDelete(resource._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
                    <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontWeight: '800', margin: 0 }}>{editingResource ? 'Update Repository Asset' : 'Contribute New Asset'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label className="form-label" style={{ fontWeight: '700' }}>Asset Title</label>
                                <input
                                    type="text" className="form-control" required
                                    placeholder="Clear and descriptive name"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    style={{ borderRadius: '12px', padding: '0.8rem' }}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label" style={{ fontWeight: '700' }}>Contextual Description</label>
                                <textarea
                                    className="form-control" rows="3" required
                                    placeholder="Briefly explain what this resource covers..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ borderRadius: '12px', padding: '0.8rem' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <div className="form-group" style={{ flex: '1 1 200px' }}>
                                    <label className="form-label" style={{ fontWeight: '700' }}>Asset Type</label>
                                    <select
                                        className="form-control"
                                        value={formData.resourceType}
                                        onChange={e => setFormData({ ...formData, resourceType: e.target.value })}
                                        style={{ borderRadius: '12px', padding: '0.8rem' }}
                                    >
                                        {resourceTypes.map(type => (
                                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: '1 1 200px' }}>
                                    <label className="form-label" style={{ fontWeight: '700' }}>Library Category</label>
                                    <select
                                        className="form-control"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ borderRadius: '12px', padding: '0.8rem' }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label" style={{ fontWeight: '700' }}>Digital Asset (Required)</label>
                                <div style={{
                                    padding: '1.5rem',
                                    background: '#f8f9fa',
                                    borderRadius: '15px',
                                    border: '1px dashed #ddd',
                                    textAlign: 'center'
                                }}>
                                    <input
                                        type="file"
                                        id="admin-resource-upload"
                                        style={{ display: 'none' }}
                                        onChange={handleFileUpload}
                                        accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.mpeg,.mp3,.wav,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                                    />
                                    <label htmlFor="admin-resource-upload" style={{ cursor: 'pointer', margin: 0 }}>
                                        {uploading ? (
                                            <span style={{ color: '#D32F2F', fontWeight: '700' }}>Uploading Asset...</span>
                                        ) : (
                                            <div style={{ color: '#666' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                                                {formData.resourceUrl ? (
                                                    <span style={{ color: '#2e7d32', fontWeight: '700' }}>Asset Ready & Verified</span>
                                                ) : (
                                                    <span>Tap to upload Video, Image, or Document</span>
                                                )}
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="form-group mb-4">
                                <label className="form-label" style={{ fontWeight: '700' }}>Visibility & Permissions</label>
                                <select
                                    className="form-control"
                                    value={formData.accessLevel}
                                    onChange={e => setFormData({ ...formData, accessLevel: e.target.value })}
                                    style={{ borderRadius: '12px', padding: '0.8rem' }}
                                >
                                    <option value="public">🌍 Public (Open to All)</option>
                                    <option value="members_only">🔐 Members Only</option>
                                    <option value="restricted">🚫 Restricted (Admins Only)</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '12px', fontWeight: '800' }}>
                                    COMMIT TO REPOSITORY
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: '1 1 100px', borderRadius: '12px', padding: '1rem' }}>
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageResources;
