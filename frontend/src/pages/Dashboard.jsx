import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleBadgeClass = (role) => {
  if (role === "SUPER_ADMIN") return "badge badge-super";
  if (role === "ADMIN") return "badge badge-admin";
  return "badge badge-user";
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-brand">🛡️ RoleSystem</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          {isAdmin && <Link to="/users" className="nav-link">Users</Link>}
          <button id="logout-btn" onClick={handleLogout} className="btn btn-ghost">
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>You are signed in as <span className={roleBadgeClass(user?.role)}>{user?.role}</span></p>
        </div>

        <div className="cards-grid">
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Your Profile</h3>
            <p>View and manage your account details</p>
            <Link to="/profile" id="go-to-profile" className="btn btn-secondary">View Profile</Link>
          </div>

          {isAdmin && (
            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>User Management</h3>
              <p>
                {isSuperAdmin
                  ? "View and manage all users across all roles"
                  : "Manage standard user accounts"}
              </p>
              <Link to="/users" id="go-to-users" className="btn btn-secondary">Manage Users</Link>
            </div>
          )}

          {isSuperAdmin && (
            <div className="dashboard-card card-highlight">
              <div className="card-icon">⚡</div>
              <h3>Super Admin Powers</h3>
              <p>Change user roles and perform all admin operations</p>
              <Link to="/users" className="btn btn-accent">Open Console</Link>
            </div>
          )}

          {!isAdmin && (
            <div className="dashboard-card">
              <div className="card-icon">ℹ️</div>
              <h3>Standard Access</h3>
              <p>You have standard user access. Contact an admin for elevated permissions.</p>
            </div>
          )}
        </div>

        <div className="permissions-panel">
          <h2>Your Permissions</h2>
          <div className="perm-list">
            <div className="perm-item perm-granted">✅ View Own Profile</div>
            <div className={`perm-item ${isAdmin ? "perm-granted" : "perm-denied"}`}>
              {isAdmin ? "✅" : "❌"} View User List
            </div>
            <div className={`perm-item ${isAdmin ? "perm-granted" : "perm-denied"}`}>
              {isAdmin ? "✅" : "❌"} Create Users
            </div>
            <div className={`perm-item ${isAdmin ? "perm-granted" : "perm-denied"}`}>
              {isAdmin ? "✅" : "❌"} Delete Users
            </div>
            <div className={`perm-item ${isSuperAdmin ? "perm-granted" : "perm-denied"}`}>
              {isSuperAdmin ? "✅" : "❌"} Change Roles
            </div>
            <div className={`perm-item ${isSuperAdmin ? "perm-granted" : "perm-denied"}`}>
              {isSuperAdmin ? "✅" : "❌"} View All Roles
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
