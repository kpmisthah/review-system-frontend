import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './MyReviews.css';

const MyReviews = () => {
    const { isSenior } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('reviews');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [isSenior]);

    const fetchData = async () => {
        try {
            const endpoint = isSenior ? '/reviews/given' : '/reviews/my';
            const [reviewsRes, requestsRes] = await Promise.all([
                api.get(endpoint),
                api.get(isSenior ? '/reviews/requests/pending' : '/reviews/requests/my')
            ]);
            setReviews(reviewsRes.data);
            setRequests(requestsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= rating ? 'star filled' : 'star'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="my-reviews">
            <div className="page-header">
                <h1>{isSenior ? 'Reviews Given' : 'My Feedback'}</h1>
                <p>{isSenior ? 'Track all reviews you have given' : 'View feedback from your mock interviews'}</p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Reviews ({reviews.length})
                </button>
                <button
                    className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Requests ({requests.length})
                </button>
            </div>

            {activeTab === 'reviews' && (
                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Reviews Yet</h3>
                            <p>{isSenior ? 'Start reviewing juniors to see them here.' : 'Request a mock interview to get feedback!'}</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="review-meta">
                                        <h3>{review.request?.topic || 'Mock Interview'}</h3>
                                        <span className="date">{formatDate(review.createdAt)}</span>
                                    </div>
                                    {renderStars(review.rating)}
                                </div>

                                <p className="reviewer-name">
                                    {isSenior ? `To: ${review.junior?.name}` : `From: ${review.senior?.name}`}
                                </p>

                                <div className="feedback-section">
                                    <div className="feedback-block strengths">
                                        <h4>💪 Strengths</h4>
                                        <p>{review.strengths}</p>
                                    </div>

                                    <div className="feedback-block improvements">
                                        <h4>📈 Areas to Improve</h4>
                                        <p>{review.improvements}</p>
                                    </div>

                                    {review.notes && (
                                        <div className="feedback-block notes">
                                            <h4>📝 Additional Notes</h4>
                                            <p>{review.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="requests-list">
                    {requests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No Requests</h3>
                            <p>No pending or past requests found.</p>
                        </div>
                    ) : (
                        requests.map((request) => (
                            <div key={request.id} className="request-item">
                                <div className="request-header">
                                    <span className="topic">{request.topic}</span>
                                    <span className={`status ${request.status.toLowerCase()}`}>
                                        {request.status}
                                    </span>
                                </div>
                                {request.description && <p className="desc">{request.description}</p>}
                                <p className="date">Created: {formatDate(request.createdAt)}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MyReviews;
