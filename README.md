# 📡 IdeiA de Sabor - API (Back-end)

Este repositório contém o servidor e a lógica de negócio do **IdeiA de Sabor**. Desenvolvido inteiramente para fins de estudo, este projeto foi o meu laboratório prático para dominar o ecossistema Node.js, focando em segurança, arquitetura RESTful e modelagem avançada de dados NoSQL.

🚀 **Interface do projeto:** [ideias-de-sabor.netlify.app](https://ideias-de-sabor.netlify.app)
🔗 **Repositório Front-end:** [front-app-receitas](https://github.com/marceloguima/front-app-receitas)

---

## 🛠️ O que aprendi nesta API?

Construir este back-end foi fundamental para consolidar conceitos avançados de desenvolvimento:

- **Modelagem de Dados Avançada:** Criação de esquemas complexos no MongoDB utilizando Mongoose, gerenciando desde strings simples até arrays dinâmicos (lista de ingredientes) e validações estritas com `enum` (nível de complexidade).
- **Controle de Acesso (RBAC):** Criação de rotas protegidas e ocultas baseadas no nível de privilégio. Apenas usuários Administradores têm permissão para acessar o painel de inserção e abastecer o acervo oficial de receitas da plataforma.
- **Integração de Mídias (Cloudinary):** A API foi otimizada para receber e persistir URLs seguras de imagens processadas no front-end, aliviando a carga do servidor.
- **Segurança e Autenticação:** Gestão de utilizadores com encriptação de senhas (Hashes) e fluxos de recuperação de conta utilizando tokens criptográficos temporários.
- **Comunicação Transacional:** Integração com o **Nodemailer** para disparo de e-mails reais.

---

## 📡 Principais Endpoints (API)

Abaixo, os caminhos base da aplicação (prefixo `/api`):

### Autenticação e Utilizadores
- `POST /usuarios/cadastro`: Registo de novos utilizadores com validação de duplicidade.
- `POST /usuarios/login`: Autenticação e criação de sessão.
- `POST /usuarios/recuperar-conta`: Lógica de geração de token e envio de e-mail de recuperação.
- `PUT /usuarios/redefinir-senha`: Validação de token de segurança e atualização da base de dados.

### Gestão de Receitas (Painel Admin)
A área de gestão de receitas está em desenvolvimento contínuo (Roadmap). No momento, o foco principal está na robustez do cadastro:

- `POST /receitas`: Rota protegida (Admin) para cadastro de novas receitas. Recebe e valida dados complexos (arrays de ingredientes) e a URL da imagem.
- `GET /receitas`: Listagem das receitas *(Em implementação 🚧)*.
- `PUT /receitas/:id`: Atualização de dados de uma receita *(Em breve 🚧)*.
- `DELETE /receitas/:id`: Exclusão de uma receita da plataforma *(Em breve 🚧)*.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js & Express:** Ambiente de execução e framework para a construção da API REST.
* **MongoDB & Mongoose:** Base de dados NoSQL e ODM para modelagem de esquemas estruturados.
* **Nodemailer:** Serviço de envio de e-mails transacionais (Recuperação de Senha).
* **Crypto:** Biblioteca nativa para geração de tokens seguros.
* **CORS:** Configuração de políticas de segurança para acesso exclusivo do Front-end.

---

## ⚙️ Como Rodar Localmente

⚠️ **Nota Importante:** Esta API utiliza o MongoDB. Certifique-se de ter uma instância (local ou MongoDB Atlas) configurada.

**1. Clone o repositório:**
```bash
git clone [https://github.com/marceloguima/servidor-app-receitas.git](https://github.com/marceloguima/servidor-app-receitas.git)
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` na raiz do projeto e preencha com as suas credenciais baseando-se neste formato:
```env
PORT=3001
GEMINI_KEY=sua_chave_api_do_google_ai_studio_aqui
MONGO_URI=seu_link_de_conexao_do_mongodb
MAILTRAP_USER=seu_usuario_mailtrap
MAILTRAP_PASS=sua_senha_mailtrap
FRONTEND_URL=http://localhost:5173
```

**4. Inicie o servidor:**
```bash
npm run dev
```
O servidor estará rodando e escutando as requisições em `http://localhost:3001/api`.