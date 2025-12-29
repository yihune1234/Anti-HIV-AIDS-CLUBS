import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const Reports = () => {
    const [activeReport, setActiveReport] = useState('users');
    const [loading, setLoading] = useState(false);
    const [usersData, setUsersData] = useState([]);
    const [eventsData, setEventsData] = useState([]);
    const [sessionsData, setSessionsData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });


    useEffect(() => {
        loadReport(activeReport);
    }, [activeReport]);

    const loadReport = async (reportType) => {
        setLoading(true);
        try {
            switch (reportType) {
                case 'users':
                    const usersResult = await adminService.getUsersReport();
                    if (usersResult.success) setUsersData(usersResult.data);
                    break;
                case 'events':
                    const eventsResult = await adminService.getEventsReport();
                    if (eventsResult.success) setEventsData(eventsResult.data);
                    break;
                case 'sessions':
                    const sessionsResult = await adminService.getSessionsReport();
                    if (sessionsResult.success) setSessionsData(sessionsResult.data);
                    break;
                case 'attendance':
                    const attendanceResult = await adminService.getAttendanceReport(
                        dateRange.startDate,
                        dateRange.endDate
                    );
                    if (attendanceResult.success) setAttendanceData(attendanceResult.data);
                    break;
            }
        } catch (error) {
            console.error('Failed to load report:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                if (value === null || value === undefined) return '';
                if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';');
                return String(value).replace(/,/g, ';');
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderUsersReport = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Users Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(usersData, 'users_report')}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table responsive-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData.map(user => (
                            <tr key={user._id}>
                                <td data-label="Username">{user.username}</td>
                                <td data-label="Name">{user.firstName} {user.lastName}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role">{user.roles?.join(', ')}</td>
                                <td data-label="Department">{user.department || '-'}</td>
                                <td data-label="Status">{user.membershipStatus}</td>
                                <td data-label="Joined">{new Date(user.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderEventsReport = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Events Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(eventsData, 'events_report')}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table responsive-table">
                    <thead>
                        <tr>
                            <th>Event Title</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Registrations</th>
                            <th>Attended</th>
                            <th>Attendance Rate</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventsData.map(event => (
                            <tr key={event._id}>
                                <td data-label="Event Title">{event.title}</td>
                                <td data-label="Type">{event.eventType}</td>
                                <td data-label="Date">{new Date(event.startDate).toLocaleDateString()}</td>
                                <td data-label="Registrations">{event.totalRegistrations}</td>
                                <td data-label="Attended">{event.totalAttended}</td>
                                <td data-label="Attendance Rate">
                                    {event.totalRegistrations > 0
                                        ? `${((event.totalAttended / event.totalRegistrations) * 100).toFixed(1)}%`
                                        : '0%'}
                                </td>
                                <td data-label="Status">{event.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSessionsReport = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Education Sessions Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(sessionsData, 'sessions_report')}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table responsive-table">
                    <thead>
                        <tr>
                            <th>Session Title</th>
                            <th>Topic</th>
                            <th>Date</th>
                            <th>Participants</th>
                            <th>Attended</th>
                            <th>Attendance Rate</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessionsData.map(session => (
                            <tr key={session._id}>
                                <td data-label="Session Title">{session.title}</td>
                                <td data-label="Topic">{session.topic}</td>
                                <td data-label="Date">{new Date(session.date).toLocaleDateString()}</td>
                                <td data-label="Participants">{session.totalParticipants}</td>
                                <td data-label="Attended">{session.totalAttended}</td>
                                <td data-label="Attendance Rate">
                                    {session.totalParticipants > 0
                                        ? `${((session.totalAttended / session.totalParticipants) * 100).toFixed(1)}%`
                                        : '0%'}
                                </td>
                                <td data-label="Status">{session.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAttendanceReport = () => (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Attendance Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(attendanceData, 'attendance_report')}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => loadReport('attendance')}
                >
                    Generate Report
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="admin-table responsive-table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Date</th>
                            <th>Registrations</th>
                            <th>Attended</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map(event => (
                            <tr key={event.eventId}>
                                <td data-label="Event">{event.title}</td>
                                <td data-label="Date">{new Date(event.date).toLocaleDateString()}</td>
                                <td data-label="Registrations">{event.totalRegistrations}</td>
                                <td data-label="Attended">{event.totalAttended}</td>
                                <td data-label="Attendance Rate">
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        backgroundColor: parseFloat(event.attendanceRate) >= 70 ? '#E8F5E9' : '#FFEBEE',
                                        color: parseFloat(event.attendanceRate) >= 70 ? '#2E7D32' : '#C62828'
                                    }}>
                                        {event.attendanceRate}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: '2rem' }}>Reports & Analytics</h2>

            {/* Report Type Selector */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #eee' }}>
                {[
                    { key: 'users', label: 'Users' },
                    { key: 'events', label: 'Events' },
                    { key: 'sessions', label: 'Sessions' },
                    { key: 'attendance', label: 'Attendance' }
                ].map(report => (
                    <button
                        key={report.key}
                        onClick={() => setActiveReport(report.key)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            borderBottom: activeReport === report.key ? '3px solid #ffeb3b' : 'none',
                            fontWeight: activeReport === report.key ? '600' : '400',
                            color: activeReport === report.key ? '#1a1a2e' : '#777'
                        }}
                    >
                        {report.label}
                    </button>
                ))}
            </div>

            {/* Report Content */}
            {loading ? (
                <div className="text-center p-5">Loading report...</div>
            ) : (
                <>
                    {activeReport === 'users' && renderUsersReport()}
                    {activeReport === 'events' && renderEventsReport()}
                    {activeReport === 'sessions' && renderSessionsReport()}
                    {activeReport === 'attendance' && renderAttendanceReport()}
                </>
            )}
        </div>
    );
};



export default Reports;
