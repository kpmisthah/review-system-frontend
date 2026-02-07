import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // If user is already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="home-page">
            <nav className="home-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <span className="brand-icon">🎯</span>
                        <span className="brand-text">ReviewHub</span>
                    </div>
                    <div className="nav-auth">
                        <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <Link to="/login" className="btn-text">Log In</Link>
                        <Link to="/register" className="btn-primary">Sign Up</Link>
                    </div>
                </div>
            </nav>

            <main className="hero-section">
                <div className="hero-content">
                    <span className="badge-new">New Batch 2026</span>
                    <h1>Master Your Tech Interviews <br />With <span className="highlight">Peer Reviews</span></h1>
                    <p className="hero-subtitle">
                        Bridge the gap between learning and hired. Connect with experienced seniors,
                        schedule mock interviews, and get the structured feedback you need to succeed.
                    </p>

                    <div className="hero-actions">
                        <Link to="/register" className="btn-lg btn-primary">Start for Free</Link>
                        <Link to="/login" className="btn-lg btn-outline">Existing User?</Link>
                    </div>

                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Mock Interviews</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">100+</span>
                            <span className="stat-label">Active Seniors</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">4.8/5</span>
                            <span className="stat-label">Average Rating</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-card floating-card-1">
                        <div className="card-header">
                            <div className="avatar senior">S</div>
                            <div>
                                <h4>System Design</h4>
                                <p>Accepted by Sarah</p>
                            </div>
                        </div>
                        <div className="card-status">Upcoming Today, 4:00 PM</div>
                    </div>

                    <div className="visual-card floating-card-2">
                        <div className="score-circle">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                                <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="circle" strokeDasharray="90, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <span className="score-text">4.5</span>
                        </div>
                        <div className="feedback-preview">
                            <div className="line full"></div>
                            <div className="line three-quarter"></div>
                            <div className="line half"></div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="features-section">
                <h2>How It Works</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon icon-request">📝</div>
                        <h3>Request Review</h3>
                        <p>Submitting a request is easy. Choose a topic like DSA or System Design and set your availability.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon icon-match">🤝</div>
                        <h3>Get Matched</h3>
                        <p>Available seniors will pick up your request. Co-ordinate easily and hop on a structured mock call.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon icon-grow">🚀</div>
                        <h3>Grow Faster</h3>
                        <p>Receive detailed, written feedback on your strengths and areas of improvement to level up.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
