import React, { useState, useEffect, useRef } from 'react';
import galleryService from '../../services/galleryService';
import uploadService from '../../services/uploadService';

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: 'clamp(1rem, 5vw, 2rem)', borderRadius: '12px', width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto'
};
const imagePreviewStyle = {
    position: 'relative', width: '100%', height: '200px', backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem'
};

const ManageGallery = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');
    const [draggedItem, setDraggedItem] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        albumType: 'general',
        description: '',
        tags: [],
        featured: false,
        status: 'published'
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

    const albumTypes = [
        { value: 'event', label: 'Event', icon: '📅' },
        { value: 'activity', label: 'Activity', icon: '🎯' },
        { value: 'awareness_campaign', label: 'Awareness Campaign', icon: '📢' },
        { value: 'training', label: 'Training', icon: '🎓' },
        { value: 'general', label: 'General', icon: '📸' },
        { value: 'other', label: 'Other', icon: '📁' }
    ];

    const sortOptions = [
        { value: 'date-desc', label: 'Newest First' },
        { value: 'date-asc', label: 'Oldest First' },
        { value: 'title-asc', label: 'Title (A-Z)' },
        { value: 'title-desc', label: 'Title (Z-A)' },
        { value: 'featured', label: 'Featured First' }
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
            alert('⚠️ Error loading gallery: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            alert('⚠️ Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        if (file.size > maxSize) {
            alert('⚠️ File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const response = await uploadService.uploadFile(file);
            if (response.success) {
                setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
                alert('✅ Image uploaded successfully to cloud storage!');
            } else {
                alert('⚠️ ' + getFriendlyError(response.message || 'Upload failed'));
            }
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetItem) => {
        e.preventDefault();
        if (!draggedItem || draggedItem._id === targetItem._id) return;
        
        // Reorder items (this would need backend support)
        const newItems = [...items];
        const draggedIndex = newItems.findIndex(item => item._id === draggedItem._id);
        const targetIndex = newItems.findIndex(item => item._id === targetItem._id);
        
        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        
        setItems(newItems);
        setDraggedItem(null);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            title: item.title || '',
            imageUrl: item.images?.[0]?.url || '',
            albumType: item.albumType || 'general',
            description: item.description || '',
            tags: item.tags || [],
            featured: item.featured || false,
            status: item.status || 'published'
        });
        setIsModalOpen(true);
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            alert('⚠️ Please select items to delete');
            return;
        }
        
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} gallery items?`)) {
            try {
                await Promise.all(selectedItems.map(id => galleryService.deleteGalleryItem(id)));
                alert(`✅ ${selectedItems.length} items deleted successfully!`);
                setItems(items.filter(item => !selectedItems.includes(item._id)));
                setSelectedItems([]);
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredItems.map(item => item._id));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
            try {
                await galleryService.deleteGalleryItem(id);
                alert('✅ Gallery item deleted successfully!');
                setItems(items.filter(item => item._id !== id));
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            images: [{ url: formData.imageUrl }],
            albumType: formData.albumType,
            tags: formData.tags,
            featured: formData.featured,
            status: formData.status
        };

        try {
            if (editingItem) {
                await galleryService.updateGalleryItem(editingItem._id, payload);
                alert('✅ Gallery item updated successfully!');
                setItems(items.map(item => 
                    item._id === editingItem._id 
                        ? { ...item, ...payload }
                        : item
                ));
            } else {
                await galleryService.createGalleryItem(payload);
                alert('✅ Gallery item created successfully!');
            }
            closeModal();
            fetchGallery();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({
            title: '',
            imageUrl: '',
            albumType: 'general',
            description: '',
            tags: [],
            featured: false,
            status: 'published'
        });
    };

    // Filter and sort items
    const filteredItems = items.filter(item => {
        const matchesFilter = filterType === 'all' || item.albumType === filterType;
        const matchesSearch = searchTerm === '' || 
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'date-desc':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'date-asc':
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            case 'title-asc':
                return (a.title || '').localeCompare(b.title || '');
            case 'title-desc':
                return (b.title || '').localeCompare(a.title || '');
            case 'featured':
                return (b.featured || false) - (a.featured || false);
            default:
                return 0;
        }
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {/* Header with Controls */}
            <div style={{ marginBottom: 'clamp(1.5rem, 4vw, 2rem)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Manage Gallery</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Upload New Image</button>
                        {selectedItems.length > 0 && (
                            <button className="btn btn-danger" onClick={handleBulkDelete}>
                                Delete Selected ({selectedItems.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters and Search */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search gallery..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    />
                    <select
                        className="form-control"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    >
                        <option value="all">All Categories</option>
                        {albumTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.icon} {type.label}
                            </option>
                        ))}
                    </select>
                    <select
                        className="form-control"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{ fontSize: '0.9rem' }}
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selection Controls */}
                {filteredItems.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.85rem', color: '#666' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                                onChange={toggleSelectAll}
                                style={{ margin: 0 }}
                            />
                            Select All ({filteredItems.length} items)
                        </label>
                        <span>{selectedItems.length} selected</span>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            {filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                    <h3>No Gallery Items Found</h3>
                    <p>{searchTerm || filterType !== 'all' ? 'Try adjusting your search or filters' : 'Start by uploading your first image'}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 'clamp(1rem, 3vw, 1.5rem)' }}>
                    {filteredItems.map(item => (
                        <div 
                            key={item._id} 
                            className="card" 
                            style={{ 
                                padding: 0, 
                                overflow: 'hidden',
                                position: 'relative',
                                border: selectedItems.includes(item._id) ? '2px solid #007bff' : '1px solid #e0e0e0',
                                borderRadius: '8px',
                                cursor: 'move'
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item)}
                        >
                            {/* Selection Checkbox */}
                            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item._id)}
                                    onChange={() => toggleItemSelection(item._id)}
                                    style={{ margin: 0, cursor: 'pointer' }}
                                />
                            </div>

                            {/* Featured Badge */}
                            {item.featured && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '10px', 
                                    right: '10px', 
                                    background: '#FFD700', 
                                    color: '#333', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px', 
                                    fontSize: '0.7rem', 
                                    fontWeight: 'bold',
                                    zIndex: 10
                                }}>
                                    ⭐ Featured
                                </div>
                            )}

                            {/* Image */}
                            <div style={{ height: '200px', backgroundColor: '#f8f9fa', position: 'relative' }}>
                                <img
                                    src={item.images && item.images.length > 0 ? item.images[0].url : ''}
                                    alt={item.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', margin: 0, flex: 1, lineHeight: '1.3' }}>{item.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                                        {albumTypes.find(t => t.value === item.albumType)?.icon || '📸'}
                                    </span>
                                </div>
                                
                                {item.description && (
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {item.description}
                                    </p>
                                )}

                                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem' }}>
                                    {item.albumType?.replace('_', ' ') || 'general'} • {new Date(item.createdAt).toLocaleDateString()}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-outline"
                                        style={{ flex: 1, color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.8rem', padding: '0.4rem' }}
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Enhanced Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle} onClick={closeModal}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1.5rem' }}>
                            {editingItem ? '✏️ Edit Gallery Item' : '📸 Upload New Gallery Image'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title/Caption *</label>
                                <input
                                    type="text" className="form-control" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter image title or caption"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add a description for this image"
                                    rows={3}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image *</label>
                                <div style={imagePreviewStyle}>
                                    {formData.imageUrl ? (
                                        <>
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Preview" 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '10px', 
                                                    right: '10px', 
                                                    background: 'rgba(220, 53, 69, 0.9)', 
                                                    color: 'white', 
                                                    border: 'none', 
                                                    borderRadius: '50%', 
                                                    width: '30px', 
                                                    height: '30px', 
                                                    cursor: 'pointer', 
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                                                <div>No image selected</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                        id="admin-gallery-upload"
                                        ref={fileInputRef}
                                    />
                                    <label
                                        htmlFor="admin-gallery-upload"
                                        className="btn btn-outline"
                                        style={{ cursor: 'pointer', margin: 0, padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                    >
                                        {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                                    </label>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>or</span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter image URL"
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                                    Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category (Album Type)</label>
                                <select
                                    className="form-control"
                                    value={formData.albumType}
                                    onChange={e => setFormData({ ...formData, albumType: e.target.value })}
                                >
                                    {albumTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.icon} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.tags.join(', ')}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                                    placeholder="Enter tags separated by commas (e.g., event, workshop, awareness)"
                                />
                                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>
                                    Add tags to help organize and search images
                                </div>
                            </div>

                            <div className="form-group">
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                                            style={{ margin: 0 }}
                                        />
                                        <span>⭐ Featured Image</span>
                                    </label>
                                    
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <span style={{ fontSize: '0.9rem' }}>Status:</span>
                                        <select
                                            className="form-control"
                                            value={formData.status}
                                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                                        >
                                            <option value="published">🟢 Published</option>
                                            <option value="draft">📝 Draft</option>
                                            <option value="archived">📦 Archived</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button 
                                    type="button" 
                                    className="btn btn-outline" 
                                    style={{ color: '#555', borderColor: '#ccc' }} 
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={!formData.title || !formData.imageUrl || uploading}
                                >
                                    {editingItem ? '💾 Update Image' : '📤 Upload Image'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;
