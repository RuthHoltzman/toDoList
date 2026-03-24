import React, { useState } from 'react';
import service from './service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // סטייט לטעינה
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true); // הפעלת הטעינה
    
    try {
      console.log("מנסה להתחבר...");
      await service.login(username, password);
      
      Swal.fire({
        title: "התחברות הצליחה!",
        text: `ברוך הבא, ${username}!`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      }); 

      onLogin(); 
      navigate('/'); 
    } catch (err) {
      console.error("שגיאה בתהליך ההתחברות:", err);
      setError('שם משתמש או סיסמה שגויים');
    } finally {
      setIsLoading(false); // כיבוי הטעינה (גם אם הצליח וגם אם נכשל)
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
      
      {/* שכבת טעינה שמופיעה רק כשמחכים לשרת */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p style={{ marginTop: '10px', color: '#007bff' }}>מתחבר לשרת, מיד מסיימים...</p>
        </div>
      )}

      <h2>התחברות</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="שם משתמש" 
          onChange={e => setUsername(e.target.value)} 
          style={inputStyle}
          disabled={isLoading} // מונע שינוי בזמן טעינה
        />
        <input 
          type="password" placeholder="סיסמה" 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={{ ...buttonStyle, opacity: isLoading ? 0.6 : 1 }} 
          disabled={isLoading}
        >
          {isLoading ? 'מתחבר...' : 'כניסה'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <hr style={{ margin: '20px 0' }} />

      <p>עוד לא רשום?</p>
      <button 
        onClick={() => navigate('/register')} 
        style={{ ...buttonStyle, backgroundColor: '#6c757d' }}
        disabled={isLoading}
      >
        צור חשבון חדש
      </button>

      {/* CSS לאנימציית הטעינה */}
      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255, 255, 255, 0.9);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          z-index: 9999;
        }
        .spinner {
          width: 40px; height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '5px' };

export default Login;