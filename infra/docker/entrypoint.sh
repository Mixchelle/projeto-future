#!/bin/bash

# Rodar migrações
echo "Running migrations..."
python manage.py migrate

# Rodar seeders
echo "Running seeders..."
python manage.py seeder_form
python manage.py seeder_user

# Iniciar o servidor com gunicorn (ou qualquer outro comando que você queira executar)
echo "Starting the application..."
exec "$@"