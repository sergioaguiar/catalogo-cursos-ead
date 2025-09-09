import { Router } from "express";
import { db, Course } from "../db/connection.ts";

const router = Router();

/* --------- helpers --------- */

function asNumber(v: any, def: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function sortCourses(list: Course[], sort: string, order: "asc" | "desc") {
  const dir = order === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    if (sort === "created_at") {
      const da = new Date(a.created_at).getTime();
      const dbb = new Date(b.created_at).getTime();
      return (da - dbb) * dir;
    }
    // default: title
    return a.title.localeCompare(b.title, "pt-BR") * dir;
  });
}

function applyFilters(list: Course[], q?: string, status?: string) {
  let out = list;
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    out = out.filter(c => c.title.toLowerCase().includes(term));
  }
  if (status && (status === "ativo" || status === "inativo")) {
    out = out.filter(c => c.status === status);
  }
  return out;
}

function maybePaginate<T>(reqQuery: any, items: T[]) {
  const hasPagination =
    reqQuery.page !== undefined || reqQuery.pageSize !== undefined;

  if (!hasPagination) return items; // compat: mantém array simples

  const page = Math.max(1, asNumber(reqQuery.page, 1));
  const pageSize = Math.min(100, Math.max(1, asNumber(reqQuery.pageSize, 10)));
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    meta: { page, pageSize, total, totalPages },
  };
}

/* ---------- LISTAGENS BÁSICAS ---------- */

// GET /courses (com filtros/ordenação/paginação)
router.get("/", (req, res) => {
  const { q, status } = req.query as { q?: string; status?: string };
  const sort = (req.query.sort as string) || "title";
  const order = ((req.query.order as string) || "asc").toLowerCase() as
    | "asc"
    | "desc";

  const data = db.data!;
  const filtered = applyFilters(data.courses, q, status);
  const sorted = sortCourses(filtered, sort, order);

  const result = maybePaginate(req.query, sorted);
  res.json(result);
});

/* ---------- ROTAS EXPANDIDAS (antes de :id) ---------- */

// GET /courses/full -> cursos + suas ofertas (com filtros/ordenação/paginação)
router.get("/full", (req, res) => {
  const { q, status } = req.query as { q?: string; status?: string };
  const sort = (req.query.sort as string) || "title";
  const order = ((req.query.order as string) || "asc").toLowerCase() as
    | "asc"
    | "desc";

  const data = db.data!;
  // primeiro filtra/ordena os cursos
  const filtered = applyFilters(data.courses, q, status);
  const sorted = sortCourses(filtered, sort, order);

  // depois “enriquece” com ofertas
  const enriched = sorted.map(c => ({
    ...c,
    offers: data.offers.filter(o => o.course_id === c.id),
  }));

  const result = maybePaginate(req.query, enriched);
  res.json(result);
});

// GET /courses/:id/full -> 1 curso + suas ofertas
router.get("/:id/full", (req, res) => {
  const id = Number(req.params.id);
  const data = db.data!;
  const c = data.courses.find(x => x.id === id);
  if (!c) return res.status(404).json({ error: "Not found" });
  const offers = data.offers.filter(o => o.course_id === id);
  res.json({ ...c, offers });
});

/* ---------- CRUD POR ID (dinâmico) ---------- */

// GET /courses/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = db.data!.courses.find(x => x.id === id);
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
});

// POST /courses
router.post("/", (req, res) => {
  const { title, status, created_at } = req.body as Partial<Course>;
  if (!title || String(title).trim().length < 3) {
    return res.status(400).json({
      error: "Validação falhou",
      details: { title: "mín 3 caracteres" },
    });
  }
  if (!["ativo", "inativo"].includes(String(status))) {
    return res
      .status(400)
      .json({ error: "Validação falhou", details: { status: "ativo|inativo" } });
  }

  const data = db.data!;
  const id = (data.courses.at(-1)?.id ?? 0) + 1;
  const course: Course = {
    id,
    title: String(title),
    status: status as "ativo" | "inativo",
    created_at: created_at ?? new Date().toISOString(),
  };
  data.courses.push(course);
  db.write();
  res.status(201).json(course);
});

// PATCH /courses/:id
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const c = db.data!.courses.find(x => x.id === id);
  if (!c) return res.status(404).json({ error: "Not found" });

  const { title, status } = req.body as Partial<Course>;
  if (title !== undefined) {
    if (String(title).trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Validação falhou", details: { title: "mín 3 caracteres" } });
    }
    c.title = String(title);
  }
  if (status !== undefined) {
    if (!["ativo", "inativo"].includes(String(status))) {
      return res.status(400).json({
        error: "Validação falhou",
        details: { status: "ativo|inativo" },
      });
    }
    c.status = status as "ativo" | "inativo";
  }
  db.write();
  res.json(c);
});

// DELETE /courses/:id  (com cascata em offers)
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = db.data!;
  const idx = data.courses.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  // remove o curso
  data.courses.splice(idx, 1);
  // cascata: remove ofertas do curso
  data.offers = data.offers.filter(o => o.course_id !== id);

  db.write();
  res.status(204).end();
});


export default router;
