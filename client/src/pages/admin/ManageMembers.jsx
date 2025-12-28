import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

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

const ManageMembers = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.roles?.includes('superadmin') || user?.role === 'superadmin';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true);
            const result = await adminService.getAllUsers({
                page,
                limit: 20,
                search: searchTerm
            });

            if (result.success) {
                setUsers(result.data || []);
                setPagination({
                    currentPage: result.currentPage || 1,
                    totalPages: result.totalPages || 1,
                    total: result.total || 0
                });
            } else {
                setError('Failed to load users');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await adminService.deleteUser(userId);
                setUsers(users.filter(user => user._id !== userId));
            } catch (err) {
                alert('Failed to delete user: ' + err.message);
            }
        }
    };

    const handleRoleChange = async (userId, newRoles) => {
        try {
            await adminService.updateUserRoles(userId, [newRoles]);
            setUsers(users.map(user =>
                user._id === userId ? { ...user, roles: [newRoles] } : user
            ));
        } catch (err) {
            alert('Failed to update role: ' + err.message);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            await adminService.updateUserStatus(userId, {
                isActive: !currentStatus
            });
            setUsers(users.map(user =>
                user._id === userId ? { ...user, isActive: !currentStatus } : user
            ));
        } catch (err) {
            alert('Failed to toggle status: ' + err.message);
        }
    };

    if (loading) return <div className="text-center p-5">Loading members...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ color: '#1a1a2e', margin: 0 }}>Manage Members</h2>
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }}>🔍</span>
                </div>
            </div>

            {error && <div className="alert alert-danger mb-4" style={{ color: 'red' }}>{error}</div>}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                            {users.length > 0 ? (
                                users.map(user => (
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
                                            <div style={{ fontSize: '0.85rem', color: '#E53935', fontWeight: '500' }}>
                                                {user.phoneNumbers?.[0]?.number || 'No phone'}
                                            </div>
                                            {user.department && <div style={{ fontSize: '0.8rem', color: '#888' }}>{user.department}</div>}
                                        </td>
                                        <td style={tdStyle}>
                                            {isSuperAdmin ? (
                                                <select
                                                    value={user.roles?.[0] || 'member'}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="peer_educator">Peer Educator</option>
                                                    <option value="advisor">Advisor</option>
                                                    <option value="moderator">Moderator</option>
                                                    <option value="content_manager">Content Manager</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="superadmin">Super Admin</option>
                                                </select>
                                            ) : (
                                                <span style={{
                                                    padding: '4px 10px',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem'
                                                }}>
                                                    {user.roles?.[0]?.replace('_', ' ') || 'member'}
                                                </span>
                                            )}
                                        </td>
                                        <td style={tdStyle}>
                                            <span
                                                onClick={() => isSuperAdmin && handleToggleStatus(user._id, user.isActive)}
                                                style={{
                                                    cursor: isSuperAdmin ? 'pointer' : 'default',
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
                                            {isSuperAdmin && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', borderColor: '#ffcdd2', color: '#d32f2f' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#777' }}>
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        className="btn btn-outline"
                        disabled={pagination.currentPage === 1}
                        onClick={() => fetchUsers(pagination.currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                    <button
                        className="btn btn-outline"
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => fetchUsers(pagination.currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageMembers;
