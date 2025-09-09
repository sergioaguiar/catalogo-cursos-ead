import { db } from "../db/connection.ts";

export function coursesByStatus() {
  const counts = db.data!.courses.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});
  return counts; // { ativo: X, inativo: Y }
}

export function recentActivity(days: number) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;

  const createdCourses = db.data!.courses
    .filter(c => Date.parse(c.created_at) >= since)
    .map(c => ({
      kind: "course_created" as const,
      id: c.id,
      created_at: c.created_at,
      title: c.title
    }));

  const offers = db.data!.offers
    .filter(o => Date.parse(o.created_at) >= since)
    .map(o => ({
      kind: "offer" as const,
      id: o.id,
      created_at: o.created_at,
      course_id: o.course_id,
      title: db.data!.courses.find(c => c.id === o.course_id)?.title ?? "",
      detail: `${o.period_start} - ${o.period_end}`
    }));

  return [...offers, ...createdCourses]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

// === RELATÓRIO: ofertas ativas em uma data ==================================

export function activeOffers(onISO?: string) {
  // se não vier data, usa "hoje" no fuso UTC (apenas parte AAAA-MM-DD)
  const on = (onISO ?? new Date().toISOString().slice(0, 10)).trim();

  // validação básica
  const onMs = Date.parse(on);
  if (!Number.isFinite(onMs)) {
    return { error: "Parâmetro 'on' inválido. Use AAAA-MM-DD.", on };
  }

  const list = db.data!.offers
    .filter(o => Date.parse(o.period_start) <= onMs && onMs <= Date.parse(o.period_end))
    .map(o => {
      const course = db.data!.courses.find(c => c.id === o.course_id);
      return {
        ...o,
        course: course ? { id: course.id, title: course.title, status: course.status } : null,
      };
    })
    // ordena por título do curso (quando houver), depois por início
    .sort((a, b) => {
      const ta = a.course?.title ?? "";
      const tb = b.course?.title ?? "";
      if (ta !== tb) return ta.localeCompare(tb);
      return a.period_start.localeCompare(b.period_start);
    });

  return { on, data: list };
}

// === RELATÓRIO: resumo rápido (opcional) =====================================
// total de cursos (por status) e total de ofertas
export function quickSummary() {
  const courses = db.data!.courses;
  const offers  = db.data!.offers;

  const byStatus = courses.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totals: {
      courses: courses.length,
      offers: offers.length,
    },
    coursesByStatus: byStatus,
  };
}

// === RELATÓRIO: calendário de ofertas por mês ================================
// Ex: month="2025-09" => retorna cada dia do mês com as ofertas ativas naquele dia
export function calendarOffers(month?: string) {
  const today = new Date();
  const y = today.getUTCFullYear();
  const m = String(today.getUTCMonth() + 1).padStart(2, "0");

  const mStr = (month ?? `${y}-${m}`).trim();

  // valida "AAAA-MM"
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mStr)) {
    return { error: "Parâmetro 'month' inválido. Use AAAA-MM.", month: mStr };
  }

  const [yy, mm] = mStr.split("-").map(Number);
  const first = new Date(Date.UTC(yy, mm - 1, 1));
  const next  = new Date(Date.UTC(yy, mm, 1));
  const last  = new Date(next.getTime() - 24 * 60 * 60 * 1000);

  const firstISO = first.toISOString().slice(0, 10);
  const lastISO  = last.toISOString().slice(0, 10);

  const days: Array<{ date: string; offers: Array<any> }> = [];

  for (let d = new Date(first); d <= last; d = new Date(d.getTime() + 24 * 60 * 60 * 1000)) {
    const dateISO = d.toISOString().slice(0, 10);
    const t = d.getTime();

    const offers = db.data!.offers
      .filter(o => Date.parse(o.period_start) <= t && t <= Date.parse(o.period_end))
      .map(o => {
        const course = db.data!.courses.find(c => c.id === o.course_id) ?? null;
        return {
          ...o,
          course: course ? { id: course.id, title: course.title, status: course.status } : null,
        };
      })
      .sort((a, b) => {
        const ta = a.course?.title ?? "";
        const tb = b.course?.title ?? "";
        if (ta !== tb) return ta.localeCompare(tb);
        // em seguida por início do período
        return a.period_start.localeCompare(b.period_start);
      });

    days.push({ date: dateISO, offers });
  }

  return { month: mStr, from: firstISO, to: lastISO, days };
}
