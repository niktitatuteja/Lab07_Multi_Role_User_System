const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
  findById,
  addUser,
  updateUserRole,
  deleteUser,
  getAllUsers,
  safeUser,
} = require("../data/store");
const bcrypt = require("bcryptjs");

// GET /api/users/me — all authenticated users
router.get("/me", authMiddleware, (req, res) => {
  const user = findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json({ user: safeUser(user) });
});

// GET /api/users — ADMIN sees only USERs; SUPER_ADMIN sees all
router.get(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  (req, res) => {
    const all = getAllUsers();
    let result;
    if (req.user.role === "SUPER_ADMIN") {
      result = all.map(safeUser);
    } else {
      // ADMIN: only sees USER role accounts
      result = all.filter((u) => u.role === "USER").map(safeUser);
    }
    return res.status(200).json({ users: result });
  }
);

// POST /api/users — ADMIN can create USER; SUPER_ADMIN can create ADMIN or USER
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  async (req, res) => {
    try {
      const { name, email, password, role = "USER" } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "name, email, and password are required" });
      }

      // ADMIN can only create USER accounts
      if (req.user.role === "ADMIN" && role !== "USER") {
        return res.status(403).json({ message: "Forbidden: ADMIN can only create USER accounts" });
      }

      // SUPER_ADMIN can create USER or ADMIN
      if (req.user.role === "SUPER_ADMIN" && !["USER", "ADMIN"].includes(role)) {
        return res.status(403).json({ message: "Forbidden: Cannot create SUPER_ADMIN accounts" });
      }

      const { findByEmail } = require("../data/store");
      if (findByEmail(email)) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = addUser({ name, email, password: hashed, role });
      return res.status(201).json({ user: safeUser(user) });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// PATCH /api/users/:id/role — SUPER_ADMIN only
router.patch(
  "/:id/role",
  authMiddleware,
  requireRole("SUPER_ADMIN"),
  (req, res) => {
    const { role } = req.body;
    const validRoles = ["USER", "ADMIN", "SUPER_ADMIN"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: `role must be one of: ${validRoles.join(", ")}` });
    }
    // Prevent demoting yourself
    if (req.params.id === req.user.id) {
      return res.status(403).json({ message: "Cannot change your own role" });
    }
    const updated = updateUserRole(req.params.id, role);
    if (!updated) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: safeUser(updated) });
  }
);

// DELETE /api/users/:id — ADMIN can delete USER; SUPER_ADMIN can delete anyone
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN", "SUPER_ADMIN"),
  (req, res) => {
    const target = findById(req.params.id);
    if (!target) return res.status(404).json({ message: "User not found" });

    // Prevent self-deletion
    if (target.id === req.user.id) {
      return res.status(403).json({ message: "Cannot delete your own account" });
    }

    // ADMIN can only delete USER-role accounts
    if (req.user.role === "ADMIN" && target.role !== "USER") {
      return res.status(403).json({ message: "Forbidden: ADMIN can only delete USER accounts" });
    }

    deleteUser(req.params.id);
    return res.status(200).json({ message: "User deleted successfully" });
  }
);

module.exports = router;
