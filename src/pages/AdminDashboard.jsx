import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as userService from '../services/userService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            addToast('Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            setUsers(users.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
            addToast(`User role updated to ${newRole}`, 'success');
        } catch (error) {
            addToast('Failed to update user role', 'error');
        }
    };

    // Calculate stats
    const stats = {
        total: users.length,
        juniors: users.filter(u => u.role === 'JUNIOR').length,
        seniors: users.filter(u => u.role === 'SENIOR').length,
        admins: users.filter(u => u.role === 'ADMIN').length
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>System Overview & User Management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.juniors}</span>
                    <span className="stat-label">Juniors</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.seniors}</span>
                    <span className="stat-label">Seniors</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.admins}</span>
                    <span className="stat-label">Admins</span>
                </div>
            </div>

            <div className="users-table-container">
                <div className="table-header">
                    <h2>User Management</h2>
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Batch</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{u.name}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>{u.batch || '-'}</td>
                                <td>
                                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    {u.id !== user.id && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {u.role === 'JUNIOR' && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => handleRoleUpdate(u.id, 'SENIOR')}
                                                >
                                                    Promote to Senior
                                                </button>
                                            )}
                                            {u.role === 'SENIOR' && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => handleRoleUpdate(u.id, 'JUNIOR')}
                                                >
                                                    Demote to Junior
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
