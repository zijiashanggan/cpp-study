@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   正在启动 C++ 本地判题服务（只监听 127.0.0.1，关掉窗口就停）
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0lab-server.ps1"
echo.
echo   服务已退出。按任意键关闭窗口。
pause >nul
