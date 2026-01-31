import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import './Dashboard.css';

const Dashboard = () => {
    const { user, isSenior } = useAuth();
    const [stats, setStats] = useState({
        totalReviews: 0,
        pendingRequests: 0,
        avgRating: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [isSenior]);

    const fetchDashboardData = async () => {
        try {
            if (isSenior) {
                // Senior dashboard data
                const [reviewsRes, requestsRes] = await Promise.all([
                    api.get('/reviews/given'),
                    api.get('/reviews/requests/pending')
                ]);
                setStats({
                    totalReviews: reviewsRes.data.length,
                    pendingRequests: requestsRes.data.length,
                    avgRating: calculateAvgRating(reviewsRes.data)
                });
                setRecentActivity(reviewsRes.data.slice(0, 5));
            } else {
                // Junior dashboard data
                const [reviewsRes, requestsRes] = await Promise.all([
                    api.get('/reviews/my'),
                    api.get('/reviews/requests/my')
                ]);
                setStats({
                    totalReviews: reviewsRes.data.length,
                    pendingRequests: requestsRes.data.filter(r => r.status !== 'COMPLETED').length,
                    avgRating: calculateAvgRating(reviewsRes.data)
                });
                setRecentActivity(reviewsRes.data.slice(0, 5));
            }
        } catch (error) {
            console.error('Dashboard data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAvgRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <div>
                            <Skeleton type="text" width="300px" height="40px" />
                            <Skeleton type="text" width="100px" height="24px" style={{ marginTop: '10px' }} />
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="stat-card">
                            <Skeleton type="circle" width="60px" height="60px" />
                            <div className="stat-info" style={{ width: '100%' }}>
                                <Skeleton type="text" width="40px" height="32px" />
                                <Skeleton type="text" width="100px" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-content">
                    <div className="recent-activity">
                        <Skeleton type="text" width="200px" height="30px" style={{ marginBottom: '20px' }} />
                        <div className="activity-list">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="activity-item">
                                    <div className="activity-header">
                                        <Skeleton type="text" width="150px" />
                                        <Skeleton type="text" width="80px" />
                                    </div>
                                    <Skeleton type="text" width="120px" style={{ marginBottom: '8px' }} />
                                    <Skeleton type="text" width="100%" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="quick-actions">
                        <Skeleton type="text" width="150px" height="30px" style={{ marginBottom: '20px' }} />
                        <div className="action-buttons">
                            <Skeleton type="rect" height="60px" />
                            <Skeleton type="rect" height="60px" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p className="role-badge">{user?.role}</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon reviews">📝</div>
                    <div className="stat-info">
                        <h3>{stats.totalReviews}</h3>
                        <p>{isSenior ? 'Reviews Given' : 'Reviews Received'}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pendingRequests}</h3>
                        <p>Pending Requests</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon rating">⭐</div>
                    <div className="stat-info">
                        <h3>{stats.avgRating || 'N/A'}</h3>
                        <p>Average Rating</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-activity">
                    <h2>Recent {isSenior ? 'Reviews Given' : 'Feedback'}</h2>
                    {recentActivity.length === 0 ? (
                        <div className="empty-state">
                            <p>No reviews yet. {isSenior ? 'Start reviewing juniors!' : 'Request a mock interview!'}</p>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {recentActivity.map((review) => (
                                <div key={review.id} className="activity-item">
                                    <div className="activity-header">
                                        <span className="activity-topic">{review.request?.topic || 'Mock Interview'}</span>
                                        <span className="activity-rating">{renderStars(review.rating)}</span>
                                    </div>
                                    <p className="activity-name">
                                        {isSenior ? `To: ${review.junior?.name}` : `From: ${review.senior?.name}`}
                                    </p>
                                    <p className="activity-preview">{review.strengths?.substring(0, 100)}...</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        {isSenior ? (
                            <>
                                <a href="/pending-requests" className="action-btn">
                                    <span>📋</span>
                                    View Pending Requests
                                </a>
                                <a href="/my-reviews" className="action-btn">
                                    <span>📝</span>
                                    My Given Reviews
                                </a>
                            </>
                        ) : (
                            <>
                                <a href="/request-review" className="action-btn">
                                    <span>🎯</span>
                                    Request Mock Interview
                                </a>
                                <a href="/my-reviews" className="action-btn">
                                    <span>📊</span>
                                    View My Feedback
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
