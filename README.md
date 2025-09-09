# 📚 Catálogo de Cursos EAD (API)

API simples para gerenciamento de cursos, ofertas e relatórios, desenvolvida em **Node.js + Express + TypeScript** usando **LowDB (JSON)** como banco de dados.

---

## 🚀 Tecnologias
- Node.js v22+
- Express
- TypeScript
- LowDB (JSON como banco)
- TSX (execução com hot-reload)

---

## 📦 Instalação

Clone o repositório:

```bash
git clone https://github.com/sergioaguiar/catalogo-cursos-ead.git
cd catalogo-cursos-ead/server
```

Instale as dependências:

```bash
npm install
```

---

## ▶️ Execução

### Ambiente de desenvolvimento (com hot reload)
```bash
npm run dev
```

### Ambiente de produção (build + start)
```bash
npm run build
npm start
```

A API rodará em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Estrutura de Pastas

```
server/
 ├── src/
 │   ├── app.ts               # App principal
 │   ├── db/
 │   │   ├── connection.ts    # Configuração do banco JSON
 │   │   └── db.json          # Banco de dados (JSON)
 │   ├── routes/              # Rotas (courses, offers, reports)
 │   └── services/            # Regras de negócio
 ├── package.json
 └── tsconfig.json
```

---

## 📑 Endpoints

### 🔹 Health Check
- `GET /health` → retorna `{ "status": "ok" }`

---

### 🔹 Cursos (`/courses`)

- **Listar cursos**
```bash
curl http://localhost:3000/courses
```

- **Obter curso por ID**
```bash
curl http://localhost:3000/courses/1
```

- **Criar curso**
```bash
curl -X POST http://localhost:3000/courses   -H "Content-Type: application/json"   -d '{"title":"Curso de Typescript","status":"ativo","created_at":"2025-09-09T12:00:00Z"}'
```

---

### 🔹 Ofertas (`/offers`)

- **Listar ofertas**
```bash
curl http://localhost:3000/offers
```

- **Obter oferta por ID**
```bash
curl http://localhost:3000/offers/1
```

- **Criar oferta**
```bash
curl -X POST http://localhost:3000/offers   -H "Content-Type: application/json"   -d '{"course_id":1,"created_at":"2025-09-10T10:00:00Z","period_start":"2025-09-15","period_end":"2025-10-15"}'
```

---

### 🔹 Relatórios (`/reports`)

- **Cursos por status**
```bash
curl http://localhost:3000/reports/courses-by-status
```

- **Atividades recentes (últimos X dias)**
```bash
curl "http://localhost:3000/reports/recent-activity?days=30"
```

---

## 🌱 Banco de Dados Inicial (`db.json`)

O banco fica em `server/src/db/db.json`.  
Exemplo de seed inicial:

```json
{
  "courses": [
    { "id": 1, "title": "Curso de Segurança Cibernética", "status": "ativo", "created_at": "2025-09-01T10:00:00Z" },
    { "id": 2, "title": "Curso de LGPD", "status": "ativo", "created_at": "2025-09-03T10:00:00Z" },
    { "id": 3, "title": "Ética no Serviço Público", "status": "inativo", "created_at": "2025-08-20T10:00:00Z" }
  ],
  "offers": [
    { "id": 1, "course_id": 1, "created_at": "2025-09-05T10:00:00Z", "period_start": "2025-09-05", "period_end": "2025-10-05" },
    { "id": 2, "course_id": 2, "created_at": "2025-09-07T10:00:00Z", "period_start": "2025-09-07", "period_end": "2025-10-07" }
  ]
}
```

---

## 📝 Licença
Projeto livre para uso em estudos e adaptações.
