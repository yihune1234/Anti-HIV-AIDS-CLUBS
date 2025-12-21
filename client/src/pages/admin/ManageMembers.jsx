import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const ManageMembers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const result = await userService.getAllUsers();
            if (result.success) {
                // Assuming result.data.users is the array based on controller pattern
                setUsers(result.data.users || []);
            } else {
                setUsers([]);
                setError('Failed to load users data format.');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userService.deleteUser(userId);
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to delete user: ' + err);
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } catch (err) {
            alert('Failed to update role: ' + err);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const result = await userService.toggleUserStatus(userId);
            // Result usually returns the updated user, but let's blindly toggle for UI speed if we trust backend
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isActive: !user.isActive } : user
            ));
        } catch (err) {
            alert('Failed to toggle status: ' + err);
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center p-5">Loading members...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: '#1a1a2e', margin: 0 }}>Manage Members</h2>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', minWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>🔍</span>
                </div>
            </div>

            {error && <div className="alert alert-danger mb-4" style={{ color: 'red' }}>{error}</div>}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <tr>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tdStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffeb3b', color: '#f57f17', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                    {user.firstName?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', color: '#333' }}>{user.firstName} {user.lastName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#777' }}>@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tdStyle}>
                                            <div style={{ color: '#555' }}>{user.email}</div>
                                            {user.department && <div style={{ fontSize: '0.8rem', color: '#888' }}>{user.department}</div>}
                                        </td>
                                        <td style={tdStyle}>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="user">Member</option>
                                                <option value="peer_educator">Peer Educator</option>
                                                <option value="advisor">Advisor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td style={tdStyle}>
                                            <span
                                                onClick={() => handleToggleStatus(user._id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    padding: '0.25rem 0.6rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: user.isActive ? '#E8F5E9' : '#FFEBEE',
                                                    color: user.isActive ? '#2E7D32' : '#C62828'
                                                }}
                                            >
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="btn btn-outline"
                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', borderColor: '#ffcdd2', color: '#d32f2f' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>
                                        No members found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555'
};

const tdStyle = {
    padding: '1rem',
    fontSize: '0.95rem'
};

export default ManageMembers;
