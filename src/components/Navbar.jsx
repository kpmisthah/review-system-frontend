import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isSenior } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/dashboard" className="nav-brand">
                    <span className="brand-icon">🎯</span>
                    <span className="brand-text">ReviewHub</span>
                </Link>

                <div className="nav-links">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        Dashboard
                    </Link>

                    {isSenior ? (
                        <Link to="/pending-requests" className={`nav-link ${isActive('/pending-requests') ? 'active' : ''}`}>
                            Pending Requests
                        </Link>
                    ) : (
                        <Link to="/request-review" className={`nav-link ${isActive('/request-review') ? 'active' : ''}`}>
                            Request Interview
                        </Link>
                    )}

                    <Link to="/my-reviews" className={`nav-link ${isActive('/my-reviews') ? 'active' : ''}`}>
                        {isSenior ? 'Given Reviews' : 'My Feedback'}
                    </Link>
                </div>

                <div className="nav-user">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{user?.role}</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
