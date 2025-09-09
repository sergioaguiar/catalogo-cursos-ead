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
