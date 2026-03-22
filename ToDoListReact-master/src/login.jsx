import React, { useState } from 'react';
import service from './service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(''); // מאפסים הודעות קודמות
  
  try {
    console.log("מנסה להתחבר...");
    await service.login(username, password);
    Swal.fire({
      title: "התחברות הצליחה!",
      text: `ברוך הבא, ${username}!`,
    }); 
    console.log("התחברות הצליחה, מעדכן סטייט ומנווט...");
    onLogin(); 
    navigate('/'); 
  } catch (err) {
    console.error("שגיאה בתהליך ההתחברות:", err);
    
    // כאן התיקון הקטן - וודאי שהשגיאה לא גורמת לריענון
    setError('שם משתמש או סיסמה שגויים');
  }
};

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="שם משתמש" 
          onChange={e => setUsername(e.target.value)} 
          style={inputStyle}
        />
        <input 
          type="password" placeholder="סיסמה" 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>כניסה</button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />

      <p>עוד לא רשום?</p>
      <button 
        onClick={() => navigate('/register')} 
        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
      >
        צור חשבון חדש
      </button>
    </div>
  );
}

// עיצוב בסיסי כדי שזה יראה טוב
const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '5px' };

export default Login;