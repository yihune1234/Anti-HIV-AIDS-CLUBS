import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const thStyle = { padding: '1rem', textAlign: 'left', color: '#555' };
const tdStyle = { padding: '1rem', borderTop: '1px solid #eee' };

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};

const modalContentStyle = {
    backgroundColor: 'white', padding: 'clamp(1.5rem, 5vw, 2rem)', borderRadius: '8px', width: '400px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto'
};

const getRoleColor = (role) => {
    switch (role) {
        case 'admin': return '#d32f2f'; // Red
        case 'advisor': return '#1976d2'; // Blue
        case 'peer_educator': return '#ed6c02'; // Orange
        default: return '#757575'; // Grey
    }
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userService.getAllUsers();
            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else if (Array.isArray(response)) {
                setUsers(response);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await userService.getUserStats();
            setStats(response.data || response);
        } catch (error) {
            console.warn('Failed to fetch user stats:', error);
        }
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser || !newRole) return;
        try {
            await userService.updateUserRole(selectedUser._id, newRole);
            alert(`User role updated to ${newRole}`);
            setRoleModalOpen(false);
            fetchUsers();
            fetchStats();
        } catch (error) {
            alert('Failed to update role: ' + error);
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.isActive ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await userService.toggleUserStatus(user._id);
                fetchUsers();
            } catch (error) {
                alert('Failed to update user status: ' + error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(u => u._id !== id));
                fetchStats();
            } catch (error) {
                alert('Failed to delete user: ' + error);
            }
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setRoleModalOpen(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2>Manage Users</h2>
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: 0 }}>{stats.totalUsers || 0}</h3>
                            <p style={{ margin: 0, color: '#666' }}>Total Users</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: 0 }}>{stats.activeUsers || 0}</h3>
                            <p style={{ margin: 0, color: '#666' }}>Active</p>
                        </div>
                        <div className="card" style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: 0 }}>{stats.admins || 0}</h3>
                            <p style={{ margin: 0, color: '#666' }}>Admins</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: 0 }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                            <tr>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Role</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Joined</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>
                                        <div style={{ fontWeight: '500' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#777' }}>{user.email}</div>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            backgroundColor: getRoleColor(user.role),
                                            color: 'white'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            color: user.isActive ? '#2e7d32' : '#d32f2f',
                                            fontWeight: '500',
                                            fontSize: '0.9rem'
                                        }}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={tdStyle}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                                                onClick={() => openRoleModal(user)}
                                            >
                                                Role
                                            </button>
                                            <button
                                                className="btn btn-outline"
                                                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', color: user.isActive ? '#d32f2f' : '#2e7d32', borderColor: 'currentColor' }}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {user.isActive ? 'Deact' : 'Act'}
                                            </button>
                                            <button
                                                className="btn btn-outline"
                                                style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', color: '#d32f2f', borderColor: '#ffcdd2' }}
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Modal */}
            {roleModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h3>Change Role</h3>
                        <p>Updating role for <strong>{selectedUser?.name}</strong></p>

                        <div className="form-group">
                            <label className="form-label">Select Role</label>
                            <select
                                className="form-control"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                <option value="user">User</option>
                                <option value="peer_educator">Peer Educator</option>
                                <option value="advisor">Advisor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn btn-outline" onClick={() => setRoleModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleRoleUpdate}>Update Role</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;