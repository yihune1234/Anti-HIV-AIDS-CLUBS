import React, { useState, useEffect } from 'react';
import storyService from '../../services/storyService';
import uploadService from '../../services/uploadService';



const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '600px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
};

const ManageStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'awareness',
        imageUrl: ''
    });

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

    const categories = [
        'personal_journey', 'recovery', 'awareness', 'prevention',
        'support', 'education', 'advocacy', 'inspiration', 'other'
    ];

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await storyService.getAllStories({ status: 'all' });
            if (response?.data?.stories && Array.isArray(response.data.stories)) {
                setStories(response.data.stories);
            } else if (Array.isArray(response?.data)) {
                setStories(response.data);
            } else {
                setStories([]);
            }
        } catch (error) {
            alert('⚠️ Error loading stories: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        try {
            await storyService.deleteStory(id);
            alert('✅ Story deleted successfully!');
            setStories(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleApprove = async (id) => {
        try {
            await storyService.approveStory(id);
            alert('✅ Story approved successfully!');
            setStories(prev =>
                prev.map(s => s._id === id ? { ...s, status: 'published' } : s)
            );
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleEdit = (story) => {
        setEditingStory(story);
        setFormData({
            title: story.title,
            content: story.content,
            category: story.category || 'awareness',
            imageUrl: story.featuredImage || ''
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingStory(null);
        setFormData({ title: '', content: '', category: 'awareness', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response?.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
                alert('✅ Image uploaded successfully!');
            } else {
                alert('⚠️ ' + getFriendlyError(response.message || 'Upload failed'));
            }
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            featuredImage: formData.imageUrl,
            images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
            isPublic: true
        };

        try {
            if (editingStory) {
                await storyService.updateStory(editingStory._id, payload);
                alert('✅ Story updated successfully!');
            } else {
                await storyService.createStory(payload);
                alert('✅ Story created successfully!');
            }
            setIsModalOpen(false);
            fetchStories();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Manage Stories</h2>
                <button className="btn btn-primary" onClick={handleCreate}>+ Publish New Story</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stories.map(story => (
                                <tr key={story._id}>
                                    <td data-label="Image">
                                        {story.featuredImage ? (
                                            <img src={story.featuredImage} alt="" width="40" height="40" />
                                        ) : 'No Image'}
                                    </td>
                                    <td data-label="Title">
                                        <strong>{story.title}</strong><br />
                                        <small>{new Date(story.createdAt).toLocaleDateString()}</small>
                                    </td>
                                    <td data-label="Author">
                                        {story.author ? `${story.author.firstName} ${story.author.lastName}` : 'Unknown'}
                                    </td>
                                    <td data-label="Category">{story.category.replace('_', ' ')}</td>
                                    <td data-label="Status">{story.status || 'Draft'}</td>
                                    <td data-label="Actions">
                                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(story)}>Edit</button>{' '}
                                        {story.status !== 'published' &&
                                            <button className="btn btn-sm btn-primary" onClick={() => handleApprove(story._id)}>Publish</button>}
                                        {' '}
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(story._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{editingStory ? 'Edit Story' : 'New Story'}</h3>
                        <form onSubmit={handleSubmit}>
                            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Title" required />
                            <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {categories.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input type="file" onChange={handleFileUpload} />
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageStories;
