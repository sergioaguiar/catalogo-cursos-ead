import { Router } from "express";
import { db, Offer } from "../db/connection.ts";

const router = Router();

/* --------- helpers --------- */
function asNumber(v: any, def: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

function parseDateISO(d?: string) {
  if (!d) return undefined;
  const t = Date.parse(d);
  return Number.isFinite(t) ? new Date(t) : undefined;
}

function sortOffers(list: Offer[], sort: string, order: "asc" | "desc") {
  const dir = order === "desc" ? -1 : 1;
  return [...list].sort((a, b) => {
    if (sort === "created_at") {
      return (Date.parse(a.created_at) - Date.parse(b.created_at)) * dir;
    }
    // default: period_start
    return (Date.parse(a.period_start) - Date.parse(b.period_start)) * dir;
  });
}

function isRangeValid(start: string, end: string) {
  const s = Date.parse(start);
  const e = Date.parse(end);
  return Number.isFinite(s) && Number.isFinite(e) && s <= e;
}

function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  const as = Date.parse(aStart);
  const ae = Date.parse(aEnd);
  const bs = Date.parse(bStart);
  const be = Date.parse(bEnd);
  if (![as, ae, bs, be].every(Number.isFinite)) return false;
  // Sobrepõe se um começa antes do outro terminar e termina depois do outro começar
  return as <= be && ae >= bs;
}

/** Verifica se o período informado colide com alguma outra oferta do mesmo curso.
 *  use ignoreId para PATCH (ignorar a própria oferta).
 */
function hasOverlapForCourse(
  course_id: number,
  start: string,
  end: string,
  ignoreId?: number
) {
  const { offers } = db.data!;
  return offers.some(
    (o) =>
      o.course_id === course_id &&
      (ignoreId ? o.id !== ignoreId : true) &&
      rangesOverlap(start, end, o.period_start, o.period_end)
  );
}

function applyFilters(
  list: Offer[],
  course_id?: number,
  from?: string,
  to?: string,
  activeOn?: string
) {
  let out = list;

  if (Number.isFinite(course_id)) {
    out = out.filter((o) => o.course_id === course_id);
  }

  const fromDt = parseDateISO(from);
  const toDt = parseDateISO(to);
  if (fromDt || toDt) {
    out = out.filter((o) => {
      const c = Date.parse(o.created_at);
      if (fromDt && c < +fromDt) return false;
      if (toDt && c > +toDt) return false;
      return true;
    });
  }

  // activeOn = “pegar ofertas ativas na data”
  const on = parseDateISO(activeOn);
  if (on) {
    out = out.filter((o) => {
      const start = Date.parse(o.period_start);
      const end = Date.parse(o.period_end);
      const x = +on;
      return x >= start && x <= end;
    });
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

/* ---------- LISTAGENS ---------- */

// GET /offers (filtros/ordenação/paginação)
// Query params:
// - course_id (number)
// - from, to (ISO date) -> faixa em created_at
// - activeOn (YYYY-MM-DD) -> ofertas ativas nesse dia (period_start <= dia <= period_end)
// - sort: created_at | period_start (default: period_start)
// - order: asc | desc (default: asc)
// - page, pageSize (se informar, resposta vira { data, meta })
router.get("/", (req, res) => {
  const course_id = asNumber(req.query.course_id, NaN);
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const activeOn = req.query.activeOn as string | undefined;
  const sort = (req.query.sort as string) || "period_start";
  const order = ((req.query.order as string) || "asc").toLowerCase() as
    | "asc"
    | "desc";

  const data = db.data!;
  const filtered = applyFilters(
    data.offers,
    Number.isFinite(course_id) ? course_id : undefined,
    from,
    to,
    activeOn
  );
  const sorted = sortOffers(filtered, sort, order);

  const result = maybePaginate(req.query, sorted);
  res.json(result);
});

// GET /offers/full -> oferta + course (join simplificado)
router.get("/full", (req, res) => {
  const course_id = asNumber(req.query.course_id, NaN);
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const activeOn = req.query.activeOn as string | undefined;
  const sort = (req.query.sort as string) || "period_start";
  const order = ((req.query.order as string) || "asc").toLowerCase() as
    | "asc"
    | "desc";

  const data = db.data!;
  const filtered = applyFilters(
    data.offers,
    Number.isFinite(course_id) ? course_id : undefined,
    from,
    to,
    activeOn
  );
  const sorted = sortOffers(filtered, sort, order);

  const enriched = sorted.map((o) => ({
    ...o,
    course: data.courses.find((c) => c.id === o.course_id) ?? null,
  }));

  const result = maybePaginate(req.query, enriched);
  res.json(result);
});

// GET /offers/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const o = db.data!.offers.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Not found" });
  res.json(o);
});

// GET /offers/:id/full
router.get("/:id/full", (req, res) => {
  const id = Number(req.params.id);
  const data = db.data!;
  const o = data.offers.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Not found" });
  const course = data.courses.find((c) => c.id === o.course_id) ?? null;
  res.json({ ...o, course });
});

// POST /offers
router.post("/", (req, res) => {
  const { course_id, created_at, period_start, period_end } =
    req.body as Partial<Offer>;

  if (!Number.isFinite(course_id)) {
    return res
      .status(400)
      .json({
        error: "Validação falhou",
        details: { course_id: "obrigatório (number)" },
      });
  }
  const data = db.data!;
  const course = data.courses.find((c) => c.id === Number(course_id));
  if (!course) {
    return res.status(400).json({ error: "course_id inexistente" });
  }
  if (!period_start || !period_end) {
    return res.status(400).json({
      error: "Validação falhou",
      details: { period_start: "obrigatório", period_end: "obrigatório" },
    });
  }
  if (!isRangeValid(String(period_start), String(period_end))) {
    return res.status(400).json({
      error: "Validação falhou",
      details: {
        period: "period_start deve ser <= period_end e ambas datas válidas",
      },
    });
  }
  if (
    hasOverlapForCourse(
      Number(course_id),
      String(period_start),
      String(period_end)
    )
  ) {
    return res.status(409).json({
      error: "Conflito",
      details: {
        overlap: "Já existe oferta deste curso com período sobreposto",
      },
    });
  }

  const id = (data.offers.at(-1)?.id ?? 0) + 1;
  const offer: Offer = {
    id,
    course_id: Number(course_id),
    created_at: created_at ?? new Date().toISOString(),
    period_start: String(period_start),
    period_end: String(period_end),
  };
  data.offers.push(offer);
  db.write();
  res.status(201).json(offer);
});

// PATCH /offers/:id
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const o = db.data!.offers.find((x) => x.id === id);
  if (!o) return res.status(404).json({ error: "Not found" });

  const incoming = req.body as Partial<Offer>;

  // Se trocar course_id, verifique se existe
  if (incoming.course_id !== undefined) {
    const c = db.data!.courses.find((c) => c.id === Number(incoming.course_id));
    if (!c) {
      return res.status(400).json({ error: "course_id inexistente" });
    }
  }

  // Compute novos valores candidatos
  const next = {
    course_id:
      incoming.course_id !== undefined
        ? Number(incoming.course_id)
        : o.course_id,
    period_start:
      incoming.period_start !== undefined
        ? String(incoming.period_start)
        : o.period_start,
    period_end:
      incoming.period_end !== undefined
        ? String(incoming.period_end)
        : o.period_end,
    created_at:
      incoming.created_at !== undefined
        ? String(incoming.created_at)
        : o.created_at,
  };

  // Validar período
  if (!isRangeValid(next.period_start, next.period_end)) {
    return res.status(400).json({
      error: "Validação falhou",
      details: {
        period: "period_start deve ser <= period_end e ambas datas válidas",
      },
    });
  }

  // Colisão com outras ofertas do mesmo curso
  if (
    hasOverlapForCourse(next.course_id, next.period_start, next.period_end, id)
  ) {
    return res.status(409).json({
      error: "Conflito",
      details: {
        overlap: "Já existe oferta deste curso com período sobreposto",
      },
    });
  }

  // Persistir
  o.course_id = next.course_id;
  o.period_start = next.period_start;
  o.period_end = next.period_end;
  o.created_at = next.created_at;

  db.write();
  res.json(o);
});

// DELETE /offers/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const data = db.data!;
  const idx = data.offers.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  data.offers.splice(idx, 1);
  db.write();
  res.status(204).end();
});

export default router;
