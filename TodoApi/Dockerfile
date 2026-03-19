# שלב 1: בניית האפליקציה (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# העתקת קובץ הפרויקט ושחזור חבילות (Restore)
# ודאי שהקובץ TodoApi.csproj נמצא באותה תיקייה עם ה-Dockerfile
COPY *.csproj ./
RUN dotnet restore

# העתקת שאר הקבצים ובנייה (Publish)
COPY . ./
RUN dotnet publish -c Release -o out

# שלב 2: יצירת סביבת הריצה (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# הגדרת הפורט - Render משתמש בפורט 8080 כברירת מחדל ל-Docker
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# הרצת האפליקציה
ENTRYPOINT ["dotnet", "TodoApi.dll"]