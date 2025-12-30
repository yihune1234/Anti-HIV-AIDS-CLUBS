import React, { useState, useEffect } from 'react';
import trainingContentService from '../../services/trainingContentService';


const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '700px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
};

const ManageTrainingContent = () => {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContent, setEditingContent] = useState(null);

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

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentType: 'document',
        category: 'HIV/AIDS Awareness',
        accessLevel: 'members_only',
        fileUrl: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 0,
        downloadable: true,
        isFeatured: false,
        author: '',
        source: ''
    });

    const contentTypes = ['video', 'slides', 'document', 'infographic', 'guideline', 'manual', 'article', 'other'];
    const categories = [
        'HIV/AIDS Awareness', 'Prevention Methods', 'Sexual Health', 'Mental Health',
        'Substance Abuse', 'Gender-Based Violence', 'Reproductive Health',
        'STI Prevention', 'Life Skills', 'Other'
    ];

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            setLoading(true);
            const response = await trainingContentService.getAllContent({});
            setContents(response.data || []);
        } catch (error) {
            alert('⚠️ Error loading contents: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingContent(null);
        setFormData({
            title: '', description: '', contentType: 'document', category: 'HIV/AIDS Awareness',
            accessLevel: 'members_only', fileUrl: '', videoUrl: '', thumbnailUrl: '',
            duration: 0, downloadable: true, isFeatured: false, author: '', source: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (content) => {
        setEditingContent(content);
        setFormData({
            title: content.title,
            description: content.description,
            contentType: content.contentType,
            category: content.category,
            accessLevel: content.accessLevel,
            fileUrl: content.fileUrl || '',
            videoUrl: content.videoUrl || '',
            thumbnailUrl: content.thumbnailUrl || '',
            duration: content.duration || 0,
            downloadable: content.downloadable,
            isFeatured: content.isFeatured,
            author: content.author || '',
            source: content.source || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContent) {
                await trainingContentService.updateContent(editingContent._id, formData);
                alert('✅ Content updated successfully!');
            } else {
                await trainingContentService.createContent(formData);
                alert('✅ Content created successfully!');
            }
            setIsModalOpen(false);
            fetchContents();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                await trainingContentService.deleteContent(id);
                alert('✅ Content deleted successfully!');
                fetchContents();
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const getTypeBadge = (type) => {
        const colors = {
            video: '#E53935', slides: '#1976D2', document: '#388E3C',
            infographic: '#F57C00', guideline: '#7B1FA2', manual: '#0097A7'
        };
        return (
            <span style={{
                padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem',
                fontWeight: '500', backgroundColor: colors[type] || '#757575', color: 'white'
            }}>
                {type}
            </span>
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Training Content</h2>
                <button className="btn btn-primary" onClick={handleCreate}>+ Create New Content</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Access</th>
                                <th>Stats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map(content => (
                                <tr key={content._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td data-label="Title">
                                        <div style={{ fontWeight: 'bold' }}>{content.title}</div>
                                        {content.isFeatured && <span style={{ fontSize: '0.75rem', color: '#F57C00' }}>⭐ Featured</span>}
                                    </td>
                                    <td data-label="Type">{getTypeBadge(content.contentType)}</td>
                                    <td data-label="Category">{content.category}</td>
                                    <td data-label="Access">
                                        <span style={{ fontSize: '0.85rem', color: content.accessLevel === 'public' ? '#388E3C' : '#1976D2' }}>
                                            {content.accessLevel === 'public' ? '🌐 Public' : '🔒 Members'}
                                        </span>
                                    </td>
                                    <td data-label="Stats">
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <div>👁 {content.viewCount || 0} views</div>
                                            <div>⬇ {content.downloadCount || 0} downloads</div>
                                            <div>✓ {content.completionCount || 0} completed</div>
                                        </div>
                                    </td>
                                    <td data-label="Actions">
                                        <button
                                            className="btn btn-outline"
                                            style={{ marginRight: '0.5rem', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleEdit(content)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleDelete(content._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {contents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                            No content found. Create your first training material!
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{editingContent ? 'Edit Content' : 'Create New Content'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-control" required name="title" value={formData.title} onChange={handleChange} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Content Type</label>
                                    <select className="form-control" name="contentType" value={formData.contentType} onChange={handleChange} required>
                                        {contentTypes.map(type => <option key={type} value={type}>{type.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Category</label>
                                    <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="3" required name="description" value={formData.description} onChange={handleChange}></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">File URL (for documents/slides)</label>
                                <input type="url" className="form-control" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="https://..." />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Video URL (for videos)</label>
                                <input type="url" className="form-control" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://youtube.com/..." />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Thumbnail URL</label>
                                <input type="url" className="form-control" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Duration (minutes)</label>
                                    <input type="number" className="form-control" name="duration" value={formData.duration} onChange={handleChange} min="0" />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Access Level</label>
                                    <select className="form-control" name="accessLevel" value={formData.accessLevel} onChange={handleChange}>
                                        <option value="public">Public</option>
                                        <option value="members_only">Members Only</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                                <label><input type="checkbox" name="downloadable" checked={formData.downloadable} onChange={handleChange} /> Downloadable</label>
                                <label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured</label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingContent ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTrainingContent;
