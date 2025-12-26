import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import uploadService from '../../services/uploadService';

const thStyle = { padding: '1rem', textAlign: 'left', color: '#555' };
const tdStyle = { padding: '1rem', borderTop: '1px solid #eee' };
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
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(id);
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                alert('Failed to delete event');
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
                    alert('Event updated successfully');
                    setIsModalOpen(false);
                    fetchEvents();
                } else {
                    alert(response.message || 'Failed to update event');
                }
            } else {
                const response = await eventService.createEvent(payload);
                if (response.success) {
                    alert('Event created successfully');
                    setIsModalOpen(false);
                    fetchEvents();
                } else {
                    alert(response.message || 'Failed to create event');
                }
            }
        } catch (error) {
            console.error('Event operation error:', error);
            const msg = error.response?.data?.message || error.message || 'Operation failed';
            const errors = error.response?.data?.errors;

            if (errors && Array.isArray(errors)) {
                const errorDetails = errors.map(e => `${e.field}: ${e.message}`).join('\n');
                alert(`${msg}\n\n${errorDetails}`);
            } else {
                alert(msg);
            }
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
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <tr>
                                <th style={thStyle}>Event</th>
                                <th style={thStyle}>Type</th>
                                <th style={thStyle}>Date & Location</th>
                                <th style={thStyle}>Registrations</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: 'bold' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {event.description}
                                        </div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{ textTransform: 'capitalize' }}>{event.eventType?.replace('_', ' ')}</span>
                                    </td>
                                    <td style={tdStyle}>
                                        <div>{new Date(event.startDate).toLocaleDateString()}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>📍 {event.location?.venue}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        {event.totalRegistrations || (event.registrations ? event.registrations.length : 0)} registered
                                    </td>
                                    <td style={tdStyle}>
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
                            ))}
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
