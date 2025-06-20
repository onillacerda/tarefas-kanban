
# 🗂️ Kanban de Tarefas Compartilhadas

Projeto FullStack para gestão de tarefas de forma visual no estilo **Kanban**, permitindo que usuários adicionem, editem, excluam e movimentem tarefas entre colunas de status.

## 🚀 Tecnologias Utilizadas

### 🔥 Front-End
- Angular
- Tailwind CSS
- Dark Mode integrado
- Layout 100% responsivo

### 🛠️ Back-End
- Node.js
- Express
- MongoDB (Mongoose)

---

## ✨ Funcionalidades

- ✅ Adicionar tarefa
- ✅ Editar tarefa
- ✅ Excluir tarefa
- ✅ Visualizar tarefas em quadro **Kanban** (colunas: `Pendente`, `Em andamento`, `Concluída`)
- 🚦 Mudar o status da tarefa **arrastando entre colunas (Drag & Drop)**
- 🔍 Filtro visual por status direto no Kanban
- 🌗 Tema escuro/tema claro automático (via Tailwind)

---

## 📂 Estrutura do Projeto

```
/backend
  ├── models/
  ├── routes/
  ├── controllers/
  ├── app.js
  └── ...

/frontend
  ├── src/app/
  │   ├── components/
  │   ├── services/
  │   ├── models/
  │   ├── pages/
  │   └── ...
  └── ...
```

---

## 🔧 Instalação e Execução Local

### 🛑 Pré-requisitos
- Node.js instalado
- MongoDB rodando localmente ou na nuvem (Ex.: MongoDB Atlas)

---

### ⚙️ Backend

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `.env`:

```bash
MONGODB_URI=mongodb://localhost:27017/kanban_db
PORT=5000
```

4. Rode o servidor backend:

```bash
npm run dev
```

Servidor rodando em: **http://localhost:5000**

---

### 🎨 Frontend

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o servidor Angular:

```bash
ng serve
```

Acesse o app em: **http://localhost:4200**

---

## 📑 Documentação da API (Swagger)

O Swagger estará disponível após rodar o backend em:

```
http://localhost:5000/api-docs
```

## 🔗 Principais Rotas da API

| Método | Rota              | Descrição               |
|--------|-------------------|-------------------------|
| GET    | /api/tasks        | Listar tarefas          |
| POST   | /api/tasks        | Criar tarefa            |
| GET    | /api/tasks/:id    | Buscar tarefa por ID    |
| PUT    | /api/tasks/:id    | Atualizar tarefa        |
| DELETE | /api/tasks/:id    | Excluir tarefa          |

---

## 🖼️ Prints do Projeto

| Dark Mode | Kanban |
|------------|--------|
| ![Dark Mode](./screenshots/dark-mode.png) | ![Kanban](./screenshots/kanban.png) |

---

## 💡 Melhorias Futuras

- 🔐 Sistema de autenticação (login e cadastro)
- 📅 Filtro por data
- 🔔 Notificações push ou e-mail
- 📊 Dashboard com estatísticas

---

## 👨‍💻 Desenvolvedor

Feito com 💙 por **Nilson Lacerda**  
🔗 [LinkedIn](https://www.linkedin.com/in/onillacerda) | 📧 [onillacerda](mailto:onillacerda@gmail.com)
