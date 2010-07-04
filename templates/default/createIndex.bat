@echo off
FOR /F "tokens=*" %%i in ('cd') do SET batchDir=%%i
cd %batchDir%
del test.html
C:\php\php.exe %batchDir%\index.php >> test.html

