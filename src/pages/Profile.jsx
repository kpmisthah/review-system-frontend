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
        bio: user?.bio || '',
        experience: user?.experience || 0,
        skills: user?.skills || [],
        linkedin: user?.linkedin || '',
        github: user?.github || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [skillInput, setSkillInput] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skillInput.trim()]
                }));
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
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
                avatar: formData.avatar,
                bio: formData.bio,
                experience: formData.experience,
                skills: formData.skills,
                linkedin: formData.linkedin,
                github: formData.github
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
                <h1>Edit Mentorship Profile</h1>
                <p className="subtitle">Showcase your expertise to the community</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid-layout">
                        {/* Left Column - Basics */}
                        <div className="form-column">
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
                                <h2>Social & Links</h2>
                                <div className="form-group">
                                    <label>LinkedIn URL</label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GitHub URL</label>
                                    <input
                                        type="url"
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Mentorship Details */}
                        <div className="form-column">
                            <div className="form-section">
                                <h2>Expertise</h2>
                                <div className="form-group">
                                    <label>Years of Experience</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Short Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Skills <span className="hint">(Press Enter to add)</span></label>
                                    <div className="skills-input-container">
                                        <div className="skills-list">
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="skill-tag">
                                                    {skill}
                                                    <button type="button" onClick={() => removeSkill(skill)}>&times;</button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={handleSkillKeyDown}
                                            placeholder="Add specific skills (e.g. React, Node.js)"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h2>Security</h2>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {formData.newPassword && (
                                    <div className="form-group required">
                                        <label>Current Password</label>
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
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving Profile...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
