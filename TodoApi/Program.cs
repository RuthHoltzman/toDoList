using TodoApi;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
var key = Encoding.ASCII.GetBytes("YourSuperSecretKeyThatIsAtLeast32CharsLong!");


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ToDoDbContext>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
        ,ClockSkew = TimeSpan.Zero // מבטל את ה-5 דקות הנוספות
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();
app.UseCors("AllowAll");
app.UseAuthentication(); // מי את?
app.UseAuthorization();  // מה מותר לך לעשות?


// נתיבים שדורשים אימות
// כל הנתיבים של המשימות דורשים שהמשתמש יהיה מחובר, ולכן נשתמש ב-RequireAuthorization
// בנתיבים האלו נוכל לגשת ל-ClaimsPrincipal כדי לקבל מידע על המשתמש המחובר, כמו ה-
//ID שלו, ולהשתמש בזה כדי לסנן את המשימות רק לאלו ששייכות לו
// בנתיב ה-GET, במקום להחזיר את כל המשימות, נחזיר רק את אלו ששייכות למשתמש המחובר
app.MapGet("/items", (ToDoDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst("id")?.Value);
    // סינון לפי UserId ולא לפי Id של המשימה
    return db.Items.Where(i => i.UserId == userId).ToList();
}).RequireAuthorization();


// בנתיב ה-POST, כשניצור משימה חדשה, נוודא שהמשימה מקושרת למשתמש המחובר על ידי הגדרת UserId שלה ל-ID של המשתמש
app.MapPost("/items", (Item newItem, ToDoDbContext db, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst("id")?.Value);

    newItem.UserId = userId; // שיוך המשימה למשתמש

    db.Items.Add(newItem);
    db.SaveChanges();
    return Results.Created($"/items/{newItem.Id}", newItem);
}).RequireAuthorization();

// בנתיב ה-PUT, נוודא שהמשתמש יכול לעדכן רק משימות ששייכות לו על ידי בדיקה שה-UserId של המשימה תואם ל-ID של המשתמש המחובר
app.MapPut("/items/{id}", (ToDoDbContext db, int id, Item updateData, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst("id")?.Value);

    // חיפוש משימה שה-ID שלה תואם והיא שייכת למשתמש
    var item = db.Items.FirstOrDefault(i => i.Id == id && i.UserId == userId);

    if (item is null) return Results.NotFound("Task not found or unauthorized");

    item.IsComplete = updateData.IsComplete;
    db.SaveChanges();
    return Results.NoContent();
}).RequireAuthorization();

// בנתיב ה-DELETE, נוודא שהמשתמש יכול למחוק רק משימות ששייכות לו על ידי בדיקה שה-UserId של המשימה תואם ל-ID של המשתמש המחובר
app.MapDelete("/items/{id}", (ToDoDbContext db, int id, ClaimsPrincipal user) =>
{
    var userId = int.Parse(user.FindFirst("id")?.Value);

    var item = db.Items.FirstOrDefault(i => i.Id == id && i.UserId == userId);

    if (item is null) return Results.NotFound("Task not found or unauthorized");

    db.Items.Remove(item);
    db.SaveChanges();
    return Results.Ok(new { message = "Deleted successfully", id = item.Id });
}).RequireAuthorization();

// נתיב להתחברות - Login
app.MapPost("/login", (User loginUser, ToDoDbContext db) =>
{
    // חיפוש המשתמש בבסיס הנתונים
    var user = db.Users.FirstOrDefault(u => u.Username == loginUser.Username && u.Password == loginUser.Password);

    if (user is null)
        return Results.Unauthorized();

    // יצירת הטוקן
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes("YourSuperSecretKeyThatIsAtLeast32CharsLong!");
    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(new[] { new Claim("id", user.Id.ToString()) }),
        Expires = DateTime.UtcNow.AddHours(1), // הטוקן תקף ל-1 שעה
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);

    // החזרת הטוקן לקליינט
    return Results.Ok(new { token = tokenHandler.WriteToken(token) });
});

// נתיב להרשמה - Register
app.MapPost("/register", (User newUser, ToDoDbContext db) =>
{
    if (db.Users.Any(u => u.Username == newUser.Username))
        return Results.BadRequest("User already exists");

    db.Users.Add(newUser);
    db.SaveChanges();
    return Results.Ok("User created successfully");
});

app.MapGet("/", () => "hello, it works!");
app.UseSwagger();
app.UseSwaggerUI();


app.Run();