# Full-Stack Todo List Application

A professional Task Management system built with a modern decoupled architecture. This project features a robust **.NET Minimal API** backend and a dynamic **React** frontend, integrated with a **MySQL** database and secured via **JWT Authentication**.

---

## 🚀 Key Features

* **Secure Authentication**: Full Login/Register flow with JWT.
* **Data Isolation**: Users only see and manage their own tasks.
* **Persistent Storage**: Real-time synchronization with a MySQL database.
* **Session Management**: Automatic logout and redirection on token expiry using Axios Interceptors.
* **Responsive UI**: Optimized for all screen sizes using the classic TodoMVC styling.

---

## 🛠 Tech Stack

### Backend (.NET)
* **Minimal API**: High-performance, lightweight routing.
* **Entity Framework Core**: ORM for database communication.
* **MySQL**: Relational database for persistent data.
* **JWT Bearer**: Standardized token-based security.

### Frontend (React)
* **Hooks & State**: Efficient UI management with `useState` and `useEffect`.
* **React Router**: Smooth navigation between Login, Register, and Dashboard.
* **Axios**: Centralized API service with custom request/response Interceptors.

---

## 📂 Project Structure

```text
├── TodoServer/           # .NET Backend
│   ├── Models/           # Database Entities (User, TodoItem)
│   ├── Program.cs        # API Endpoints & Auth Config
│   └── appsettings.json  # Database Connection String
├── TodoClient/           # React Frontend
│   ├── src/
│   │   ├── service.js    # Axios API Service & Interceptors
│   │   ├── login.jsx     # Authentication Logic
│   │   └── toDoList.jsx  # Task Management UI
└── README.md

---

## ⚙️ Quick Setup

### 1. Database Configuration

1. Create a MySQL database named `todo_db`.
2. Update the connection string in `TodoServer/appsettings.json`.

### 2. Run the Backend

```bash
cd TodoServer
dotnet run

```

*Server runs at `http://localhost:5086*`

### 3. Run the Frontend

```bash
cd TodoClient
npm install
npm start

```

*App runs at `http://localhost:3000*`

---

## 🛡 Security Flow

The application uses **Axios Interceptors** to automatically attach the JWT token to every request. If a request returns a `401 Unauthorized` status (due to token expiration), the system automatically clears local storage and redirects the user to the login page to ensure data safety.

---

## 📝 License

This project is open-source and available under the MIT License.

```
