import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Skeleton from '../components/Skeleton';
import './FindMentor.css';

const FindMentor = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMentors();
    }, [searchTerm, skillFilter]);

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (skillFilter) params.skill = skillFilter;

            const response = await api.get('/users/mentors', { params });
            setMentors(response.data);
        } catch (error) {
            console.error('Failed to fetch mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = (mentorId) => {
        navigate(`/request-review?mentor=${mentorId}`);
    };

    return (
        <div className="find-mentor-container">
            <header className="page-header">
                <h1>Find a Mentor</h1>
                <p>Connect with experienced developers to review your code.</p>
            </header>

            <div className="search-controls">
                <div className="search-input">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or bio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="search-input">
                    <span className="search-icon">🏷️</span>
                    <input
                        type="text"
                        placeholder="Filter by skill (e.g. React)..."
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="mentors-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="mentor-card skeleton-card">
                            <Skeleton type="circle" width="80px" height="80px" />
                            <Skeleton type="text" width="60%" height="24px" style={{ margin: '12px auto' }} />
                            <Skeleton type="text" width="40%" height="16px" style={{ margin: '0 auto 12px' }} />
                            <Skeleton type="text" width="90%" height="14px" />
                            <Skeleton type="text" width="90%" height="14px" style={{ marginTop: '4px' }} />
                        </div>
                    ))}
                </div>
            ) : mentors.length === 0 ? (
                <div className="empty-state">
                    <h3>No mentors found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="mentors-grid">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="mentor-card">
                            <div className="mentor-header">
                                <img
                                    src={mentor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=random`}
                                    alt={mentor.name}
                                    className="mentor-avatar"
                                />
                                {mentor.experience > 0 && (
                                    <span className="exp-badge">{mentor.experience}+ Years Exp</span>
                                )}
                            </div>

                            <h3>{mentor.name}</h3>
                            <p className="mentor-batch">{mentor.batch}</p>

                            <p className="mentor-bio">
                                {mentor.bio || 'No bio provided.'}
                            </p>

                            <div className="mentor-skills">
                                {mentor.skills && mentor.skills.slice(0, 4).map(skill => (
                                    <span key={skill} className="skill-pill">{skill}</span>
                                ))}
                                {mentor.skills && mentor.skills.length > 4 && (
                                    <span className="skill-pill more">+{mentor.skills.length - 4}</span>
                                )}
                            </div>

                            <div className="mentor-links">
                                {mentor.linkedin && (
                                    <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                        🔗
                                    </a>
                                )}
                                {mentor.github && (
                                    <a href={mentor.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                                        💻
                                    </a>
                                )}
                            </div>

                            <button
                                onClick={() => handleBookSession(mentor.id)}
                                className="btn-primary book-btn"
                            >
                                Request Review
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindMentor;
