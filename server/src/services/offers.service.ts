import { db } from "../db/connection.ts";

export function listOffers() {
  return db.data!.offers;
}

export async function createOffer(input: {
  course_id: number;
  created_at?: string;
  period_start: string;
  period_end: string;
}) {
  // valida curso
  const course = db.data!.courses.find(c => c.id === input.course_id);
  if (!course) throw new Error("course_id inválido");

  const nextId = (db.data!.offers.reduce((m, o) => Math.max(m, o.id), 0) || 0) + 1;
  const offer = {
    id: nextId,
    course_id: input.course_id,
    created_at: input.created_at ?? new Date().toISOString(),
    period_start: input.period_start,
    period_end: input.period_end
  };
  db.data!.offers.push(offer);
  await db.write();
  return offer;
}
