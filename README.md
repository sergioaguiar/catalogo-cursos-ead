# Catálogo de Cursos EAD

Aplicação full-stack para cadastro, listagem e gerenciamento de cursos e ofertas em um catálogo EAD.

---

## 🚀 Backend (Node.js + Express + TypeScript + LowDB)

- API REST com rotas para **cursos**, **ofertas** e **relatórios**.
- Banco de dados em **JSON (LowDB)**.
- Middlewares: `cors`, `helmet`, `morgan`, `dotenv`.
- Scripts de seed para popular dados iniciais.

### Como rodar o backend

```bash
cd server
npm install
npm run dev
```

API disponível em: [http://localhost:3000](http://localhost:3000)

---

## 💻 Frontend (React + Vite + TypeScript + TailwindCSS)

- UI em React com **TailwindCSS**.
- Páginas principais:
  - **Cursos**: listagem, criação, edição, exclusão, busca por título/ID e filtro por status.
  - **Ofertas**: listagem, criação, edição, exclusão e busca por título/ID.
- Componentes reutilizáveis para cards, formulários e navegação.
- Utilização de **hooks** e **React Router** para navegação entre páginas.
- Integração com API REST para sincronizar dados em tempo real.

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
- [x] Banco de dados JSON com LowDB
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

## 🔜 Próximos incrementos

- [ ] Melhorar design responsivo (mobile-first)
- [ ] Adicionar paginação e filtros avançados no frontend
- [ ] Criar tela de relatórios no frontend
- [ ] Testes automatizados (Jest no backend, React Testing Library no frontend)
- [ ] Deploy em ambiente na nuvem (Railway/Render para backend + Vercel/Netlify para frontend)
