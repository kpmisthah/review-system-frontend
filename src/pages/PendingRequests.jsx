import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './PendingRequests.css';

const PendingRequests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        rating: 3,
        strengths: '',
        improvements: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await api.get('/reviews/requests/pending');
            setRequests(response.data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await api.patch(`/reviews/requests/${requestId}/accept`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post('/reviews', {
                requestId: selectedRequest.id,
                ...reviewForm
            });
            setSelectedRequest(null);
            setReviewForm({ rating: 3, strengths: '', improvements: '', notes: '' });
            fetchPendingRequests();
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading requests...</p>
            </div>
        );
    }

    return (
        <div className="pending-requests">
            <div className="page-header">
                <h1>Pending Review Requests</h1>
                <p>Accept and conduct mock interviews with juniors</p>
            </div>

            {requests.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No Pending Requests</h3>
                    <p>All caught up! Check back later for new requests.</p>
                </div>
            ) : (
                <div className="requests-grid">
                    {requests.map((request) => (
                        <div key={request.id} className={`request-card ${request.status.toLowerCase()}`}>
                            <div className="request-header">
                                <span className="topic-tag">{request.topic}</span>
                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                    {request.status}
                                </span>
                            </div>

                            <div className="request-info">
                                <div className="junior-profile-mini">
                                    <img
                                        src={request.junior?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.junior?.name)}&background=random`}
                                        alt={request.junior?.name}
                                        className="avatar-lg"
                                    />
                                    <div className="junior-details">
                                        <h4>{request.junior?.name}</h4>
                                        <p className="batch-badge">{request.junior?.batch || 'No batch'}</p>
                                        {request.junior?.bio && (
                                            <p className="junior-bio">{request.junior.bio}</p>
                                        )}
                                        {request.junior?.skills && request.junior.skills.length > 0 && (
                                            <div className="mini-skills">
                                                {request.junior.skills.slice(0, 3).map(skill => (
                                                    <span key={skill} className="mini-skill-pill">{skill}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {request.description && (
                                    <p className="description">{request.description}</p>
                                )}

                                <p className="date">Requested: {formatDate(request.createdAt)}</p>
                            </div>

                            <div className="request-actions">
                                {request.status === 'PENDING' && (
                                    <button
                                        className="btn-accept"
                                        onClick={() => handleAccept(request.id)}
                                    >
                                        Accept Request
                                    </button>
                                )}
                                {request.status === 'ACCEPTED' && (
                                    <button
                                        className="btn-review"
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        Submit Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Submit Review</h2>
                            <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
                        </div>

                        <div className="modal-info">
                            <p><strong>Junior:</strong> {selectedRequest.junior?.name}</p>
                            <p><strong>Topic:</strong> {selectedRequest.topic}</p>
                        </div>

                        <form onSubmit={handleSubmitReview}>
                            <div className="form-group">
                                <label>Rating</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="strengths">Strengths *</label>
                                <textarea
                                    id="strengths"
                                    value={reviewForm.strengths}
                                    onChange={(e) => setReviewForm({ ...reviewForm, strengths: e.target.value })}
                                    placeholder="What did the junior do well?"
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="improvements">Areas for Improvement *</label>
                                <textarea
                                    id="improvements"
                                    value={reviewForm.improvements}
                                    onChange={(e) => setReviewForm({ ...reviewForm, improvements: e.target.value })}
                                    placeholder="What can they improve on?"
                                    required
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes</label>
                                <textarea
                                    id="notes"
                                    value={reviewForm.notes}
                                    onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                                    placeholder="Any additional feedback or resources..."
                                    rows={2}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setSelectedRequest(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
