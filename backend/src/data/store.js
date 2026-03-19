const bcrypt = require("bcryptjs");

// Seed data: pre-hashed passwords
const SUPER_ADMIN_PASS = bcrypt.hashSync("super123", 10);
const ADMIN_PASS = bcrypt.hashSync("admin123", 10);

let users = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@app.com",
    password: SUPER_ADMIN_PASS,
    role: "SUPER_ADMIN",
    createdAt: new Date("2024-01-01").toISOString(),
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@app.com",
    password: ADMIN_PASS,
    role: "ADMIN",
    createdAt: new Date("2024-01-02").toISOString(),
  },
];

let nextId = 3;

const findByEmail = (email) =>
  users.find((u) => u.email === email.toLowerCase());

const findById = (id) => users.find((u) => u.id === String(id));

const addUser = ({ name, email, password, role = "USER" }) => {
  const user = {
    id: String(nextId++),
    name,
    email: email.toLowerCase(),
    password,
    role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
};

const updateUserRole = (id, role) => {
  const user = findById(id);
  if (!user) return null;
  user.role = role;
  return user;
};

const deleteUser = (id) => {
  const index = users.findIndex((u) => u.id === String(id));
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};

const getAllUsers = () => users;

const safeUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
});

module.exports = {
  findByEmail,
  findById,
  addUser,
  updateUserRole,
  deleteUser,
  getAllUsers,
  safeUser,
};
