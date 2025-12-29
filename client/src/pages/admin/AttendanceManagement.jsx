import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import eventService from '../../services/eventService';

const AttendanceManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAllEvents();
            if (response.data && Array.isArray(response.data)) {
                setEvents(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        }
    };

    const fetchEventAttendees = async (eventId) => {
        setLoading(true);
        try {
            const result = await adminService.getEventAttendees(eventId);
            if (result.success) {
                setSelectedEvent(result.data.event);
                setAttendees(result.data.attendees || []);
            }
        } catch (error) {
            console.error('Failed to fetch attendees:', error);
            alert('Failed to load attendees');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async (userId, currentStatus) => {
        try {
            await adminService.markAttendance(selectedEvent.id, userId, !currentStatus);

            // Update local state
            setAttendees(attendees.map(attendee =>
                attendee.user._id === userId
                    ? { ...attendee, attended: !currentStatus }
                    : attendee
            ));
        } catch (error) {
            alert('Failed to update attendance: ' + error.message);
        }
    };

    const filteredAttendees = attendees.filter(attendee => {
        const user = attendee.user;
        const search = searchTerm.toLowerCase();
        return (
            user.firstName?.toLowerCase().includes(search) ||
            user.lastName?.toLowerCase().includes(search) ||
            user.email?.toLowerCase().includes(search) ||
            user.username?.toLowerCase().includes(search)
        );
    });

    const attendanceStats = {
        total: attendees.length,
        attended: attendees.filter(a => a.attended).length,
        pending: attendees.filter(a => !a.attended).length,
        rate: attendees.length > 0
            ? ((attendees.filter(a => a.attended).length / attendees.length) * 100).toFixed(1)
            : 0
    };

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Attendance Management</h2>

            {/* Event Selection */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Select Event</h3>
                <select
                    className="form-control"
                    onChange={(e) => {
                        const eventId = e.target.value;
                        if (eventId) fetchEventAttendees(eventId);
                    }}
                    defaultValue=""
                >
                    <option value="">-- Select an event --</option>
                    {events.map(event => (
                        <option key={event._id} value={event._id}>
                            {event.title} - {new Date(event.startDate).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            </div>

            {/* Attendance Stats */}
            {selectedEvent && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: '#1a1a2e' }}>{attendanceStats.total}</h3>
                            <p className="text-muted">Total Registered</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: '#4CAF50' }}>{attendanceStats.attended}</h3>
                            <p className="text-muted">Attended</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: '#FF9800' }}>{attendanceStats.pending}</h3>
                            <p className="text-muted">Pending</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                            <h3 style={{ margin: 0, fontSize: '2rem', color: '#2196F3' }}>{attendanceStats.rate}%</h3>
                            <p className="text-muted">Attendance Rate</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Search attendees..."
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ maxWidth: '400px' }}
                        />
                    </div>

                    {/* Attendees List */}
                    <div className="card" style={{ padding: 0 }}>
                        {loading ? (
                            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading attendees...</div>
                        ) : (
                            <table className="admin-table responsive-table">
                                <thead>
                                    <tr>
                                        <th>Attendee</th>
                                        <th className="hide-tablet">Email</th>
                                        <th className="hide-mobile">Department</th>
                                        <th className="hide-tablet">Registration Date</th>
                                        <th>Attendance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAttendees.length > 0 ? (
                                        filteredAttendees.map(attendee => (
                                            <tr key={attendee.user._id}>
                                                <td data-label="Attendee">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: attendee.user.profileImage ? `url(${attendee.user.profileImage})` : '#ffeb3b',
                                                            backgroundSize: 'cover',
                                                            color: '#f57f17',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: '0.8rem'
                                                        }}>
                                                            {!attendee.user.profileImage && (attendee.user.firstName?.charAt(0) || '?')}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: '600', color: '#333' }}>
                                                                {attendee.user.firstName} {attendee.user.lastName}
                                                            </div>
                                                            <div style={{ fontSize: '0.85rem', color: '#777' }}>
                                                                @{attendee.user.username}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td data-label="Email" className="hide-tablet">{attendee.user.email}</td>
                                                <td data-label="Department" className="hide-mobile">{attendee.user.department || '-'}</td>
                                                <td data-label="Registration Date" className="hide-tablet">
                                                    {new Date(attendee.registrationDate).toLocaleDateString()}
                                                </td>
                                                <td data-label="Attendance">
                                                    <span style={{
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        backgroundColor: attendee.attended ? '#E8F5E9' : '#FFEBEE',
                                                        color: attendee.attended ? '#2E7D32' : '#C62828'
                                                    }}>
                                                        {attendee.attended ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                                <td data-label="Action">
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.3rem 0.8rem',
                                                            fontSize: '0.85rem',
                                                            borderColor: attendee.attended ? '#ffcdd2' : '#A5D6A7',
                                                            color: attendee.attended ? '#d32f2f' : '#2E7D32'
                                                        }}
                                                        onClick={() => handleMarkAttendance(attendee.user._id, attendee.attended)}
                                                    >
                                                        {attendee.attended ? 'Mark Absent' : 'Mark Present'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>
                                                {searchTerm ? 'No attendees found matching your search.' : 'No registrations for this event.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};



export default AttendanceManagement;
