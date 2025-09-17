import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const router = Router();

/** Tipos */
type Course = {
  id: number;
  title: string;
  status: string;        // "ativo" | "inativo" | ...
  created_at: string;    // "YYYY-MM-DD"
};

type Offer = {
  id: number;
  course_id: number;
  period_start: string;  // "YYYY-MM-DD"
  period_end: string;    // "YYYY-MM-DD"
  created_at: string;    // "YYYY-MM-DD"
};

type DB = {
  courses: Course[];
  offers: Offer[];
};

/** LowDB (forma estável e simples) */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.resolve(__dirname, "..", "..", "db.json");
const adapter = new JSONFile<DB>(dbFile);
const db = new Low<DB>(adapter, { courses: [], offers: [] });

await db.read();
db.data ||= { courses: [], offers: [] };

/** Helpers */
function isYYYYMMDD(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
function todayYYYYMMDD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function datesRangeIsValid(startISO: string, endISO: string) {
  // strings YYYY-MM-DD são ordenáveis lexicograficamente
  return endISO >= startISO;
}
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return !(aEnd < bStart || bEnd < aStart);
}
function isActive(c?: Course) {
  const st = String(c?.status ?? "").trim().toLowerCase();
  return st === "ativo" || st === "active";
}
function nextId(): number {
  const arr = db.data!.offers;
  return arr.length ? Math.max(...arr.map((o) => o.id)) + 1 : 1;
}

/** Rotas */
router.get("/", async (_req, res) => {
  // DESC: mais recentes primeiro
  const ordered = [...db.data!.offers].sort((a, b) =>
    b.period_start.localeCompare(a.period_start)
  );
  res.json(ordered);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const o = db.data!.offers.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Oferta não encontrada." });
  res.json(o);
});

router.post("/", async (req, res) => {
  const { course_id, period_start, period_end, created_at } = req.body ?? {};

  if (!Number.isFinite(Number(course_id))) {
    return res.status(400).json({ error: "course_id inválido." });
  }
  if (!isYYYYMMDD(period_start) || !isYYYYMMDD(period_end)) {
    return res.status(400).json({
      error: "Datas devem estar em YYYY-MM-DD.",
      details: { period_start, period_end },
    });
  }
  if (!datesRangeIsValid(period_start, period_end)) {
    return res.status(400).json({
      error: "A data de fim não pode ser anterior à data de início.",
      details: { period: true },
    });
  }

  const course = db.data!.courses.find((c) => c.id === Number(course_id));
  if (!course) return res.status(404).json({ error: "Curso não encontrado." });
  if (!isActive(course)) {
    return res.status(400).json({ error: "Somente cursos ativos podem receber ofertas." });
  }

  const overlap = db
    .data!.offers.filter((o) => o.course_id === Number(course_id))
    .some((o) => rangesOverlap(o.period_start, o.period_end, period_start, period_end));

  if (overlap) {
    return res
      .status(409)
      .json({ error: "Período sobreposto para este curso.", details: { overlap: true } });
  }

  const offer: Offer = {
    id: nextId(),
    course_id: Number(course_id),
    // ⚠️ sem new Date / sem toISOString: salvamos as STRINGS puras
    period_start,
    period_end,
    created_at: isYYYYMMDD(created_at) ? created_at : todayYYYYMMDD(),
  };

  db.data!.offers.push(offer);
  await db.write();
  res.status(201).json(offer);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existing = db.data!.offers.find((o) => o.id === id);
  if (!existing) return res.status(404).json({ error: "Oferta não encontrada." });

  const { course_id, period_start, period_end, created_at } = req.body ?? {};

  if (!Number.isFinite(Number(course_id))) {
    return res.status(400).json({ error: "course_id inválido." });
  }
  if (!isYYYYMMDD(period_start) || !isYYYYMMDD(period_end)) {
    return res.status(400).json({
      error: "Datas devem estar em YYYY-MM-DD.",
      details: { period_start, period_end },
    });
  }
  if (!datesRangeIsValid(period_start, period_end)) {
    return res.status(400).json({
      error: "A data de fim não pode ser anterior à data de início.",
      details: { period: true },
    });
  }

  const course = db.data!.courses.find((c) => c.id === Number(course_id));
  if (!course) return res.status(404).json({ error: "Curso não encontrado." });
  if (!isActive(course)) {
    return res.status(400).json({ error: "Somente cursos ativos podem receber ofertas." });
  }

  const overlap = db
    .data!.offers.filter((o) => o.course_id === Number(course_id) && o.id !== id)
    .some((o) => rangesOverlap(o.period_start, o.period_end, period_start, period_end));
  if (overlap) {
    return res
      .status(409)
      .json({ error: "Período sobreposto para este curso.", details: { overlap: true } });
  }

  existing.course_id = Number(course_id);
  existing.period_start = period_start; // manter string pura
  existing.period_end = period_end;     // manter string pura
  if (isYYYYMMDD(created_at)) existing.created_at = created_at;

  await db.write();
  res.json(existing);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const ix = db.data!.offers.findIndex((o) => o.id === id);
  if (ix < 0) return res.status(404).json({ error: "Oferta não encontrada." });
  const [removed] = db.data!.offers.splice(ix, 1);
  await db.write();
  res.json(removed);
});

export default router;
