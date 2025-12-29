import React, { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const [registering, setRegistering] = useState(null);
    const [hoveredEvent, setHoveredEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();
                const eventData = response.data;

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
            setEvents(prev => prev.map(ev =>
                ev._id === eventId
                    ? { ...ev, registrations: [...(ev.registrations || []), { user: user?._id }] }
                    : ev
            ));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to register for event.");
        } finally {
            setRegistering(null);
        }
    };

    const isRegistered = (event) => {
        const registrations = event.registrations || [];
        if (!user) return false;
        return registrations.some(r =>
            (r.user && (r.user === user._id || r.user._id === user._id))
        );
    };

    if (loading) return (
        <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="spinner-border text-danger" role="status"></div>
            <p style={{ marginTop: '1rem', color: '#666', fontWeight: '500' }}>Discovering upcoming opportunities...</p>
        </div>
    );

    return (
        <div className="container mt-5 mb-5">
            <style>
                {`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .event-card:hover {
                    transform: translateY(-15px);
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15) !important;
                }
                .event-card:hover .event-image {
                    transform: scale(1.1);
                }
                `}
            </style>

            <div className="mb-5 text-center" style={{ animation: 'fadeInDown 0.8s ease' }}>
                <span style={{
                    color: '#D32F2F',
                    fontWeight: '900',
                    letterSpacing: '4px',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                    display: 'block'
                }}>Community Engagement</span>
                <h1 style={{ fontSize: '3.8rem', fontWeight: '900', marginBottom: '1.2rem', letterSpacing: '-2px' }}>Club <span style={{ color: '#D32F2F' }}>Activities</span></h1>
                <p className="text-muted" style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', lineHeight: '1.7' }}>
                    Be part of the movement. Join our workshops, awareness campaigns, and community gatherings.
                </p>
            </div>

            {events.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '8rem 2rem',
                    borderRadius: '40px',
                    border: '2px dashed #eee',
                    background: '#fafafa',
                    animation: 'fadeInUp 1s ease'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📅</div>
                    <h3 style={{ fontWeight: '800', fontSize: '2rem' }}>Quiet Moments...</h3>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>No activities are currently scheduled. Check back soon for fresh opportunities.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '3rem',
                    animation: 'fadeInUp 1s ease 0.2s',
                    animationFillMode: 'both'
                }}>
                    {events.map((event, index) => {
                        const imageUrl = (event.images && event.images.length > 0) ? event.images[0].url : (event.imageUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
                        const eventDate = new Date(event.startDate || event.date);
                        const isUpcoming = eventDate > new Date();
                        const registered = isRegistered(event);
                        const isHovered = hoveredEvent === event._id;

                        return (
                            <div
                                key={event._id}
                                className="event-card"
                                onMouseEnter={() => setHoveredEvent(event._id)}
                                onMouseLeave={() => setHoveredEvent(null)}
                                style={{
                                    padding: 0,
                                    borderRadius: '40px',
                                    overflow: 'hidden',
                                    border: '1px solid #f0f0f0',
                                    background: 'white',
                                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 10px 40px -20px rgba(0,0,0,0.08)',
                                    position: 'relative',
                                    cursor: 'pointer'
                                }}
                            >
                                {/* Image Section */}
                                <div style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={imageUrl}
                                        className="event-image"
                                        alt={event.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 1.2s ease'
                                        }}
                                    />

                                    {/* Overlay Gradient */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)'
                                    }} />

                                    {/* Status Badge */}
                                    <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
                                        <span style={{
                                            background: isUpcoming ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.5)',
                                            color: isUpcoming ? '#D32F2F' : 'white',
                                            padding: '8px 20px',
                                            borderRadius: '100px',
                                            fontSize: '0.7rem',
                                            fontWeight: '900',
                                            letterSpacing: '1px',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}>
                                            {isUpcoming ? 'UPCOMING' : 'COMPLETED'}
                                        </span>
                                    </div>

                                    {/* Attendees Count */}
                                    <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
                                        <div style={{
                                            background: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            backdropFilter: 'blur(10px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            👥 {event.registrations?.length || 0}
                                        </div>
                                    </div>

                                    {/* Animated Date Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '1.5rem',
                                        right: '2rem',
                                        background: 'white',
                                        padding: '1rem',
                                        borderRadius: '24px',
                                        textAlign: 'center',
                                        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                                        minWidth: '80px',
                                        transform: isHovered ? 'scale(1.1) translateY(-10px)' : 'scale(1) translateY(0)',
                                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                    }}>
                                        <div style={{ color: '#D32F2F', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px' }}>{eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', lineHeight: 1, color: '#1a1a1a' }}>{eventDate.getDate()}</div>
                                    </div>
                                </div>

                                <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        color: '#D32F2F',
                                        fontSize: '0.75rem',
                                        marginBottom: '0.8rem',
                                        fontWeight: '900',
                                        letterSpacing: '1.5px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {event.eventType || 'GENERAL EVENT'}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.6rem',
                                        fontWeight: '800',
                                        marginBottom: '1.2rem',
                                        color: '#1a1a1a',
                                        lineHeight: 1.3,
                                        letterSpacing: '-0.5px'
                                    }}>{event.title}</h3>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.8rem',
                                        marginBottom: '1.5rem',
                                        color: '#666',
                                        fontSize: '0.95rem',
                                        fontWeight: '500'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <span style={{ fontSize: '1.2rem opacity: 0.6' }}>🕒</span> {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                            <span style={{ fontSize: '1.2rem opacity: 0.6' }}>📍</span> {event.location?.venue || event.location || 'TBA'}
                                        </div>
                                    </div>

                                    <p className="text-muted" style={{
                                        fontSize: '1rem',
                                        lineHeight: '1.8',
                                        marginBottom: '2.5rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '3',
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {event.description}
                                    </p>

                                    <div style={{ marginTop: 'auto' }}>
                                        {isUpcoming ? (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); !registered && handleRegister(event._id); }}
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '100px',
                                                    padding: '1.2rem',
                                                    fontWeight: '800',
                                                    fontSize: '0.9rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    transition: 'all 0.3s ease',
                                                    background: registered ? '#e8f5e9' : '#D32F2F',
                                                    color: registered ? '#2e7d32' : 'white',
                                                    border: registered ? '1px solid #c8e6c9' : 'none',
                                                    cursor: registered ? 'default' : 'pointer',
                                                    boxShadow: registered ? 'none' : '0 10px 20px rgba(211, 47, 47, 0.2)'
                                                }}
                                                disabled={registering === event._id || registered}
                                            >
                                                {registering === event._id ? 'Securing your spot...' : (registered ? '✓ You\'re on the list' : 'Join this activity')}
                                            </button>
                                        ) : (
                                            <button
                                                variant="outline"
                                                style={{
                                                    width: '100%',
                                                    borderRadius: '100px',
                                                    padding: '1rem',
                                                    border: '1px solid #eee',
                                                    color: '#999',
                                                    fontWeight: '700',
                                                    fontSize: '0.8rem',
                                                    textTransform: 'uppercase',
                                                    background: '#fafafa'
                                                }}
                                            >
                                                Event Closed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Events;
