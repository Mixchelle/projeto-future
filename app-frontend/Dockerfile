# Usa a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Compila o projeto Next.js
RUN npm run build

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o frontend no modo produção
CMD ["npm", "start"]
