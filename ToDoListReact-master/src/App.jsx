import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import TodoList from './toDoList';
import Register from './Register';

function App() {
  // נשתמש ב-State כדי ש-React יתרענן ברגע שהסטטוס משתנה
  const [user, setUser] = useState(localStorage.getItem("accessToken"));

  // פונקציה שתופעל אחרי לוגין מוצלח
  const handleLogin = () => {
    setUser(localStorage.getItem("accessToken"));
  };

  return (
    <Router>
      <Routes>
        {/* אנחנו מעבירים ל-Login את הפונקציה handleLogin כדי שיעדכן אותנו כשסיים */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={user ? <TodoList /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;