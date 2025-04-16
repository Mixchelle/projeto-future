# Usar a imagem oficial do Python
FROM python:3.11

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos de requisitos
COPY ../backend/requirements.txt /app/requirements.txt

# Instalar dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o código do backend para dentro do container
COPY ../backend /app

# Expor a porta padrão do Django
EXPOSE 8000

# Comando para rodar a aplicação
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
