import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';
import sessionService from '../../services/sessionService';

const NotificationCenter = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const [eventsRes, sessionsRes] = await Promise.all([
                eventService.getAllEvents(),
                sessionService.getAllSessions()
            ]);

            const events = eventsRes.data?.events || eventsRes.data || [];
            const sessions = sessionsRes.data || [];

            // Create notifications for upcoming events and sessions
            const now = new Date();
            const upcomingEvents = events.filter(e => new Date(e.startDate) > now).slice(0, 5);
            const upcomingSessions = sessions.filter(s => new Date(s.date) > now).slice(0, 5);

            const eventNotifications = upcomingEvents.map(event => ({
                id: `event-${event._id}`,
                type: 'event',
                title: 'New Event Available',
                message: `${event.title} - ${new Date(event.startDate).toLocaleDateString()}`,
                timestamp: event.createdAt || new Date().toISOString(),
                isRead: false,
                data: event
            }));

            const sessionNotifications = upcomingSessions.map(session => ({
                id: `session-${session._id}`,
                type: 'session',
                title: 'Peer Education Session',
                message: `${session.title} - ${new Date(session.date).toLocaleDateString()}`,
                timestamp: session.createdAt || new Date().toISOString(),
                isRead: false,
                data: session
            }));

            const allNotifications = [...eventNotifications, ...sessionNotifications]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setNotifications(allNotifications);
            setUnreadCount(allNotifications.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'event': return '📅';
            case 'session': return '🎓';
            default: return '📢';
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            width: '350px',
            maxHeight: '500px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid #f0f0f0',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%)',
                color: 'white'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>
                        Notifications
                    </h3>
                    {unreadCount > 0 && (
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                            {unreadCount} unread
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Content */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
                        <p>No new notifications</p>
                    </div>
                ) : (
                    <div>
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    borderBottom: '1px solid #f5f5f5',
                                    cursor: 'pointer',
                                    background: notification.isRead ? 'white' : '#f8f9ff',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#f0f0f0';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = notification.isRead ? 'white' : '#f8f9ff';
                                }}
                            >
                                {!notification.isRead && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '6px',
                                        height: '6px',
                                        background: '#D32F2F',
                                        borderRadius: '50%'
                                    }} />
                                )}
                                
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            color: '#1a1a2e',
                                            marginBottom: '0.3rem'
                                        }}>
                                            {notification.title}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#666',
                                            lineHeight: '1.4',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {notification.message}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#999',
                                            fontWeight: '500'
                                        }}>
                                            {new Date(notification.timestamp).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid #f0f0f0',
                    background: '#f8f9fa',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                            setUnreadCount(0);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Mark All as Read
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;