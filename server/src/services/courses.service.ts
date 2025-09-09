import { db } from "../db/connection.ts";

export function listCourses() {
  return db.data!.courses;
}

export function getCourseById(id: number) {
  return db.data!.courses.find(c => c.id === id) ?? null;
}

export async function createCourse(input: { title: string; status: "ativo" | "inativo"; created_at?: string; }) {
  const nextId = (db.data!.courses.reduce((m, c) => Math.max(m, c.id), 0) || 0) + 1;
  const course = {
    id: nextId,
    title: input.title,
    status: input.status,
    created_at: input.created_at ?? new Date().toISOString()
  };
  db.data!.courses.push(course);
  await db.write();
  return course;
}
