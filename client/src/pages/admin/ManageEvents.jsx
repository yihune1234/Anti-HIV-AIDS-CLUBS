import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import uploadService from '../../services/uploadService';


const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
};

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventType: 'other',
        startDate: '',
        endDate: '',
        locationVenue: '',
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

    const eventTypes = [
        'workshop', 'seminar', 'conference', 'training', 'awareness_campaign',
        'health_screening', 'fundraising', 'social', 'meeting', 'other'
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEvents();
            if (response.data && Array.isArray(response.data)) {
                setEvents(response.data);
            } else if (Array.isArray(response)) {
                setEvents(response);
            } else {
                setEvents([]);
            }
        } catch (error) {
            alert('⚠️ Error loading events: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(id);
                alert('✅ Event deleted successfully!');
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            eventType: event.eventType || 'other',
            startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
            endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
            locationVenue: event.location?.venue || '',
            imageUrl: event.images && event.images.length > 0 ? event.images[0].url : ''
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            eventType: 'other',
            startDate: '',
            endDate: '',
            locationVenue: '',
            imageUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: formData.title,
            description: formData.description,
            eventType: formData.eventType,
            startDate: formData.startDate,
            endDate: formData.endDate || formData.startDate,
            location: {
                venue: formData.locationVenue
            },
            images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
            status: 'published',
            registrationRequired: true,
            targetAudience: ['all'], // ← Changed to array
            isFeatured: false,
            isPublic: true
        };

        try {
            if (editingEvent) {
                const response = await eventService.updateEvent(editingEvent._id, payload);
                if (response.success) {
                    alert('✅ Event updated successfully!');
                    setIsModalOpen(false);
                    fetchEvents();
                } else {
                    alert('⚠️ ' + getFriendlyError(response.message || 'Failed to update event'));
                }
            } else {
                const response = await eventService.createEvent(payload);
                if (response.success) {
                    alert('✅ Event created successfully!');
                    setIsModalOpen(false);
                    fetchEvents();
                } else {
                    alert('⚠️ ' + getFriendlyError(response.message || 'Failed to create event'));
                }
            }
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Events</h2>
                <button className="btn btn-primary" onClick={handleCreate}>+ Create New Event</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Type</th>
                                <th>Date & Location</th>
                                <th>Status</th>
                                <th>Registrations</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => {
                                const eventDate = new Date(event.startDate);
                                const now = new Date();
                                const isUpcoming = eventDate > now;
                                const isPast = eventDate < now;
                                const isToday = eventDate.toDateString() === now.toDateString();
                                
                                return (
                                <tr key={event._id}>
                                    <td data-label="Event">
                                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {event.description}
                                        </div>
                                    </td>
                                    <td data-label="Type">
                                        <span style={{ 
                                            textTransform: 'capitalize',
                                            background: '#f0f0f0',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {event.eventType?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td data-label="Date & Location">
                                        <div style={{ fontWeight: '600' }}>
                                            {eventDate.toLocaleDateString('en-US', { 
                                                weekday: 'short', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>📍 {event.location?.venue}</div>
                                    </td>
                                    <td data-label="Status">
                                        <span style={{
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '15px',
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            background: isToday ? '#fff3cd' : isUpcoming ? '#d4edda' : '#f8d7da',
                                            color: isToday ? '#856404' : isUpcoming ? '#155724' : '#721c24'
                                        }}>
                                            {isToday ? 'Today' : isUpcoming ? 'Upcoming' : 'Completed'}
                                        </span>
                                    </td>
                                    <td data-label="Event">
                                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {event.description}
                                        </div>
                                    </td>
                                    <td data-label="Type">
                                        <span style={{ textTransform: 'capitalize' }}>{event.eventType?.replace('_', ' ')}</span>
                                    </td>
                                    <td data-label="Date & Location">
                                        <div>{new Date(event.startDate).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>📍 {event.location?.venue}</div>
                                    </td>
                                    <td data-label="Registrations">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold', color: '#D32F2F' }}>
                                                {event.totalRegistrations || (event.registrations ? event.registrations.length : 0)}
                                            </span>
                                            <span style={{ color: '#666' }}>registered</span>
                                            {event.capacity && (
                                                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                                    / {event.capacity} max
                                                </span>
                                            )}
                                        </div>
                                        {(event.registrations && event.registrations.length > 0) && (
                                            <button
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    padding: '0.2rem 0.5rem',
                                                    fontSize: '0.7rem',
                                                    color: '#666',
                                                    cursor: 'pointer',
                                                    marginTop: '0.3rem'
                                                }}
                                                onClick={() => {
                                                    const registrants = event.registrations.map(r => 
                                                        r.user?.firstName && r.user?.lastName 
                                                            ? `${r.user.firstName} ${r.user.lastName}` 
                                                            : r.user?.email || 'Unknown User'
                                                    ).join('\n');
                                                    alert(`Registered Members:\n\n${registrants || 'No registrations yet'}`);
                                                }}
                                            >
                                                View List
                                            </button>
                                        )}
                                    </td>
                                    <td data-label="Actions">
                                        <button
                                            className="btn btn-outline"
                                            style={{ marginRight: '0.5rem', color: '#333', borderColor: '#ddd', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleEdit(event)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: '#D32F2F', borderColor: '#ffcdd2', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Event Title</label>
                                <input
                                    type="text" className="form-control" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                                <small className="text-muted" style={{ fontSize: '0.75rem', color: '#888' }}>Max 200 characters</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Event Type</label>
                                <select
                                    className="form-control"
                                    value={formData.eventType}
                                    onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                                >
                                    {eventTypes.map(type => (
                                        <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control" rows="3" required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                                <small className="text-muted" style={{ fontSize: '0.75rem', color: '#888' }}>Max 2000 characters</small>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Start Date & Time</label>
                                    <input
                                        type="datetime-local" className="form-control" required
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">End Date & Time</label>
                                    <input
                                        type="datetime-local" className="form-control" required
                                        value={formData.endDate}
                                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Location Venue</label>
                                <input
                                    type="text" className="form-control" required
                                    value={formData.locationVenue}
                                    onChange={e => setFormData({ ...formData, locationVenue: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Event Image</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                try {
                                                    const res = await uploadService.uploadFile(file);
                                                    if (res.success) {
                                                        setFormData({ ...formData, imageUrl: res.data.url });
                                                    }
                                                } catch (err) {
                                                    alert('Image upload failed');
                                                    console.error(err);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <input
                                    type="text" className="form-control" placeholder="Or enter Image URL"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                                {formData.imageUrl && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img src={formData.imageUrl} alt="Preview" style={{ height: '100px', borderRadius: '4px' }} />
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ color: '#555', borderColor: '#ccc' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageEvents;
