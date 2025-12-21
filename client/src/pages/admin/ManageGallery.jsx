import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';

const ManageGallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        category: 'General'
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryService.getAllGalleryItems();
            if (response.data && Array.isArray(response.data.galleries)) {
                setItems(response.data.galleries);
            } else if (response.data && Array.isArray(response.data)) { // Fallback if structure differs
                setItems(response.data);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to fetch gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await galleryService.deleteGalleryItem(id);
                setItems(items.filter(item => item._id !== id));
            } catch (error) {
                alert('Failed to delete image: ' + error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await galleryService.createGalleryItem(formData);
            alert('Image uploaded successfully');
            setIsModalOpen(false);
            setFormData({ title: '', imageUrl: '', category: 'General' });
            fetchGallery();
        } catch (error) {
            alert('Operation failed: ' + error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Gallery</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Upload New Image</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {items.map(item => (
                    <div key={item._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: '150px', backgroundColor: '#eee' }}>
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                            <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: '1rem' }}>{item.category}</div>
                            <button
                                className="btn btn-outline"
                                style={{ width: '100%', color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.85rem', padding: '0.4rem' }}
                                onClick={() => handleDelete(item._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Upload New Image</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title/Caption</label>
                                <input
                                    type="text" className="form-control" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text" className="form-control" placeholder="https://..." required
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-control"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>General</option>
                                    <option>Event</option>
                                    <option>Campaign</option>
                                    <option>Training</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px', maxWidth: '90%'
};

export default ManageGallery;
