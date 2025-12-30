import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';



const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
};

const modalContentStyle = {
    backgroundColor: 'white', padding: 'clamp(1.5rem, 5vw, 2rem)', borderRadius: '8px', width: '400px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto'
};

const getRoleColor = (roles) => {
    if (!roles || roles.length === 0) return '#757575';
    // Return color for the highest role
    if (roles.includes('superadmin')) return '#000000';
    if (roles.includes('admin')) return '#d32f2f';
    if (roles.includes('advisor')) return '#1976d2';
    if (roles.includes('peer_educator')) return '#ed6c02';
    return '#757575';
};

const ManageUsers = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const isSuperAdmin = currentUser?.roles?.includes('superadmin') || currentUser?.role === 'superadmin';

    // Helper function to get friendly error message
    const getFriendlyError = (error) => {
        if (!error) return 'An unexpected error occurred. Please try again.';
        const errorMsg = error.message || error.response?.data?.message || error.toString();
        const lowerMsg = errorMsg.toLowerCase();
        if (lowerMsg.includes('network') || lowerMsg.includes('fetch')) {
            return 'Unable to connect to the server. Please check your internet connection.';
        }
        if (lowerMsg.includes('unauthorized') || lowerMsg.includes('token')) {
            return 'Your session has expired. Please log in again.';
        }
        if (lowerMsg.includes('validation') || lowerMsg.includes('invalid')) {
            return 'Please check your input and try again.';
        }
        if (lowerMsg.includes('500') || lowerMsg.includes('server error')) {
            return 'A server error occurred. Please try again later.';
        }
        if (!lowerMsg.includes('undefined') && !lowerMsg.includes('null') && 
            !lowerMsg.includes('exception') && errorMsg.length < 100) {
            return errorMsg;
        }
        return 'An unexpected error occurred. Please try again or contact support.';
    };

    useEffect(() => {
        if (isSuperAdmin) {
            fetchUsers();
            fetchStats();
        }
    }, [isSuperAdmin]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            if (response.data && response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            alert('⚠️ Error loading users: ' + getFriendlyError(error));
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            if (response.data && response.data.success) {
                setStats(response.data.data.users);
            }
        } catch (error) {
            console.warn('Failed to fetch user stats:', error);
        }
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser || selectedRoles.length === 0) return;
        try {
            await api.patch(`/admin/users/${selectedUser._id}/roles`, { roles: selectedRoles });
            alert('✅ User roles updated successfully!');
            setRoleModalOpen(false);
            fetchUsers();
        } catch (error) {
            alert('⚠️ ' + getFriendlyError(error));
        }
    };

    const handleToggleStatus = async (user) => {
        const action = user.isActive ? 'deactivate' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
                alert(`✅ User ${action}d successfully!`);
                fetchUsers();
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
                alert('✅ User deleted successfully!');
                fetchStats();
            } catch (error) {
                alert('⚠️ ' + getFriendlyError(error));
            }
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRoles(user.roles || []);
        setRoleModalOpen(true);
    };

    const toggleRole = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="container mt-5" style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#d32f2f' }}>Access Denied</h1>
                <p>You need Super Admin privileges to access this page.</p>
            </div>
        );
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: '#1a1a2e', marginBottom: '10px' }}>Manage Users</h1>
                <p style={{ color: '#666' }}>Super Admin tool to manage user accounts, roles, and status.</p>

                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1a1a2e' }}>{stats.total || 0}</h3>
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Total Users</p>
                        </div>
                        <div className="card" style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#2e7d32' }}>{stats.active || 0}</h3>
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' }}>Active Users</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: 0, backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Roles</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td data-label="User">
                                        <div style={{ fontWeight: '600', color: '#1a1a2e' }}>{user.firstName} {user.lastName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#777' }}>@{user.username} • {user.email}</div>
                                        {user.phoneNumbers?.[0]?.number && (
                                            <div style={{ fontSize: '0.75rem', color: '#d32f2f', fontWeight: '500', marginTop: '2px' }}>
                                                📞 {user.phoneNumbers[0].number}
                                            </div>
                                        )}
                                    </td>
                                    <td data-label="Roles">
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {(user.roles || ['member']).map(role => (
                                                <span key={role} style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '600',
                                                    backgroundColor: getRoleColor([role]),
                                                    color: 'white',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {role.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td data-label="Status">
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            backgroundColor: user.isActive ? '#d4edda' : '#f8d7da',
                                            color: user.isActive ? '#155724' : '#721c24'
                                        }}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td data-label="Joined">
                                        <div style={{ fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td data-label="Actions">
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                                                onClick={() => openRoleModal(user)}
                                            >
                                                Roles
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    fontSize: '0.75rem',
                                                    padding: '4px 8px',
                                                    backgroundColor: user.isActive ? '#f8d7da' : '#d4edda',
                                                    color: user.isActive ? '#721c24' : '#155724',
                                                    border: 'none'
                                                }}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {user.isActive ? 'Deact' : 'Act'}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#d32f2f', borderColor: '#ffcdd2' }}
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
                        <h3 style={{ margin: '0 0 10px 0', color: '#1a1a2e' }}>Manage User Roles</h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', color: '#666' }}>
                            Update roles for <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {['superadmin', 'admin', 'advisor', 'peer_educator', 'moderator', 'content_manager', 'member'].map(role => (
                                <label key={role} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '5px',
                                    backgroundColor: selectedRoles.includes(role) ? '#f0f0ff' : 'transparent'
                                }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => toggleRole(role)}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <span style={{ textTransform: 'capitalize', fontWeight: selectedRoles.includes(role) ? '600' : '400' }}>
                                        {role.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setRoleModalOpen(false)}
                                style={{ padding: '8px 16px' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleRoleUpdate}
                                style={{ padding: '8px 16px', backgroundColor: '#1a1a2e', color: 'white', border: 'none' }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;