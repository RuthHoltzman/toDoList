import React, { useState } from 'react';
import service from './service';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await service.register(username, password);
      alert("נרשמת בהצלחה! עכשיו אפשר להתחבר.");
      navigate('/login'); // אחרי הרשמה עוברים להתחברות
    } catch (err) {
      setError('שגיאה בהרשמה. אולי שם המשתמש כבר תפוס?');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto', textAlign: 'center' }}>
      <h2>הרשמה למערכת</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="בחר שם משתמש" onChange={e => setUsername(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="בחר סיסמה" onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button type="submit" style={buttonStyle}>הירשם</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link></p>
    </div>
  );
}

const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px' };
const buttonStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '5px' };

export default Register;