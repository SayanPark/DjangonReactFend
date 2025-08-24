@echo off
REM This script builds the frontend for production and deploys it to Liara on Windows

REM Navigate to the frontend directory
cd frontend

REM Build the frontend in production mode
npm run build -- --mode production

REM Navigate back to root directory
cd ..

REM Deploy to Liara
npx liara deploy --app shahrezananekarafarin --port 5173 --platform static --path frontend/dist --build-location iran
