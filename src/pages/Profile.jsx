import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/userService';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);


    const [formData, setFormData] = useState({
        name: user?.name || '',
        batch: user?.batch || '',
        avatar: user?.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            addToast('New passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                batch: formData.batch,
                avatar: formData.avatar
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const updatedUser = await updateProfile(updateData);
            updateUser(updatedUser);

            addToast('Profile updated successfully!', 'success');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            addToast(error.response?.data?.error || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>Edit Profile</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2>Basic Information</h2>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Batch / Cohort</label>
                            <input
                                type="text"
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                placeholder="e.g. Batch 2024"
                            />
                        </div>

                        <div className="form-group">
                            <label>Avatar URL</label>
                            <input
                                type="url"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Security</h2>
                        <p className="hint">Leave blank to keep current password</p>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {formData.newPassword && (
                            <div className="form-group required">
                                <label>Current Password (Required to change password)</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
