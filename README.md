# Catálogo de Cursos EAD

Aplicação full-stack para cadastro, listagem e gerenciamento de cursos e ofertas em um catálogo EAD.

---

## 🚀 Backend (Node.js + Express + TypeScript + LowDB)

- API REST com rotas para **cursos**, **ofertas** e **relatórios**
- Banco de dados em **JSON (LowDB)**
- Middlewares: `cors`, `helmet`, `morgan`, `dotenv`

### Como rodar o backend

```bash
cd server
npm install
npm run dev
```

API disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Banco de Dados (LowDB)

O banco de dados é armazenado em `server/db.json` e **é versionado** junto com o projeto.  
Ele já vem populado com **20 cursos** e **20 ofertas** para facilitar testes.

Para referência, existe também um arquivo `server/db.example.json` com a estrutura vazia.

---

## 💻 Frontend (React + Vite + TypeScript + TailwindCSS)

- UI em React com **TailwindCSS**
- Páginas principais:
  - **Cursos**: listagem, criação, edição, exclusão, busca por título/ID e filtro por status
  - **Ofertas**: listagem, criação, edição, exclusão e busca por título/ID
- Componentes reutilizáveis para cards, formulários e navegação
- Utilização de **hooks** e **React Router** para navegação
- Integração com a API REST em tempo real

### Como rodar o frontend

```bash
cd client
npm install
npm run dev
```

App disponível em: [http://localhost:5173](http://localhost:5173)

---

## ✅ Checklist de funcionalidades

- [x] Backend em Node.js/Express configurado
- [x] Banco de dados JSON com LowDB (fixo no repo)
- [x] Rotas de **cursos** (CRUD)
- [x] Rotas de **ofertas** (CRUD)
- [x] Relatórios: cursos por status, atividades recentes, calendário de ofertas
- [x] Frontend em React + Vite + Tailwind configurado
- [x] Listagem de cursos e ofertas
- [x] Cards de curso e oferta com badges de status
- [x] Exclusão de cursos e ofertas com atualização automática
- [x] Formulários completos de **criar/editar** cursos e ofertas
- [x] Seleção de curso existente ao criar oferta
- [x] Validações de formulário (campos obrigatórios, datas)
- [x] Datas exibidas no formato **DD/MM/AAAA**
- [x] Busca por título ou ID em cursos e ofertas
- [x] Filtro por status em cursos

---

## 🏷️ Versões estáveis

- **v1.0.0** – Primeira versão 1.x estável.  
  Inclui:

  - Banco fixo (`server/db.json`) versionado
  - CRUD completo de cursos e ofertas
  - Relatórios no backend
  - Frontend integrado com filtros e validações
# Catálogo de Cursos EAD

Aplicação full-stack para cadastro, listagem e gerenciamento de cursos e ofertas em um catálogo EAD,
desenvolvida como parte do Trabalho de Conclusão de Curso em Engenharia de Software.

---

## 🚀 Backend (Node.js + Express + TypeScript + LowDB)

- API REST com rotas para **cursos**, **ofertas** e **relatórios**
- Banco de dados em **JSON (LowDB)** (utilizado para simplificação do protótipo, podendo ser substituído futuramente por **MySQL/PostgreSQL** conforme previsto no TCC I)
- Middlewares: `cors`, `helmet`, `morgan`, `dotenv`

### Como rodar o backend

```bash
cd server
npm install
npm run dev
```

API disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Banco de Dados

Atualmente, o sistema utiliza **LowDB (JSON local)** para persistência, com o arquivo `server/db.json` versionado no repositório.  
Ele já vem populado com **20 cursos** e **20 ofertas** para facilitar testes.  
Existe também um arquivo `server/db.example.json` com a estrutura vazia.

🔮 *Planejamento original (TCC I)*: utilização de **MySQL/PostgreSQL** como banco de dados relacional, visando escalabilidade.  
A escolha do LowDB permitiu entregar uma versão funcional de forma mais ágil, mantendo a possibilidade de migração futura.

---

## 💻 Frontend (React + Vite + TypeScript + TailwindCSS)

- UI em React, conforme previsto no TCC I (alternativa ao Vue.js, que não foi utilizada)
- TailwindCSS para estilização rápida e responsiva
- Páginas principais:
  - **Cursos**: listagem, criação, edição, exclusão, busca por título/ID e filtro por status
  - **Ofertas**: listagem, criação, edição, exclusão e busca por título/ID
- Componentes reutilizáveis para cards, formulários e navegação
- Hooks e React Router para navegação
- Integração em tempo real com a API REST

### Como rodar o frontend

```bash
cd client
npm install
npm run dev
```

App disponível em: [http://localhost:5173](http://localhost:5173)

---

## ✅ Funcionalidades

### Implementadas
- [x] Backend em Node.js/Express com API REST
- [x] Banco de dados JSON com LowDB (prototipagem)
- [x] CRUD completo de cursos e ofertas
- [x] Relatórios básicos no backend
- [x] Frontend em React + TailwindCSS
- [x] Listagem de cursos e ofertas
- [x] Cards de curso e oferta com badges de status
- [x] Busca por título ou ID em cursos e ofertas
- [x] Filtro por status em cursos
- [x] Validações de formulário (campos obrigatórios, datas)
- [x] Datas exibidas no formato **DD/MM/AAAA**

### Em desenvolvimento ou futuros incrementos
- [ ] **Objetos Educacionais** (previstos no TCC I, ainda não implementados)
- [ ] Relatórios completos no frontend (atualmente apenas backend)
- [ ] Melhorias de design responsivo (mobile-first)
- [ ] Paginação e filtros avançados no frontend
- [ ] Testes automatizados (Jest no backend, React Testing Library no frontend)
- [ ] Deploy em nuvem (Railway/Render + Vercel/Netlify)
- [ ] Migração do banco para MySQL/PostgreSQL

---

## 🏷️ Versões estáveis

- **v1.0.0** – Primeira versão estável.  
  Inclui:
  - Banco fixo (`server/db.json`) versionado
  - CRUD completo de cursos e ofertas
  - Relatórios básicos no backend
  - Frontend integrado com filtros e validações

- **v0.4.0-estavel** – Filtro por título na lista de ofertas, validação contra duplicados, logo no Navbar, rodapé com crédito

- **v0.3.1-estavel** – Validações de datas, edição de ofertas, tratamento de erros

- **v0.2.1-estavel** – Primeira versão estável com seed e `db.example.json` vazio

---

## 📚 Contexto Acadêmico

Este projeto foi desenvolvido no âmbito do **Trabalho de Conclusão de Curso em Engenharia de Software**,
com o objetivo de propor e implementar um **Catálogo de Cursos EAD** para apoiar a gestão de cursos da
**Academia Nacional de Polícia (ANP)**.

O sistema foi concebido para substituir a gestão em planilhas, permitindo controle de versões, rastreabilidade,
histórico de ofertas e relatórios, de acordo com os requisitos levantados no TCC I.

---
