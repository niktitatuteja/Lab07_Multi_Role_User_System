import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../api/api";

const ROLES = ["USER", "ADMIN", "SUPER_ADMIN"];

const UserManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await usersAPI.list();
      setUsers(data.users);
    } catch (err) {
      if (err.status === 403) setForbidden(true);
      else setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await usersAPI.remove(id);
      setSuccessMsg(`User "${name}" deleted.`);
      fetchUsers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.status === 403 ? `Forbidden: ${err.message}` : err.message);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await usersAPI.changeRole(id, newRole);
      setSuccessMsg("Role updated successfully.");
      fetchUsers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.status === 403 ? `Forbidden: ${err.message}` : err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateLoading(true);
    try {
      await usersAPI.create(createForm);
      setShowCreate(false);
      setCreateForm({ name: "", email: "", password: "", role: "USER" });
      setSuccessMsg("User created successfully.");
      fetchUsers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setCreateError(err.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleBadge = (role) => {
    if (role === "SUPER_ADMIN") return "badge badge-super";
    if (role === "ADMIN") return "badge badge-admin";
    return "badge badge-user";
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div className="page-container">
      <nav className="navbar">
        <div className="navbar-brand">🛡️ RoleSystem</div>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          {isAdmin && <Link to="/users" className="nav-link active">Users</Link>}
          <button id="logout-btn-users" onClick={handleLogout} className="btn btn-ghost">Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>User Management</h1>
            <p>You are viewing as <span className={roleBadge(user?.role)}>{user?.role}</span></p>
          </div>
          {isAdmin && (
            <button
              id="create-user-btn"
              className="btn btn-primary"
              onClick={() => setShowCreate(!showCreate)}
            >
              {showCreate ? "Cancel" : "+ Create User"}
            </button>
          )}
        </div>

        {forbidden && (
          <div className="alert alert-forbidden">
            <h2>🚫 403 — Forbidden</h2>
            <p>You do not have permission to access this resource.</p>
          </div>
        )}

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {showCreate && (
          <div className="create-form-card">
            <h2>Create New User</h2>
            <form onSubmit={handleCreate} className="auth-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              {isSuperAdmin && (
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}
              {createError && <div className="alert alert-error">{createError}</div>}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button id="create-submit-btn" type="submit" className="btn btn-primary" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create User"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-screen">Loading users...</div>
        ) : !forbidden && (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>No users found</td></tr>
                ) : users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td className="email-cell">{u.email}</td>
                    <td>
                      {isSuperAdmin && u.id !== user.id ? (
                        <select
                          className={`role-select ${roleBadge(u.role)}`}
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      ) : (
                        <span className={roleBadge(u.role)}>{u.role}</span>
                      )}
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.id !== user.id && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(u.id, u.name)}
                          id={`delete-user-${u.id}`}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserManagement;
