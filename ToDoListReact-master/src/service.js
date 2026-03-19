import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // ודאי שהרצת npm install jwt-decode

axios.defaults.baseURL = "https://todolist-ikez.onrender.com";

// 1. Interceptor שמוסיף את הטוקן לכל בקשה שיוצאת לשרת
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Interceptor שתופס שגיאות (כמו 401 - לא מחובר)
axios.interceptors.response.use(
  response => response,
  error => {
    // הדפסה ל-Console כדי שנראה בדיוק מה קורה בזמן השגיאה
    console.log("Error status:", error.response?.status);
    console.log("Error URL:", error.config?.url);

    // תנאי חכם: רק אם זה 401 וזה *לא* ניסיון התחברות
    const isLoginPath = error.config?.url?.endsWith("/login");
    
    if (error.response?.status === 401 && !isLoginPath) {
        console.log("Redirecting to login because token expired...");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login: async (username, password) => {
    const result = await axios.post("/login", { username, password });
    localStorage.setItem("accessToken", result.data.token);
    return jwtDecode(result.data.token); 
  },

  getTasks: async () => {
    const result = await axios.get("/items");
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post("/items", { name, isComplete: false });
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    const result = await axios.put(`/items/${id}`, { isComplete });
    return result.data;
  },

  deleteTask: async (id) => {
    const result = await axios.delete(`/items/${id}`);
    return result.data;
  },
  register: async (username, password) => {
  const result = await axios.post("/register", { username, password });
  return result.data;
}
};