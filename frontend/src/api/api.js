const BASE_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
};

export const authAPI = {
  register: (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

export const usersAPI = {
  me: () => apiFetch("/users/me"),
  list: () => apiFetch("/users"),
  create: (body) => apiFetch("/users", { method: "POST", body: JSON.stringify(body) }),
  changeRole: (id, role) =>
    apiFetch(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  remove: (id) => apiFetch(`/users/${id}`, { method: "DELETE" }),
};
