require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Original routes
app.get("/", (req, res) =>
  res.send("Lab 06: Backend running and GitHub push successful")
);
app.get("/about", (req, res) => {
  res.send("Name: Nikita Rani | Enrollment: CS-23411267 | Section: 3CSE15");
});
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
