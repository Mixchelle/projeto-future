#!/bin/bash

echo "Dropando Formulario, Categoria e Pergunta antes de rodar as migrações..."

# Define o nome do container
CONTAINER_NAME="future_backend"

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

# Apaga dados
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

echo "Executando makemigrations..."
docker exec "$CONTAINER_NAME" python manage.py makemigrations
MAKEMIGRATIONS_STATUS=$?

echo "Executando migrate..."
docker exec "$CONTAINER_NAME" python manage.py migrate
MIGRATE_STATUS=$?

# Verifica se houve erro em alguma das etapas
if [ $MAKEMIGRATIONS_STATUS -ne 0 ] || [ $MIGRATE_STATUS -ne 0 ]; then
    echo "Erro nas migrations. Removendo arquivos antigos e tentando novamente..."

    docker exec "$CONTAINER_NAME" bash -c "find . -path '*/migrations/*.py' -not -name '__init__.py' -delete"
    docker exec "$CONTAINER_NAME" bash -c "find . -path '*/migrations/*.pyc' -delete"

    echo "Recriando migrations..."
    docker exec "$CONTAINER_NAME" python manage.py makemigrations
    docker exec "$CONTAINER_NAME" python manage.py migrate
fi

# Seeders
docker exec "$CONTAINER_NAME" python manage.py seeder_form
docker exec "$CONTAINER_NAME" python manage.py seeder_user
docker exec "$CONTAINER_NAME" python manage.py seed_formularios_respondidos

echo "Migrações concluídas com sucesso!"
