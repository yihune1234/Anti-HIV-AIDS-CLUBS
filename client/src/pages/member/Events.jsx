import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [registering, setRegistering] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();
                const eventData = response.data; // response.data.data

                if (Array.isArray(eventData)) {
                    setEvents(eventData);
                } else if (eventData && Array.isArray(eventData.events)) {
                    setEvents(eventData.events);
                } else {
                    setEvents([]);
                }
            } catch (err) {
                setError('Failed to load events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleRegister = async (eventId) => {
        setRegistering(eventId);
        try {
            await eventService.registerForEvent(eventId);
            alert("Successfully registered for the event!");
            // In a real app, we'd refetch or update state
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to register for event.");
        } finally {
            setRegistering(null);
        }
    };

    const isRegistered = (event) => {
        if (!event.attendees) return false;
        return event.attendees.some(attendee =>
            (typeof attendee === 'string' && attendee === user._id) ||
            (attendee._id && attendee._id === user._id)
        );
    };

    if (loading) return <div className="container mt-5 text-center">Loading events...</div>;
    if (error) return <div className="container mt-5 text-center text-danger">{error}</div>;

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Club Events</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {events.length === 0 ? (
                    <div className="card">
                        <p className="text-center text-muted">No upcoming events found.</p>
                    </div>
                ) : (
                    events.map(event => {
                        const eventDate = new Date(event.date);
                        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
                        const day = eventDate.getDate().toString().padStart(2, '0');
                        const isUpcoming = eventDate > new Date();

                        return (
                            <div key={event._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: '220px' }}>
                                {/* Image Section (Placeholder or Actual) */}
                                <div style={{
                                    flex: '0 0 35%',
                                    backgroundColor: '#eee',
                                    backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'url(https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '200px'
                                }}></div>

                                {/* Content Section */}
                                <div style={{ flex: 1, padding: '1.5rem', position: 'relative' }}>

                                    {/* Date Badge */}
                                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0.25rem 0.5rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#666' }}>{month}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day}</div>
                                    </div>

                                    {/* Status Badge */}
                                    <span style={{
                                        display: 'inline-block',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        backgroundColor: isUpcoming ? '#E8F5E9' : '#F5F5F5',
                                        color: isUpcoming ? '#2E7D32' : '#666',
                                        marginBottom: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {isUpcoming ? 'Upcoming' : 'Past'}
                                    </span>

                                    <h3 style={{ margin: '0 0 0.5rem 0', paddingRight: '3rem' }}>{event.title}</h3>

                                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                                        {event.description}
                                    </p>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                        <span>🕒 {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>📍 {event.location}</span>
                                    </div>

                                    {isUpcoming && (
                                        isRegistered(event) ? (
                                            <button className="btn btn-outline" disabled style={{ borderColor: '#2E7D32', color: '#2E7D32', padding: '0.5rem 1.5rem' }}>Registered</button>
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleRegister(event._id)}
                                                disabled={registering === event._id}
                                                style={{ padding: '0.5rem 1.5rem' }}
                                            >
                                                {registering === event._id ? 'Registering...' : 'Register to Participate'}
                                            </button>
                                        )
                                    )}
                                    {!isUpcoming && (
                                        <button className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>View Photos</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Events;
