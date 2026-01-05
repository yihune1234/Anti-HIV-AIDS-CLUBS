import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import sessionService from '../services/sessionService';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user) return;
        
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
            const upcomingEvents = events
                .filter(e => new Date(e.startDate) > now)
                .slice(0, 5);
            const upcomingSessions = sessions
                .filter(s => new Date(s.date) > now)
                .slice(0, 5);

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

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    useEffect(() => {
        fetchNotifications();
        
        // Refresh notifications every 5 minutes
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications
    };
};