# 2024_2_Future_Projeto_Avaliacao_Maturidade_Seguranca_PPSI

<p align="center">
  <img src="https://github.com/user-attachments/assets/efaea5cf-122e-4625-8c37-c25d2a923c30" alt="image" width="500">
</p>

🚀 Este projeto visa avaliar a maturidade de segurança do sistema PPSI, implementando melhores práticas e técnicas de segurança em diferentes camadas do sistema. O projeto será dividido em duas partes principais: o **frontend** e o **backend**. A arquitetura do projeto seguirá uma estrutura modular e escalável, visando facilitar o desenvolvimento e a manutenção contínua.

## 📂 Estrutura do Projeto

A estrutura do projeto será organizada da seguinte maneira:

```
.
├── app-frontend/          🌐 Next.js Application
│   ├── Dockerfile        🐳 Configuração Docker Dev
│   ├── Dockerfile.prod   🏭 Configuração Docker Produção
│   ├── nginx/           🔧 Configuração Nginx
│   ├── src/             💻 Código Fonte
│   │   ├── app/         🚪 Rotas da Aplicação
│   │   │   ├── analista/ 👩‍💻 Painel Analista
│   │   │   ├── cliente/  👤 Área Cliente
│   │   │   ├── gestor/   👔 Dashboard Gerencial
│   │   │   └── login/    🔐 Autenticação
│   │   ├── components/  🧩 Componentes UI
│   │   ├── hooks/       🎣 Custom Hooks
│   │   ├── state/       🧠 Gerenciamento de Estado
│   │   └── styles/      🎨 Estilos CSS
│   └── test/           🧪 Testes Frontend
│ 
│ 
│ 
├── backend/             🖥️ Django Application
│   ├── api/            🌐 Endpoints API
│   ├── assessments/    📊 Módulo Avaliações
│   ├── compliance/     ✅ Conformidade
│   ├── config/        ⚙️ Configurações
│   ├── core/          🔑 Núcleo do Sistema
│   ├── database/      🗃️ Migrações
│   ├── form/          📝 Formulários
│   ├── maturity_assessment/  📈 Cálculo Maturidade
│   ├── recomendacoes/ 💡 Sistema de Recomendações
│   ├── tests/         🧪 Testes Backend
│   └── users/         👥 Gerenciamento de Usuários
│ 
│ 
├── docker-compose.yml  🐳 Configuração Docker
├── docker-compose.prod.yml 🏭 Docker Produção
│ 
│ 
├── docs/               📚 Documentação
│   ├── API_Documentation.md 📑 API Docs
│   ├── Compliance_Guide.md ✅ Guia Conformidade
│   └── System_Architecture.md 🏗️ Arquitetura
│ │
│ 
└── tests/              🧪 Testes
    ├── frontend_tests/ 🖥️ Testes Frontend
    └── security_tests/ 🔒 Testes Segurança
```

### 1️⃣ Principais Módulos

- Autenticação & Controle de Acesso (usuários, permissões e logs de auditoria)
- Módulo de Questionários (formulários eletrônicos com perguntas baseadas no PPSI, NIST, ISO)
- Engine de Avaliação de Maturidade (processamento das respostas e cálculo dos níveis 1-5)
- Geração de Relatórios (visões executiva e operacional, exportação para PDF/Excel)
- Dashboard Interativo (KPIs, gráficos, análises comparativas)
- Compliance & Segurança (garantindo LGPD, GDPR, ISO 27001)
- Integração com Ferramentas de BI (para análises mais avançadas)<br><br>



## 🔄 Fluxo de Desenvolvimento

O projeto seguirá um fluxo de trabalho baseado em **GitFlow** para garantir que as funcionalidades sejam desenvolvidas e testadas de forma organizada e controlada. O fluxo de branches será o seguinte:

- **Branch `desenvolvimento`**: Esta será a principal branch de desenvolvimento. Todas as novas funcionalidades e correções serão feitas aqui. Durante cada _sprint_, a branch `desenvolvimento` será revisada e testada.
- **Branch `main`**: Apenas funcionalidades finalizadas e testadas serão adicionadas à branch `main`. A cada revisão de sprint, as mudanças aprovadas na branch `desenvolvimento` serão mescladas na `main`.




### 👥 Como contribuir

1. **Criar uma branch de desenvolvimento**: Inicie um novo recurso ou correção a partir da branch `desenvolvimento`.
2. **Realizar commit das mudanças**: Commite as alterações relacionadas à tarefa em andamento.
3. **Revisão de sprint**: Ao final de cada sprint, as funcionalidades testadas serão revisadas e integradas à branch `main`.


---

## ▶️ Como rodar o projeto

📦 Requisitos
Docker e Docker Compose instalados

Node.js (para desenvolvimento local sem Docker - opcional)

Python 3.11+ e pip (caso deseje rodar o backend localmente sem Docker)

Claro! Aqui está uma sugestão para a seção **▶️ Como rodar o projeto** do seu `README.md`, explicando como usar os scripts:

---


Este projeto utiliza Docker para facilitar o ambiente de desenvolvimento e execução. Abaixo estão os scripts disponíveis e suas respectivas funções:

### 🔧 Primeira vez rodando o projeto (modo desenvolvimento)

Este comando sobe os containers e executa as migrações, populando o banco com as questões do formulário:

```bash
npm run dev
```

### 🚀 Subir o projeto (sem rebuild)

Se os containers já foram construídos anteriormente e você só quer iniciá-los novamente:

```bash
npm run start
```

### 🛑 Parar os containers

Para derrubar todos os containers Docker do projeto:

```bash
npm run stop
```

### 🌐 Rodar somente o frontend em modo de desenvolvimento

Este comando entra na pasta do frontend, instala as dependências e inicia o servidor local (Vite, Next, etc.):

```bash
npm run frontend:dev
```

### ⚙️ Rodar somente o backend em modo de desenvolvimento

Este comando cria um ambiente virtual Python, instala os pacotes e inicia o servidor Django:

```bash
npm run backend:dev
```

> **Obs:** Em sistemas Unix/Linux ou com Git Bash, altere a ativação do ambiente virtual para:
> ```bash
> source .venv/bin/activate
> ```

### 🏗️ Rebuildar os containers

Se houver alterações no Dockerfile ou nas dependências, você pode reconstruir os containers com:

```bash
npm run build
```

### 🧩 Rodar as migrações

Para popular o banco de dados com as questões do formulário manualmente (sem subir os containers):

```bash
npm run migrations
```

### 📦 Rodar em produção

Este comando sobe os containers usando o arquivo `docker-compose.prod.yml` e roda as migrações:

```
npm run prod
```

---




## 🚧 Progresso do Projeto

Atualmente, o projeto já possui:



✅ Sistema de login e autenticação, garantindo que apenas usuários autorizados tenham acesso aos módulos apropriados.

![image](https://github.com/user-attachments/assets/94cc4042-45bd-4c8a-8c6f-cc219a49d066)


✅ Tela do cliente, com os formulários interativos para preenchimento das respostas relacionadas à avaliação de maturidade de segurança.


![image](https://github.com/user-attachments/assets/69f13022-6de0-406f-b372-cb8224ab0354)


✅ Tela do analista, com interface para analisar as respostas dos clientes, revisar e aprovar avaliações.


![image](https://github.com/user-attachments/assets/b6b26070-11da-4afa-969a-53d545e73d76)
![image](https://github.com/user-attachments/assets/0624e5ef-99cb-4f06-9a84-c024694daba3)



🛠️ As demais funcionalidades (como dashboard gerencial, engine de cálculo de maturidade, geração de relatórios e integração com BI) ainda estão em fase de planejamento e serão implementadas nas próximas sprints.





## 🧪 Testes

### 🔍 Testes unitários e de integração.

A aplicação possui um conjunto robusto de testes automatizados, garantindo a funcionalidade, segurança e integridade do sistema. Os testes cobrem áreas como autenticação, permissões, segurança contra vulnerabilidades e comportamento esperado das views e modelos.

### 🧪 Tipos de Testes

### 1. Testes de Permissões (test_permissions.py)

✅ Valida o acesso a rotas protegidas.

✅ Garante que usuários sem permissão recebem o status 403 (Proibido) e que administradores têm acesso às rotas protegidas.

### 2. Testes de Modelos (test_models.py)

✅ Verifica se os modelos de banco de dados são criados e funcionam conforme esperado, incluindo atributos como texto, categorias e peso.

### 3. Testes de Criptografia (test_encryption.py)

✅ Testa a criptografia e descriptografia de dados sensíveis, assegurando que as informações sejam protegidas durante o processamento.

### 4. Testes de CSRF (test_csrf.py)

✅ Garante a proteção contra ataques CSRF.

✅Verifica se tokens CSRF são validados corretamente e se requisições sem tokens válidos são bloqueadas (403).

### 5. Testes de Autenticação (test_authentication.py)

✅ Testa o fluxo de login e logout.

✅ Garante mensagens adequadas para sucessos e falhas de login.

### 6. Testes de Limitação de Taxa (test_rate_limiting.py)

✅ Verifica a proteção contra acessos excessivos, retornando o status 429 (Muitas Requisições) após exceder o limite de tentativas.

### 7. Testes de Cabeçalhos de Segurança (test_security_headers.py)

✅ Valida a presença de cabeçalhos como:

✅ X-Frame-Options: DENY (proteção contra ataques de clickjacking).

✅ Content-Security-Policy (proteção contra XSS e outras vulnerabilidades).

### 8. Testes de Injeção SQL (test_sql_injection.py)

✅ Simula tentativas de injeção SQL e verifica se o sistema responde adequadamente sem falhas ou vazamento de dados.

### 9. Testes de Views (test_views.py)

✅ Testa as APIs REST, validando os dados retornados e o comportamento correto de endpoints como a listagem de perguntas.

### 10. Testes de XSS (test_xss.py)

✅ Simula ataques de Cross-Site Scripting e verifica se os inputs maliciosos são escapados corretamente, protegendo a aplicação.

### 🛠️ Executando os Testes

### Para rodar os testes, utilize o comando:

✅ python manage.py test backend.tests.nome do arquivo

## 📜 Documentação

Toda a documentação do projeto será armazenada no diretório `docs`. No momento, ainda está em desenvolvimento e será disponibilizada conforme o projeto avançar.

# 📘 Documentação de API com Swagger (drf-yasg)

Este projeto utiliza o **Swagger** (via `drf-yasg`) para gerar automaticamente a documentação interativa da API baseada no Django REST Framework.

---

## 🔍 O que é Swagger?

**Swagger** é uma ferramenta que permite documentar e testar APIs RESTful de forma visual e interativa.

Com ele, você pode:

- 📖 Navegar pelos endpoints disponíveis da API.
- 📦 Verificar os métodos HTTP usados (GET, POST, PUT, DELETE, etc.).
- 🧾 Entender os parâmetros esperados e as respostas retornadas.
- 🧪 Realizar testes diretamente pela interface web, sem precisar do Postman ou outras ferramentas externas.

---

## ⚙️ Como o Swagger é implementado neste projeto?

Este projeto utiliza o pacote [`drf-yasg`](https://github.com/axnsan12/drf-yasg) para gerar automaticamente a especificação OpenAPI e criar a interface interativa da documentação da API.

### Endpoints disponíveis para documentação:

- `/swagger/` → Interface Swagger UI
- `/swagger.json` → Documento OpenAPI no formato JSON
- `/swagger.yaml` → Documento OpenAPI no formato YAML
- `/redoc/` → Interface de documentação alternativa usando Redoc

---

## ✅ Vantagens de usar Swagger

- 📚 Facilita o entendimento da estrutura da API para outros desenvolvedores.
- 🧠 Ajuda na manutenção e atualização da API.
- 🔁 Garante consistência entre a implementação e a documentação.
- 🚀 Agiliza o desenvolvimento de frontends e testes de integração.

---

## ▶️ Como acessar

Após iniciar o servidor local com:

```bash
python manage.py runserver
**Acesse a documentação interativa via navegador:**
**http://localhost:8000/swagger/**
**http://localhost:8000/redoc/**

```

## 👨‍💻 Equipe de Desenvolvimento

- 🏅 **[@gabiiwa](https://github.com/gabiiwa)** - Gabriele Iwashima (Instrutora)
- 👩‍💻 **[@Mixchelle](https://github.com/Mixchelle)** - Michelle Marquez
- 👨‍💻 **[@marcelowkr2](https://github.com/marcelowkr2)** - Marcelo Pires de Oliveira
- 👨‍💻 **[@Nakamura1997](https://github.com/Nakamura1997)** - João Victor Oliveira Nakamura
- 👨‍💻 **[@coder-marllon](https://github.com/coder-marllon)** - Marllon Lima
- 👩‍💻 **[@IanaCastellain](https://github.com/IanaCastellain)** - Iana Castellain
```
