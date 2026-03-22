import React, { useEffect, useState } from 'react';
import service from './service';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';

function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

 async function getTodos() {
  try {
    const todos = await service.getTasks();
    setTodos(todos);
  } catch (error) {
    // אם יש שגיאה (כמו 401), אנחנו לא רוצים שהאפליקציה תקרוס
    console.error("נכשלה טעינת המשימות:", error);
  }
}

  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await service.addTask(newTodo);
    setNewTodo("");
      swal.fire({title: "המשימה נוצרה!",
      text: `המשימה "${newTodo}" נוצרה בהצלחה.`,});
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    swal.fire({
      title: "המשימה עודכנה!",
      text: `המשימה "${todo.name}" סומנה כ-${isComplete ? "הושלמה" : "לא הושלמה"}.`,  });
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    swal.fire({
      title: "המשימה נמחקה!",
      text: `המשימה עם מזהה ${id} נמחקה בהצלחה.`,});
    await getTodos();
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
      {/* כפתור יציאה מעוצב מחוץ ל-section הראשי כדי שלא יזוז עם הרשימה */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout →
        </button>
      </div>

      <section className="todoapp">
        <header className="header">
          <h1>המשימות שלי</h1>
          <form onSubmit={createTodo}>
            <input 
              className="new-todo" 
              placeholder="Well, let's take on the day" 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
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

      {/* הוספת CSS ישירות כאן כדי שלא תצטרכי לחפש קבצים אחרים */}
      <style>{`
        .logout-button {
          padding: 8px 15px;
          background: rgba(175, 47, 47, 0.1);
          border: 1px solid rgba(175, 47, 47, 0.2);
          color: #af2f2f;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .logout-button:hover {
          background: rgba(175, 47, 47, 0.2);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
}

export default TodoList;