import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEvents();
            if (response.data && Array.isArray(response.data)) {
                setEvents(response.data);
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
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '', // simple date format
            location: event.location,
            imageUrl: event.imageUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            location: '',
            imageUrl: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await eventService.updateEvent(editingEvent._id, formData);
                alert('Event updated successfully');
            } else {
                await eventService.createEvent(formData);
                alert('Event created successfully');
            }
            setIsModalOpen(false);
            fetchEvents(); // Refresh list
        } catch (error) {
            alert('Operation failed: ' + error);
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
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                        <tr>
                            <th style={thStyle}>Event</th>
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
                                    <div>{new Date(event.date).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#777' }}>📍 {event.location}</div>
                                </td>
                                <td style={tdStyle}>
                                    {event.attendees ? event.attendees.length : 0} registered
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
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control" rows="3" required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date" className="form-control" required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text" className="form-control" required
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input
                                    type="text" className="form-control" placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
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

const thStyle = { padding: '1rem', textAlign: 'left', color: '#555' };
const tdStyle = { padding: '1rem', borderTop: '1px solid #eee' };
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};
const modalContentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '500px', maxWidth: '90%'
};

export default ManageEvents;
