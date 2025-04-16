@echo off
echo Aplicando migrações no Django...

:: Define o nome do container
set CONTAINER_NAME=future_backend

:: Aguarda até que o container esteja rodando (máx. 30s)
set /a contador=0
:esperar_container
docker ps | findstr /i %CONTAINER_NAME% >nul
if %errorlevel% neq 0 (
    set /a contador+=5
    if %contador% geq 30 (
        echo Erro: O container %CONTAINER_NAME% não iniciou a tempo.
        exit /b 1
    )
    echo Aguardando o container iniciar...
    timeout /t 5 /nobreak >nul
    goto esperar_container
)

:: Executa as migrations para todos os apps
docker exec %CONTAINER_NAME% python manage.py makemigrations
docker exec %CONTAINER_NAME% python manage.py migrate

:: Roda o seeder do formulário
docker exec %CONTAINER_NAME% python manage.py seeder_form

:: Roda o seeder de usuários
docker exec %CONTAINER_NAME% python manage.py seeder_user


echo Migrações concluídas!
