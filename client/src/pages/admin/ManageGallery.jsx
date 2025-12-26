import React, { useState, useEffect } from 'react';
import galleryService from '../../services/galleryService';
import uploadService from '../../services/uploadService';

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: 'clamp(1rem, 5vw, 2rem)', borderRadius: '12px', width: '450px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto'
};

const ManageGallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        albumType: 'general'
    });

    const albumTypes = [
        'event', 'activity', 'awareness_campaign', 'training', 'general', 'other'
    ];

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryService.getAllGalleryItems();
            if (response.data && Array.isArray(response.data.galleries)) {
                setItems(response.data.galleries);
            } else if (response.data && Array.isArray(response.data)) {
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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
            }
        } catch (error) {
            alert('Upload failed: ' + error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
            try {
                await galleryService.deleteGalleryItem(id);
                setItems(items.filter(item => item._id !== id));
            } catch (error) {
                alert('Failed to delete gallery: ' + error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            images: [{ url: formData.imageUrl }],
            albumType: formData.albumType,
            status: 'published'
        };

        try {
            await galleryService.createGalleryItem(payload);
            alert('Gallery created successfully');
            setIsModalOpen(false);
            setFormData({ title: '', imageUrl: '', albumType: 'general' });
            fetchGallery();
        } catch (error) {
            alert('Operation failed: ' + error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Manage Gallery</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Upload New Image</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '1.5rem' }}>
                {items.map(item => (
                    <div key={item._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: '180px', backgroundColor: '#eee' }}>
                            <img
                                src={item.images && item.images.length > 0 ? item.images[0].url : ''}
                                alt={item.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div style={{ padding: '1rem' }}>
                            <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>{item.title}</h4>
                            <div style={{ fontSize: '0.8rem', color: '#777', marginBottom: '1rem' }}>
                                {(item.albumType || 'general').replace('_', ' ')}
                            </div>
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
                        <h3>Upload New Gallery Image</h3>
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
                                <label className="form-label">Image</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        id="admin-gallery-upload"
                                    />
                                    <label
                                        htmlFor="admin-gallery-upload"
                                        className="btn btn-outline"
                                        style={{ cursor: 'pointer', margin: 0, padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    >
                                        {uploading ? '...' : 'Upload'}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Or Image URL"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                {formData.imageUrl && (
                                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '10px' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Category (Album Type)</label>
                                <select
                                    className="form-control"
                                    value={formData.albumType}
                                    onChange={e => setFormData({ ...formData, albumType: e.target.value })}
                                >
                                    {albumTypes.map(type => (
                                        <option key={type} value={type}>
                                            {type.replace('_', ' ').toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Upload Image</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;
