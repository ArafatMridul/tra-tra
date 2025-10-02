import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={() => navigate("/")}>
        <span className="logo">🌍</span>
        <div>
          <h1>Travel Journal</h1>
          <p>Remember every adventure</p>
        </div>
      </button>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : undefined)}>
          Dashboard
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : undefined)}>
          Profile
        </NavLink>
      </nav>
      <div className="profile">
        <div className="profile-info">
          <p>{user?.fullName}</p>
          <span>{user?.email}</span>
        </div>
        <button onClick={handleLogout} className="ghost">
          Logout
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
