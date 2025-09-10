# Catálogo de Cursos EAD

Monorepo com **API Node/Express (LowDB)** e **Frontend React + Vite + Tailwind** para gerenciar cursos e ofertas.

## Requisitos

- Node.js 18+ (recomendado 20+)
- Git
- (Windows) PowerShell
- NPM 9+

## Estrutura

```
catalogo-cursos-ead/
├─ server/           # API (Express + LowDB)
│  ├─ src/
│  │  ├─ app.ts
│  │  ├─ db/connection.ts  # DB JSON + init
│  │  ├─ db/db.json        # dados
│  │  ├─ routes/
│  │  └─ services/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ .env
└─ client/           # Frontend (React + Vite + Tailwind)
   ├─ src/
   │  ├─ App.tsx
   │  ├─ main.tsx
   │  ├─ pages/         # CoursesPage.tsx, OffersPage.tsx
   │  ├─ components/    # CourseCard, OfferCard, StatusBadge...
   │  ├─ api.ts         # cliente HTTP (fetch)
   │  ├─ types.ts       # tipos TypeScript (Course/Offer)
   │  └─ index.css
   ├─ vite.config.ts
   ├─ .env              # VITE_API_URL=http://localhost:3000
   └─ package.json
```

---

## 1) Backend (server)

### Instalação

```bash
cd server
npm install
```

### Variáveis de ambiente

Crie `server/.env`:

```env
PORT=3000
NODE_ENV=development
```

### Rodar em desenvolvimento

```bash
npm run dev
```

API disponível em: http://localhost:3000  
Saúde: `GET /health` → `{ "status": "ok" }`

### Endpoints principais

- **Cursos**
  - `GET /courses`
  - `GET /courses/:id`
  - `POST /courses`
  - `PATCH /courses/:id`
  - `DELETE /courses/:id` (apaga ofertas ligadas)
  - `GET /courses/full` (curso + ofertas)
  - `GET /courses/:id/full`

- **Ofertas**
  - `GET /offers` (filtros: `course_id`, `activeOn`, `from`, `to`, `page`, `pageSize`, `sort`, `order`)
  - `GET /offers/:id`
  - `POST /offers` (valida período & sobreposição por curso)
  - `PATCH /offers/:id` (valida sobreposição)
  - `DELETE /offers/:id`
  - `GET /offers/full` (oferta + curso)
  - `GET /offers/:id/full`

- **Relatórios**
  - `GET /reports/summary` (totais e agrupamento por status)
  - `GET /reports/active-offers?on=AAAA-MM-DD`
  - `GET /reports/recent-activity?days=30`
  - `GET /reports/calendar?month=AAAA-MM`

### Popular dados (seed rápido)

Abra PowerShell na pasta `server`:

```powershell
$h = @{ "Content-Type"="application/json" }

# Cursos
Invoke-RestMethod -Method Post "http://localhost:3000/courses" -ContentType "application/json" -Body (@{
  title="Curso de Segurança Cibernética"; status="ativo"; created_at="2025-09-01T10:00:00Z"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post "http://localhost:3000/courses" -ContentType "application/json" -Body (@{
  title="Curso de LGPD"; status="ativo"; created_at="2025-09-03T10:00:00Z"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post "http://localhost:3000/courses" -ContentType "application/json" -Body (@{
  title="Ética no Serviço Público"; status="inativo"; created_at="2025-08-20T10:00:00Z"
} | ConvertTo-Json)

# Ofertas (ajuste course_id conforme retorno dos POSTs acima)
Invoke-RestMethod -Method Post "http://localhost:3000/offers" -ContentType "application/json" -Body (@{
  course_id=1; created_at="2025-09-05T10:00:00Z"; period_start="2025-09-05"; period_end="2025-10-05"
} | ConvertTo-Json)

Invoke-RestMethod -Method Post "http://localhost:3000/offers" -ContentType "application/json" -Body (@{
  course_id=2; created_at="2025-09-07T10:00:00Z"; period_start="2025-09-07"; period_end="2025-10-07"
} | ConvertTo-Json)
```

> **Obs.** O projeto já implementa validações: título min 3, status `ativo|inativo`, período válido e sem sobreposição dentro do mesmo curso (409).

---

## 2) Frontend (client)

### Instalação

```bash
cd client
npm install
```

### Variáveis de ambiente

Crie `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### Rodar

```bash
npm run dev
```

Abra http://localhost:5173  
Navegação superior: **Cursos** | **Ofertas**.

---

## 3) Testes rápidos no Front

- **Cursos**: devem listar cards com título, status (badge), e data de criação formatada.
- **Ofertas**: devem listar cards com curso, período e data de criação (se a aba não mostrar, verifique se existem ofertas e se a URL da API está correta em `client/.env`).

---

## 4) Dicas & Troubleshooting

- **“Cannot GET /” em http://localhost:3000**  
  Normal: a API não tem página HTML; use as rotas da API (ex: `/health`, `/courses`).

- **Acentos trocados (Ã©, Ã§)**  
  Assegure que **`server/src/db/db.json`** está em **UTF-8 (sem BOM)**  
  VS Code → `UTF-8` (barra inferior) → **Reopen with Encoding** → `UTF-8` → **Save with Encoding** → `UTF-8`.

- **CORS**  
  O server usa `cors()` liberado. Se trocar porta/host no client, ajuste `VITE_API_URL`.

- **Portas conflitantes**  
  Server: 3000 (mude em `server/.env`); Client: 5173 (padrão Vite).

- **Erro “Router dentro de Router”**  
  O `BrowserRouter` deve existir **somente** em `main.tsx`. Em `App.tsx` use apenas rotas (`Routes/Route`) sem novo `BrowserRouter`.

- **Tipos não exportados**  
  Garanta que `client/src/types.ts` exporta:
  ```ts
  export type CourseStatus = "ativo" | "inativo";

  export type Course = {
    id: number;
    title: string;
    status: CourseStatus;
    created_at: string;
  };

  export type Offer = {
    id: number;
    course_id: number;
    created_at: string;
    period_start: string;
    period_end: string;
  };

  export type OfferFull = Offer & { course: Course };
  ```

---

## 5) Scripts úteis

### Server
```bash
# na pasta server
npm run dev   # dev com tsx
npm start     # start simples (se configurado)
```

### Client
```bash
# na pasta client
npm run dev
npm run build
npm run preview
```

---

## 6) Git – salvar e enviar ao GitHub

Na raiz do projeto:

```bash
git status
git add -A
git commit -m "feat(frontend): rotas de Cursos/Ofertas + layout e integração"
git pull --rebase origin main
git push -u origin main

# (opcional) marcar versão
git tag v0.3.0 -m "Frontend inicial com rotas e integração"
git push origin v0.3.0
```

---

## 7) Roadmap (próximos passos)

- [ ] Formulários para **criar/editar** cursos e ofertas (com validação no client).
- [ ] Filtros e paginação no frontend.
- [ ] Tela de **relatórios** (sumário, calendário de ofertas, atividades recentes).
- [ ] Feedbacks de erro/sucesso (toasts).
- [ ] Deploy (API + Front) — exemplos: Render/railway + Netlify/Vercel.

