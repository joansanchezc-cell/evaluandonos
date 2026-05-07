@echo off
echo Subiendo Evaluandonos a Vercel...
cd /d "C:\Users\ANDRESAN\Desktop\Evaluandonos"
call npx vercel --prod --force || vercel --prod --force
echo.
echo Proceso terminado.
pause
