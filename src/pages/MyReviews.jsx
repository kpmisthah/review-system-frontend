import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import './MyReviews.css';

const ReviewSkeleton = () => (
    <div className="review-card skeleton-card">
        <div className="review-header">
            <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="24px" className="mb-2" />
                <Skeleton width="40%" height="16px" />
            </div>
            <Skeleton width="100px" height="24px" />
        </div>
        <Skeleton width="30%" height="16px" className="mb-4" />
        <div className="feedback-section">
            <Skeleton className="skeleton-rect" height="80px" />
            <Skeleton className="skeleton-rect" height="80px" />
        </div>
    </div>
);

const MyReviews = () => {
    const { isSenior } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('reviews');
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [reviewFilter, setReviewFilter] = useState('0'); // 0 = All
    const [reviewSort, setReviewSort] = useState('newest');
    const [requestFilter, setRequestFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, [isSenior]);

    const fetchData = async () => {
        setLoading(true);
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

    const filteredReviews = useMemo(() => {
        let result = [...reviews];

        if (reviewFilter !== '0') {
            result = result.filter(r => r.rating === parseInt(reviewFilter));
        }

        result.sort((a, b) => {
            if (reviewSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (reviewSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (reviewSort === 'highest') return b.rating - a.rating;
            if (reviewSort === 'lowest') return a.rating - b.rating;
            return 0;
        });

        return result;
    }, [reviews, reviewFilter, reviewSort]);

    const filteredRequests = useMemo(() => {
        if (requestFilter === 'all') return requests;
        return requests.filter(r => r.status === requestFilter);
    }, [requests, requestFilter]);

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
                    Reviews
                </button>
                <button
                    className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Requests
                </button>
            </div>

            {activeTab === 'reviews' && (
                <>
                    <div className="filters-bar">
                        <div className="filter-group">
                            <label>Rating:</label>
                            <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)}>
                                <option value="0">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Sort By:</label>
                            <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="highest">Highest Rating</option>
                                <option value="lowest">Lowest Rating</option>
                            </select>
                        </div>
                        <div className="stats" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                            Showing {filteredReviews.length} reviews
                        </div>
                    </div>

                    <div className="reviews-list">
                        {loading ? (
                            <>
                                <ReviewSkeleton />
                                <ReviewSkeleton />
                                <ReviewSkeleton />
                            </>
                        ) : filteredReviews.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3>No Reviews Found</h3>
                                <p>Try adjusting your filters or check back later.</p>
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
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
                </>
            )}

            {activeTab === 'requests' && (
                <>
                    <div className="filters-bar">
                        <div className="filter-group">
                            <label>Status:</label>
                            <select value={requestFilter} onChange={(e) => setRequestFilter(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="requests-list">
                        {loading ? (
                            <>
                                <Skeleton height="100px" className="mb-4" />
                                <Skeleton height="100px" className="mb-4" />
                            </>
                        ) : filteredRequests.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📋</div>
                                <h3>No Requests Found</h3>
                                <p>No requests match existing filters.</p>
                            </div>
                        ) : (
                            filteredRequests.map((request) => (
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
                </>
            )}
        </div>
    );
};

export default MyReviews;
