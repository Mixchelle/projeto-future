@echo off
SET CONTAINER_NAME=future_backend
SET MIGRATION_ERROR=0

echo Dropando dados antes de rodar as migrações...

REM Executa o script para apagar dados
docker exec %CONTAINER_NAME% python manage.py shell < scripts/reset_forms.py

REM Tenta rodar as migrações
docker exec %CONTAINER_NAME% python manage.py makemigrations
IF %ERRORLEVEL% NEQ 0 (
    SET MIGRATION_ERROR=1
)

docker exec %CONTAINER_NAME% python manage.py migrate
IF %ERRORLEVEL% NEQ 0 (
    SET MIGRATION_ERROR=1
)

IF %MIGRATION_ERROR% EQU 1 (
    echo Houve um erro nas migrations. Removendo arquivos de migrations antigos...

    docker exec %CONTAINER_NAME% bash -c "find . -path '*/migrations/*.py' -not -name '__init__.py' -delete"
    docker exec %CONTAINER_NAME% bash -c "find . -path '*/migrations/*.pyc' -delete"

    echo Tentando recriar as migrations...
    docker exec %CONTAINER_NAME% python manage.py makemigrations
    docker exec %CONTAINER_NAME% python manage.py migrate
)

REM Rodando seeders
docker exec %CONTAINER_NAME% python manage.py seeder_form
docker exec %CONTAINER_NAME% python manage.py seeder_user
docker exec %CONTAINER_NAME% python manage.py seed_formularios_respondidos

echo Migrações concluídas!
