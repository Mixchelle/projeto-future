#!/bin/bash

echo "Dropando Formulario, Categoria e Pergunta antes de rodar as migrações..."

# Define o nome do container
CONTAINER_NAME="future_backend_prod"

# Aguarda até que o container esteja rodando (máx. 30s)
contador=0
while ! docker ps | grep -i "$CONTAINER_NAME" > /dev/null; do
    contador=$((contador + 5))
    if [ "$contador" -ge 30 ]; then
        echo "Erro: O container $CONTAINER_NAME não iniciou a tempo."
        exit 1
    fi
    echo "Aguardando o container iniciar..."
    sleep 5
done

# Remove todos os registros das tabelas antes de rodar as migrações
docker exec "$CONTAINER_NAME" python manage.py shell <<EOF
from core.models import Formulario, Categoria, Pergunta
print("Apagando todas as perguntas...")
Pergunta.objects.all().delete()
print("Apagando todas as categorias...")
Categoria.objects.all().delete()
print("Apagando todos os formulários...")
Formulario.objects.all().delete()
EOF

echo "Tabelas limpas com sucesso!"

# Executa as migrations para todos os apps
docker exec "$CONTAINER_NAME" python manage.py makemigrations
docker exec "$CONTAINER_NAME" python manage.py migrate

# Roda o seeder do formulário
docker exec "$CONTAINER_NAME" python manage.py seeder_form


# Roda o seeder de usuários
docker exec "$CONTAINER_NAME" python manage.py seeder_user

echo "Migrações concluídas!"
