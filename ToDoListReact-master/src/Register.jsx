import React, { useState } from 'react';
import service from './service';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // סטייט לניהול מצב הטעינה
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // הפעלת הסביבון ברגע הלחיצה

    try {
      // שליחת הבקשה לשרת
      await service.register(username, password);
      
      // ברגע שחזרה תשובה חיובית, נכבה את הטעינה לפני שמציגים את ההודעה
      setIsLoading(false); 

      await Swal.fire({
        title: "ההרשמה הצליחה!",
        text: `המשתמש ${username} נרשם בהצלחה. כעת תוכל להתחבר למערכת.`,
        icon: 'success',
        confirmButtonText: 'מעבר להתחברות',
        confirmButtonColor: '#007bff'
      });
      
      // ניווט לדף הלוגין רק אחרי שהמשתמש אישר את ההודעה
      navigate('/login'); 

    } catch (err) {
      console.error("שגיאה בתהליך ההרשמה:", err);
      setIsLoading(false); // כיבוי הטעינה כדי שהמשתמש יוכל לראות את השגיאה ולתקן
      setError('שגיאה בהרשמה. ייתכן ששם המשתמש כבר קיים במערכת.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
      
      {/* שכבת ה-Loader שמופיעה בזמן הרישום */}
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p style={{ marginTop: '15px', color: '#007bff', fontWeight: 'bold' }}>
            יוצר חשבון חדש...
          </p>
        </div>
      )}

      <h2>הרשמה למערכת</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="בחר שם משתמש" 
          onChange={e => setUsername(e.target.value)} 
          style={inputStyle} 
          disabled={isLoading} // חסימת הקלט בזמן טעינה
          required
        />
        <input 
          type="password" 
          placeholder="בחר סיסמה" 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle} 
          disabled={isLoading}
          required
        />
        <button 
          type="submit" 
          style={{ 
            ...buttonStyle, 
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }} 
          disabled={isLoading}
        >
          {isLoading ? 'בתהליך רישום...' : 'הירשם עכשיו'}
        </button>
      </form>

      {error && <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</p>}
      
      <p style={{ marginTop: '15px' }}>
        כבר יש לך חשבון? <Link to="/login" style={{ color: '#007bff', pointerEvents: isLoading ? 'none' : 'auto' }}>התחבר כאן</Link>
      </p>

      {/* עיצוב CSS פנימי עבור ה-Loader והאנימציה */}
      <style>{`
        .loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 6px solid #f3f3f3;
          border-top: 6px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        input:disabled {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}

// אובייקטי עיצוב בסיסיים
const inputStyle = { 
  display: 'block', 
  marginBottom: '15px', 
  width: '100%', 
  padding: '10px', 
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const buttonStyle = { 
  width: '100%', 
  padding: '12px', 
  color: 'white', 
  border: 'none', 
  borderRadius: '4px',
  fontSize: '16px',
  transition: 'background-color 0.3s'
};

export default Register;