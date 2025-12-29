import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MemberContacts = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/member-contacts');
            if (response.data.success) {
                setContacts(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch member contacts');
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={loadingStyle}>Loading member contacts...</div>;
    if (error) return <div style={errorStyle}>{error}</div>;

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Member Contact Management</h1>
                <p style={subtitleStyle}>Official contact information for club communication only.</p>
            </div>

            <div style={actionBarStyle}>
                <div style={searchWrapperStyle}>
                    <span style={searchIconStyle}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, ID, department or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={searchInputStyle}
                    />
                </div>
                <button onClick={fetchContacts} style={refreshButtonStyle}>Refresh Data</button>
            </div>

            <div style={tableContainerStyle}>
                <table className="admin-table responsive-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Student ID</th>
                            <th>Department</th>
                            <th>Position</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <tr key={contact.memberId} style={trStyle}>
                                    <td data-label="Full Name" style={tdStyle}>
                                        <div style={nameWrapperStyle}>
                                            <div style={avatarStyle}>{contact.fullName.charAt(0)}</div>
                                            {contact.fullName}
                                        </div>
                                    </td>
                                    <td data-label="Student ID" style={tdStyle}>{contact.studentId}</td>
                                    <td data-label="Department" style={tdStyle}>{contact.department}</td>
                                    <td data-label="Position" style={tdStyle}>
                                        <span style={badgeStyle(contact.position)}>
                                            {contact.position}
                                        </span>
                                    </td>
                                    <td data-label="Email" style={tdStyle}>
                                        <a href={`mailto:${contact.email}`} style={linkStyle}>{contact.email}</a>
                                    </td>
                                    <td data-label="Phone Number" style={tdStyle}>
                                        <a href={`tel:${contact.phone}`} style={linkStyle}>{contact.phone}</a>
                                    </td>
                                    <td data-label="Status" style={tdStyle}>
                                        <span style={statusStyle(contact.membershipStatus)}>
                                            {contact.membershipStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={noDataStyle}>No member contacts found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={footerNoteStyle}>
                <strong>Security Note:</strong> This information is restricted for official Haramaya University Anti-HIV/AIDS Club use only. Unauthorized sharing of member contacts is strictly prohibited.
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    padding: '20px',
    animation: 'fadeIn 0.5s ease-in-out'
};

const headerStyle = {
    marginBottom: '30px',
};

const titleStyle = {
    color: '#1a1a2e',
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 10px 0'
};

const subtitleStyle = {
    color: '#666',
    fontSize: '1rem',
    margin: 0
};

const actionBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '15px'
};

const searchWrapperStyle = {
    position: 'relative',
    flex: '1',
    minWidth: '300px'
};

const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999'
};

const searchInputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const refreshButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#3b3b58',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s'
};

const tableContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    marginBottom: '20px'
};



const trStyle = {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
};

const tdStyle = {
    padding: '15px 20px',
    fontSize: '0.95rem',
    color: '#444'
};

const nameWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '600'
};

const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#E53935',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem'
};

const linkStyle = {
    color: '#E53935',
    textDecoration: 'none',
    fontWeight: '500'
};

const badgeStyle = (position) => ({
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backgroundColor: position === 'member' ? '#e9ecef' : '#fff3cd',
    color: position === 'member' ? '#495057' : '#856404',
    textTransform: 'capitalize'
});

const statusStyle = (status) => ({
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    backgroundColor: status === 'active' ? '#d4edda' : '#f8d7da',
    color: status === 'active' ? '#155724' : '#721c24',
    textTransform: 'capitalize'
});

const noDataStyle = {
    padding: '40px',
    textAlign: 'center',
    color: '#999',
    fontSize: '1.1rem'
};

const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '1.2rem',
    color: '#3b3b58'
};

const errorStyle = {
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '10px',
    margin: '20px'
};

const footerNoteStyle = {
    padding: '15px',
    backgroundColor: '#e2e3e5',
    borderRadius: '10px',
    color: '#383d41',
    fontSize: '0.9rem',
    borderLeft: '4px solid #3b3b58'
};

export default MemberContacts;
