import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './RequestReview.css';

const RequestReview = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [seniors, setSeniors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
        seniorId: '',
        scheduledAt: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchSeniors();
    }, []);

    const fetchSeniors = async () => {
        try {
            const response = await api.get('/users/seniors');
            setSeniors(response.data);
        } catch (error) {
            console.error('Failed to fetch seniors:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/reviews/requests', formData);
            setSuccess(true);
            setTimeout(() => navigate('/my-reviews'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    const topics = [
        'Technical Interview',
        'System Design',
        'Data Structures & Algorithms',
        'Behavioral Interview',
        'Project Presentation',
        'Code Review',
        'Resume Review',
        'Other'
    ];

    if (success) {
        return (
            <div className="request-success">
                <div className="success-icon">✅</div>
                <h2>Request Submitted!</h2>
                <p>A senior will review your request soon.</p>
                <p className="redirect-text">Redirecting to your reviews...</p>
            </div>
        );
    }

    return (
        <div className="request-review">
            <div className="page-header">
                <h1>Request Mock Interview</h1>
                <p>Get valuable feedback from experienced seniors</p>
            </div>

            <div className="request-form-card">
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="topic">Interview Topic *</label>
                        <select
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a topic</option>
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what you'd like to focus on in this mock interview..."
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="seniorId">Preferred Senior (Optional)</label>
                        <select
                            id="seniorId"
                            name="seniorId"
                            value={formData.seniorId}
                            onChange={handleChange}
                        >
                            <option value="">Any available senior</option>
                            {seniors.map((senior) => (
                                <option key={senior.id} value={senior.id}>
                                    {senior.name} {senior.batch && `(${senior.batch})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="scheduledAt">Preferred Date & Time (Optional)</label>
                        <input
                            type="datetime-local"
                            id="scheduledAt"
                            name="scheduledAt"
                            value={formData.scheduledAt}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestReview;
