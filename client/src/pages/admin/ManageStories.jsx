import React, { useState, useEffect } from 'react';
import storyService from '../../services/storyService';

const ManageStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '', // In a real app this might be a rich text editor
        category: 'News',
        imageUrl: ''
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await storyService.getAllStories();
            if (response.data && Array.isArray(response.data.stories)) {
                setStories(response.data.stories);
            } else if (response.data && Array.isArray(response.data)) {
                setStories(response.data);
            } else {
                setStories([]);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                await storyService.deleteStory(id);
                setStories(stories.filter(s => s._id !== id));
            } catch (error) {
                alert('Failed to delete story: ' + error);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            // Assuming the backend has an approve endpoint or we set status to 'published' via update
            // Based on service update, we added approveStory
            await storyService.approveStory(id);
            setStories(stories.map(s => s._id === id ? { ...s, status: 'published' } : s));
        } catch (error) {
            alert('Failed to approve story: ' + error);
        }
    };

    const handleEdit = (story) => {
        setEditingStory(story);
        setFormData({
            title: story.title,
            content: story.content,
            category: story.category || 'News',
            imageUrl: story.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingStory(null);
        setFormData({ title: '', content: '', category: 'News', imageUrl: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStory) {
                await storyService.updateStory(editingStory._id, formData);
                alert('Story updated successfully');
            } else {
                await storyService.createStory(formData);
                alert('Story created successfully');
            }
            setIsModalOpen(false);
            fetchStories();
        } catch (error) {
            alert('Operation failed: ' + error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Stories</h2>
                <button className="btn btn-primary" onClick={handleCreate}>+ Publish New Story</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Author</th>
                            <th style={thStyle}>Category</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stories.map(story => (
                            <tr key={story._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}>
                                    <div style={{ fontWeight: 'bold' }}>{story.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#777' }}>{new Date(story.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td style={tdStyle}>{story.author?.firstName || 'Unknown'}</td>
                                <td style={tdStyle}>{story.category}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        backgroundColor: story.status === 'published' ? '#E8F5E9' : '#FFF3E0',
                                        color: story.status === 'published' ? '#2E7D32' : '#EF6C00'
                                    }}>
                                        {story.status || 'Draft'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ marginRight: '0.5rem', color: '#333', borderColor: '#ddd', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                        onClick={() => handleEdit(story)}
                                    >
                                        Edit
                                    </button>
                                    {story.status !== 'published' && (
                                        <button
                                            className="btn btn-outline"
                                            style={{ marginRight: '0.5rem', color: '#2E7D32', borderColor: '#A5D6A7', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleApprove(story._id)}
                                        >
                                            Publish
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-outline"
                                        style={{ color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                        onClick={() => handleDelete(story._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{editingStory ? 'Edit Story' : 'New Story'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text" className="form-control" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-control"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>News</option>
                                    <option>Success Story</option>
                                    <option>Opinion</option>
                                    <option>Research</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Content</label>
                                <textarea
                                    className="form-control" rows="6" required
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL (Optional)</label>
                                <input
                                    type="text" className="form-control" placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Story</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const thStyle = { padding: '1rem', textAlign: 'left', color: '#555' };
const tdStyle = { padding: '1rem', borderTop: '1px solid #eee' };
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '600px', maxWidth: '90%'
};

export default ManageStories;
