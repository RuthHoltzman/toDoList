import React, { useEffect, useState } from 'react';
import service from './service';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // פונקציה לטעינת משימות
  async function getTodos() {
    try {
      const todos = await service.getTasks();
      setTodos(todos);
    } catch (error) {
      console.error("נכשלה טעינת המשימות:", error);
    } 
  }

  // פונקציה ליצירת משימה
  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setIsLoading(true);
    try {
      await service.addTask(newTodo);
      setNewTodo("");
      setIsLoading(false); // מכבים לפני ה-alert

      await swal.fire({
        title: "המשימה נוצרה!",
        text: `המשימה "${newTodo}" נוצרה בהצלחה.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      await getTodos();
    } catch (error) {
      setIsLoading(false);
      swal.fire("שגיאה", "לא הצלחנו ליצור את המשימה", "error");
    }
  }

  // פונקציה לעדכון מצב משימה
  async function updateCompleted(todo, isComplete) {
    setIsLoading(true);
    try {
      await service.setCompleted(todo.id, isComplete);
      setIsLoading(false);

      await swal.fire({
        title: "המשימה עודכנה!",
        text: `המשימה "${todo.name}" סומנה כ-${isComplete ? "הושלמה" : "לא הושלמה"}.`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false
      });
      await getTodos();
    } catch (error) {
      setIsLoading(false);
      swal.fire("שגיאה", "לא הצלחנו לעדכן את המשימה", "error");
    }
  }

  // פונקציה למחיקת משימה
  async function deleteTodo(id) {
    setIsLoading(true);
    try {
      await service.deleteTask(id);
      setIsLoading(false);

      await swal.fire({
        title: "המשימה נמחקה!",
        icon: 'warning',
        timer: 1200,
        showConfirmButton: false
      });
      await getTodos();
    } catch (error) {
      setIsLoading(false);
      swal.fire("שגיאה", "לא הצלחנו למחוק את המשימה", "error");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
    window.location.reload();
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      {/* שכבת טעינה גלובלית */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p style={{ marginTop: '10px', color: '#af2f2f' }}>מעדכן את הרשימה...</p>
        </div>
      )}

      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button 
          onClick={handleLogout} 
          className="logout-button"
          disabled={isLoading}
        >
          Logout →
        </button>
      </div>

      <section className="todoapp" style={{ opacity: isLoading ? 0.6 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
        <header className="header">
          <h1>המשימות שלי</h1>
          <form onSubmit={createTodo}>
            <input 
              className="new-todo" 
              placeholder="Well, let's take on the day" 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
              disabled={isLoading}
            />
          </form>
        </header>
        
        <section className="main" style={{ display: "block" }}>
          <ul className="todo-list">
            {todos.map(todo => (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input 
                    className="toggle" 
                    type="checkbox" 
                    checked={todo.isComplete} 
                    onChange={(e) => updateCompleted(todo, e.target.checked)} 
                  />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <style>{`
        /* אנימציית טעינה */
        .loader-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255, 255, 255, 0.7);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          z-index: 9999;
        }
        .spinner {
          width: 45px; height: 45px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #af2f2f;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .logout-button {
          padding: 8px 15px;
          background: rgba(175, 47, 47, 0.1);
          border: 1px solid rgba(175, 47, 47, 0.2);
          color: #af2f2f;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .logout-button:hover {
          background: rgba(175, 47, 47, 0.2);
        }
        .logout-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}

export default TodoList;