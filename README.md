# 2024_2_Future_Projeto_Avaliacao_Maturidade_Seguranca_PPSI

<p align="center">
  <img src="https://github.com/user-attachments/assets/efaea5cf-122e-4625-8c37-c25d2a923c30" alt="image" width="500">
</p>

🚀 Este projeto visa avaliar a maturidade de segurança do sistema PPSI, implementando melhores práticas e técnicas de segurança em diferentes camadas do sistema. O projeto será dividido em duas partes principais: o **frontend** e o **backend**. A arquitetura do projeto seguirá uma estrutura modular e escalável, visando facilitar o desenvolvimento e a manutenção contínua.

## 📂 Estrutura do Projeto

A estrutura do projeto será organizada da seguinte maneira:

```
.
│── backend/                  🖥️ Diretório do Backend (Django)
│   ├── config/               ⚙️ Configurações do Django (settings, urls, wsgi, asgi)
│   ├── core/                 🔑 Aplicação principal com autenticação e permissões
│   ├── assessments/          📊 Módulo de avaliação de maturidade
│   ├── reports/              📄 Módulo de geração de relatórios
│   ├── compliance/           ✅ Módulo de conformidade e normas (NIST, ISO, LGPD, etc.)
│   ├── users/                👥 Gerenciamento de usuários e permissões
│   ├── api/                  🌐 Definição das APIs REST usando Django Rest Framework
│   ├── tests/                🧪 Testes unitários e de integração
│   ├── manage.py             🛠️ Arquivo de gerenciamento do Django
│   ├── requirements.txt      📦 Dependências do backend
│   ├── .env                  🔒 Variáveis de ambiente (Banco, API Keys, JWT Secret)
├── app-frontend
│   └── README.md              # 📄 Documentação do frontend (ainda será feita)
├── database
│   ├── migrations             # 🗃️ Scripts de migração do banco de dados (ainda serão criados)
│   └── seed_data.py           # 🌱 Dados iniciais para a base de dados (ainda será definido)
├── docs
│   ├── API_Documentation.md   # 📑 Documentação da API (ainda será feita)
│   ├── Compliance_Guide.md    # ✅ Guia de conformidade (ainda será feito)
│   └── System_Architecture.md # 🏗️ Arquitetura do sistema (ainda será definida)
├── infra
│   ├── docker                 # 🐳 Configurações Docker (ainda serão feitas)
│   ├── nginx                  # 🌐 Configuração do servidor Nginx (ainda será feita)
│   └── scripts                # ⚙️ Scripts de infraestrutura (ainda serão criados)
├── README.md                  # 📖 Documentação principal do projeto
└── tests
    ├── frontend_tests         # 🧪 Testes para o frontend (ainda serão definidos)
    └── security_tests         # 🔒 Testes de segurança (ainda serão definidos)
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

## 🚧 Progresso do Projeto

O projeto ainda não foi iniciado. As funcionalidades, documentação e implementação serão desenvolvidas ao longo do tempo com base nos requisitos de segurança e escalabilidade.

## ▶️ Como rodar o projeto

📌 Ainda não há um projeto para rodar. Assim que o desenvolvimento iniciar, esta seção será atualizada com instruções para rodar o backend e o frontend.

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

## 👨‍💻 Equipe de Desenvolvimento

- 🏅 **[@gabiiwa](https://github.com/gabiiwa)** - Gabriele Iwashima (Instrutora)
- 👩‍💻 **[@Mixchelle](https://github.com/Mixchelle)** - Michelle Marquez
- 👨‍💻 **[@marcelowkr2](https://github.com/marcelowkr2)** - Marcelo Pires de Oliveira
- 👨‍💻 **[@Nakamura1997](https://github.com/Nakamura1997)** - João Victor Oliveira Nakamura
- 👨‍💻 **[@coder-marllon](https://github.com/coder-marllon)** - Marllon Lima
- 👩‍💻 **[@IanaCastellain](https://github.com/IanaCastellain)** - Iana Castellain
# projeto-future
