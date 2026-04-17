Write-Host "Starting Django Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python manage.py runserver"

Write-Host "Starting React Frontend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Both servers have been launched in new windows!" -ForegroundColor Yellow
Write-Host "Open your browser to: http://localhost:5173" -ForegroundColor Cyan
