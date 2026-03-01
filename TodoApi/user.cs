namespace TodoApi;

public class User
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string Password { get; set; } // הערה: בפרויקט אמיתי מצפינים סיסמה, כרגע נשמור כטקסט פשוט ללימוד
}