
# Multi-Role User System (API + UI)

This project implements a complete Role-Based Access Control (RBAC) system using a **Node.js/Express** backend and a **React (Vite)** frontend. It features JWT-based authentication, password hashing with bcrypt, and fine-grained authorization across different user roles (SUPER_ADMIN, ADMIN, and USER).

## Features
- **Authentication**: JWT Bearer tokens and bcrypt password hashing.
- **Authorization**: Role-based access control protecting both API endpoints and UI routes.
- **Frontend**: Premium dark theme UI with conditional rendering based on user permissions.
- **Backend**: RESTful API with middleware for token validation and role enforcement.

## How to Run

You will need two terminal windows to run both the backend and frontend simultaneously.

### 1. Start the Backend
Open a terminal, navigate to the `backend` folder, install dependencies, and start the server:
```bash
cd backend
npm install
npm start
```
*The backend server will run at http://localhost:3000*

### 2. Start the Frontend
Open a second terminal, navigate to the `frontend` folder, install dependencies, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will be available at http://localhost:5173*

## Test Credentials

The system uses an in-memory data store seeded with the following test credentials so you can verify the different role permissions immediately:

### ⚡ Super Admin
Has full access. Can view, create, delete all users, and change the roles of any user.
- **Email:** `superadmin@app.com`
- **Password:** `super123`

### 🔧 Admin
Has restricted management access. Can only view, create, and delete standard `USER` role accounts. Cannot see or modify other Admins or the Super Admin.
- **Email:** `admin@app.com`
- **Password:** `admin123`

### 👤 User
Standard access. Can view their own profile but has no access to user management features. 
*You can create a new standard user by using the "Register" link on the Login page.*


