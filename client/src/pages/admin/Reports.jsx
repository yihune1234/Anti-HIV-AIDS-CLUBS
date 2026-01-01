import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

// Responsive styles
const responsiveContainer = {
    padding: 'clamp(1rem, 4vw, 2rem)',
    maxWidth: '100%',
    overflow: 'hidden'
};

const responsiveHeader = {
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: '700',
    color: '#1a1a2e'
};

const responsiveTabs = {
    display: 'flex',
    justifyContent: 'center',
    gap: 'clamp(0.25rem, 2vw, 0.5rem)',
    marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
    borderBottom: '2px solid #eee',
    flexWrap: 'wrap',
    overflowX: 'auto',
    paddingBottom: '2px',
    WebkitOverflowScrolling: 'touch'
};

const responsiveTab = (isActive) => ({
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderBottom: isActive ? '3px solid #ffeb3b' : 'none',
    fontWeight: isActive ? '700' : '500',
    color: isActive ? '#1a1a2e' : '#777',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(0.25rem, 1vw, 0.5rem)',
    flexShrink: 0,
    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
    whiteSpace: 'nowrap'
});

const responsiveCard = {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)'
};

const responsiveTableContainer = {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    maxWidth: '100%'
};

const responsiveButton = {
    padding: 'clamp(0.4rem, 1.5vw, 0.6rem) clamp(0.8rem, 2.5vw, 1rem)',
    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
};

// Mobile card styles for table data
const mobileCardContainer = {
    display: 'none',
    gap: 'clamp(0.75rem, 2vw, 1rem)',
    flexDirection: 'column'
};

const mobileCard = {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const mobileCardHeader = {
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
    borderBottom: '1px solid #eee',
    paddingBottom: 'clamp(0.25rem, 1vw, 0.5rem)'
};

const mobileCardRow = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
    lineHeight: '1.4'
};

const mobileCardLabel = {
    fontWeight: '600',
    color: '#666',
    minWidth: 'clamp(80px, 25vw, 120px)',
    flexShrink: 0
};

const mobileCardValue = {
    color: '#333',
    textAlign: 'right',
    wordBreak: 'break-word',
    flex: 1,
    marginLeft: 'clamp(0.5rem, 1.5vw, 1rem)'
};

// Media query for mobile tables
const mobileStyle = `
@media (max-width: 768px) {
    .desktop-table {
        display: none;
    }
    .mobile-cards {
        display: flex !important;
    }
}

@media (min-width: 769px) {
    .mobile-cards {
        display: none !important;
    }
}
`;

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
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                    fontWeight: '700',
                    color: '#1a1a2e'
                }}>Users Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(usersData, 'users_report')}
                    style={responsiveButton}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={responsiveCard}>
                {/* Desktop Table */}
                <div className="desktop-table" style={responsiveTableContainer}>
                    <table className="admin-table" style={{ 
                        width: '100%',
                        minWidth: '600px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Username</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Name</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Email</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Role</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Department</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Status</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map(user => (
                                <tr key={user._id}>
                                    <td data-label="Username" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{user.username}</td>
                                    <td data-label="Name" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{user.firstName} {user.lastName}</td>
                                    <td data-label="Email" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', wordBreak: 'break-word' }}>{user.email}</td>
                                    <td data-label="Role" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{user.roles?.join(', ')}</td>
                                    <td data-label="Department" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{user.department || '-'}</td>
                                    <td data-label="Status" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{user.membershipStatus}</td>
                                    <td data-label="Joined" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={mobileCardContainer}>
                    {usersData.map(user => (
                        <div key={user._id} style={mobileCard}>
                            <div style={mobileCardHeader}>
                                {user.firstName} {user.lastName}
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Username:</span>
                                <span style={mobileCardValue}>{user.username}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Email:</span>
                                <span style={mobileCardValue}>{user.email}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Role:</span>
                                <span style={mobileCardValue}>{user.roles?.join(', ') || '-'}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Department:</span>
                                <span style={mobileCardValue}>{user.department || '-'}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Status:</span>
                                <span style={{...mobileCardValue, color: user.membershipStatus === 'active' ? '#2E7D32' : '#666'}}>
                                    {user.membershipStatus}
                                </span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Joined:</span>
                                <span style={mobileCardValue}>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEventsReport = () => (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                    fontWeight: '700',
                    color: '#1a1a2e'
                }}>Events Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(eventsData, 'events_report')}
                    style={responsiveButton}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={responsiveCard}>
                {/* Desktop Table */}
                <div className="desktop-table" style={responsiveTableContainer}>
                    <table className="admin-table" style={{ 
                        width: '100%',
                        minWidth: '700px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Event Title</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Type</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Date</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Registrations</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attended</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attendance Rate</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventsData.map(event => (
                                <tr key={event._id}>
                                    <td data-label="Event Title" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', wordBreak: 'break-word' }}>{event.title}</td>
                                    <td data-label="Type" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.eventType}</td>
                                    <td data-label="Date" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{new Date(event.startDate).toLocaleDateString()}</td>
                                    <td data-label="Registrations" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.totalRegistrations}</td>
                                    <td data-label="Attended" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.totalAttended}</td>
                                    <td data-label="Attendance Rate" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                                        {event.totalRegistrations > 0
                                            ? `${((event.totalAttended / event.totalRegistrations) * 100).toFixed(1)}%`
                                            : '0%'}
                                    </td>
                                    <td data-label="Status" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={mobileCardContainer}>
                    {eventsData.map(event => (
                        <div key={event._id} style={mobileCard}>
                            <div style={mobileCardHeader}>
                                {event.title}
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Type:</span>
                                <span style={mobileCardValue}>{event.eventType}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Date:</span>
                                <span style={mobileCardValue}>{new Date(event.startDate).toLocaleDateString()}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Registrations:</span>
                                <span style={mobileCardValue}>{event.totalRegistrations}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attended:</span>
                                <span style={mobileCardValue}>{event.totalAttended}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attendance:</span>
                                <span style={{
                                    ...mobileCardValue,
                                    padding: 'clamp(0.15rem, 0.5vw, 0.25rem) clamp(0.4rem, 1vw, 0.6rem)',
                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                                    fontWeight: '600',
                                    backgroundColor: event.totalRegistrations > 0 && ((event.totalAttended / event.totalRegistrations) * 100) >= 70 ? '#E8F5E9' : '#FFEBEE',
                                    color: event.totalRegistrations > 0 && ((event.totalAttended / event.totalRegistrations) * 100) >= 70 ? '#2E7D32' : '#C62828',
                                    display: 'inline-block'
                                }}>
                                    {event.totalRegistrations > 0
                                        ? `${((event.totalAttended / event.totalRegistrations) * 100).toFixed(1)}%`
                                        : '0%'}
                                </span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Status:</span>
                                <span style={{
                                    ...mobileCardValue,
                                    color: event.status === 'completed' ? '#2E7D32' : event.status === 'ongoing' ? '#F57C00' : '#666'
                                }}>
                                    {event.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSessionsReport = () => (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                    fontWeight: '700',
                    color: '#1a1a2e'
                }}>Education Sessions Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(sessionsData, 'sessions_report')}
                    style={responsiveButton}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={responsiveCard}>
                {/* Desktop Table */}
                <div className="desktop-table" style={responsiveTableContainer}>
                    <table className="admin-table" style={{ 
                        width: '100%',
                        minWidth: '700px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Session Title</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Topic</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Date</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Participants</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attended</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attendance Rate</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionsData.map(session => (
                                <tr key={session._id}>
                                    <td data-label="Session Title" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', wordBreak: 'break-word' }}>{session.title}</td>
                                    <td data-label="Topic" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{session.topic}</td>
                                    <td data-label="Date" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{new Date(session.date).toLocaleDateString()}</td>
                                    <td data-label="Participants" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{session.totalParticipants}</td>
                                    <td data-label="Attended" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{session.totalAttended}</td>
                                    <td data-label="Attendance Rate" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                                        {session.totalParticipants > 0
                                            ? `${((session.totalAttended / session.totalParticipants) * 100).toFixed(1)}%`
                                            : '0%'}
                                    </td>
                                    <td data-label="Status" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{session.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={mobileCardContainer}>
                    {sessionsData.map(session => (
                        <div key={session._id} style={mobileCard}>
                            <div style={mobileCardHeader}>
                                {session.title}
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Topic:</span>
                                <span style={mobileCardValue}>{session.topic}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Date:</span>
                                <span style={mobileCardValue}>{new Date(session.date).toLocaleDateString()}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Participants:</span>
                                <span style={mobileCardValue}>{session.totalParticipants}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attended:</span>
                                <span style={mobileCardValue}>{session.totalAttended}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attendance:</span>
                                <span style={{
                                    ...mobileCardValue,
                                    padding: 'clamp(0.15rem, 0.5vw, 0.25rem) clamp(0.4rem, 1vw, 0.6rem)',
                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                                    fontWeight: '600',
                                    backgroundColor: session.totalParticipants > 0 && ((session.totalAttended / session.totalParticipants) * 100) >= 70 ? '#E8F5E9' : '#FFEBEE',
                                    color: session.totalParticipants > 0 && ((session.totalAttended / session.totalParticipants) * 100) >= 70 ? '#2E7D32' : '#C62828',
                                    display: 'inline-block'
                                }}>
                                    {session.totalParticipants > 0
                                        ? `${((session.totalAttended / session.totalParticipants) * 100).toFixed(1)}%`
                                        : '0%'}
                                </span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Status:</span>
                                <span style={{
                                    ...mobileCardValue,
                                    color: session.status === 'completed' ? '#2E7D32' : session.status === 'ongoing' ? '#F57C00' : '#666'
                                }}>
                                    {session.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAttendanceReport = () => (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
                    fontWeight: '700',
                    color: '#1a1a2e'
                }}>Attendance Report</h3>
                <button
                    className="btn btn-outline"
                    onClick={() => exportToCSV(attendanceData, 'attendance_report')}
                    style={responsiveButton}
                >
                    📥 Export CSV
                </button>
            </div>

            <div className="card" style={{ ...responsiveCard, marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', 
                    gap: 'clamp(0.75rem, 2vw, 1rem)' 
                }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
                        />
                    </div>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => loadReport('attendance')}
                    style={{ 
                        ...responsiveButton,
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: 'clamp(0.75rem, 2vw, 1rem)'
                    }}
                >
                    📊 Generate Report
                </button>
            </div>

            <div className="card" style={responsiveCard}>
                {/* Desktop Table */}
                <div className="desktop-table" style={responsiveTableContainer}>
                    <table className="admin-table" style={{ 
                        width: '100%',
                        minWidth: '600px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                    }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Event</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Date</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Registrations</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attended</th>
                                <th style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map(event => (
                                <tr key={event.eventId}>
                                    <td data-label="Event" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)', wordBreak: 'break-word' }}>{event.title}</td>
                                    <td data-label="Date" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{new Date(event.date).toLocaleDateString()}</td>
                                    <td data-label="Registrations" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.totalRegistrations}</td>
                                    <td data-label="Attended" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>{event.totalAttended}</td>
                                    <td data-label="Attendance Rate" style={{ padding: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
                                        <span style={{
                                            padding: 'clamp(0.15rem, 0.5vw, 0.25rem) clamp(0.4rem, 1vw, 0.6rem)',
                                            borderRadius: 'clamp(8px, 2vw, 12px)',
                                            fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                                            fontWeight: '600',
                                            backgroundColor: parseFloat(event.attendanceRate) >= 70 ? '#E8F5E9' : '#FFEBEE',
                                            color: parseFloat(event.attendanceRate) >= 70 ? '#2E7D32' : '#C62828',
                                            display: 'inline-block'
                                        }}>
                                            {event.attendanceRate}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="mobile-cards" style={mobileCardContainer}>
                    {attendanceData.map(event => (
                        <div key={event.eventId} style={mobileCard}>
                            <div style={mobileCardHeader}>
                                {event.title}
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Date:</span>
                                <span style={mobileCardValue}>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Registrations:</span>
                                <span style={mobileCardValue}>{event.totalRegistrations}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attended:</span>
                                <span style={mobileCardValue}>{event.totalAttended}</span>
                            </div>
                            <div style={mobileCardRow}>
                                <span style={mobileCardLabel}>Attendance:</span>
                                <span style={{
                                    ...mobileCardValue,
                                    padding: 'clamp(0.15rem, 0.5vw, 0.25rem) clamp(0.4rem, 1vw, 0.6rem)',
                                    borderRadius: 'clamp(8px, 2vw, 12px)',
                                    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                                    fontWeight: '600',
                                    backgroundColor: parseFloat(event.attendanceRate) >= 70 ? '#E8F5E9' : '#FFEBEE',
                                    color: parseFloat(event.attendanceRate) >= 70 ? '#2E7D32' : '#C62828',
                                    display: 'inline-block'
                                }}>
                                    {event.attendanceRate}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <style>{mobileStyle}</style>
            <div style={responsiveContainer}>
                <h2 style={responsiveHeader}>Reports & Analytics</h2>

                {/* Report Type Selector */}
                <div style={responsiveTabs}>
                    {[
                        { key: 'users', label: 'Users', icon: '👥' },
                        { key: 'events', label: 'Events', icon: '📅' },
                        { key: 'sessions', label: 'Sessions', icon: '🎓' },
                        { key: 'attendance', label: 'Attendance', icon: '✅' }
                    ].map(report => (
                        <button
                            key={report.key}
                            onClick={() => setActiveReport(report.key)}
                            style={responsiveTab(activeReport === report.key)}
                        >
                            <span>{report.icon}</span>
                            {report.label}
                        </button>
                    ))}
                </div>

                {/* Report Content */}
                {loading ? (
                    <div className="text-center" style={{ 
                        padding: 'clamp(2rem, 5vw, 3rem)',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        color: '#666'
                    }}>
                        <div style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>⏳</div>
                        Loading report data...
                    </div>
                ) : (
                    <>
                        {activeReport === 'users' && renderUsersReport()}
                        {activeReport === 'events' && renderEventsReport()}
                        {activeReport === 'sessions' && renderSessionsReport()}
                        {activeReport === 'attendance' && renderAttendanceReport()}
                    </>
                )}
            </div>
        </>
    );
};



export default Reports;
