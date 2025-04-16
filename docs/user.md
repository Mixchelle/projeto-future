# 👥 Usuários de Teste - Ambiente de Desenvolvimento

Este script (`seeder`) cria automaticamente usuários de teste para facilitar os testes no ambiente local. Todos os usuários já estão cadastrados com os dados abaixo:

---

### 🔐 **Superusuário**
- **Email**: `dev@test.com`  
- **Senha**: `dev12345`  
- **Username**: `admin`  
- **Nome**: `Desenvolvedor Admin`  
- **Role**: `gestor`  
- **Permissões**: Acesso total (admin, staff, superuser)

---

### 👤 **Cliente**
- **Email**: `cliente@example.com`  
- **Senha**: `123456`  
- **Username**: `cliente_user`  
- **Nome**: `Cliente Exemplo`  
- **Role**: `cliente`  

---

### 👤 **Subcliente**
- **Email**: `subcliente@example.com`  
- **Senha**: `123456`  
- **Username**: `subcliente_user`  
- **Nome**: `Subcliente Exemplo`  
- **Role**: `subcliente`  
- **Vinculado ao cliente**: `cliente@example.com`

---

### 🧑‍💼 **Funcionário**
- **Email**: `funcionario@example.com`  
- **Senha**: `123456`  
- **Username**: `funcionario_user`  
- **Nome**: `Funcionário Exemplo`  
- **Role**: `funcionario`  
- **Permissões**: Staff

---

### 🧑‍💼 **Gestor**
- **Email**: `gestor@example.com`  
- **Senha**: `123456`  
- **Username**: `gestor_user`  
- **Nome**: `Gestor Exemplo`  
- **Role**: `gestor`  
- **Permissões**: Staff

---

### 📌 Observações
- Os usuários são criados apenas se ainda não existirem no banco.
- Todos os usuários, exceto o superusuário, têm permissões restritas de acordo com seu papel.
- As senhas são simples por se tratar de ambiente de desenvolvimento. **Não usar essas credenciais em produção.**

