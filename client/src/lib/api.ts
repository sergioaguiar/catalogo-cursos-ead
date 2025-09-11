// client/src/lib/api.ts
const BASE = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:3000";

export type Status = "ativo" | "inativo";
export type Course = { id: number; title: string; status: Status; created_at: string };
export type Offer  = { id: number; course_id: number; period_start: string; period_end: string; created_at: string };
export type OfferFull = Offer & { course: Course };

async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Courses
export function listCourses()                                   { return j<Course[]>("/courses"); }
export function getCourse(id: number)                            { return j<Course>(`/courses/${id}`); }
export function createCourse(data: Omit<Course, "id">)           { return j<Course>("/courses", { method: "POST", body: JSON.stringify(data) }); }
export function updateCourse(id: number, data: Partial<Course>)  { return j<Course>(`/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }); }
export async function deleteCourse(id: number)                   { await j<void>(`/courses/${id}`, { method: "DELETE" }); }

// Offers
export function listOffers(params?: Record<string, string|number>) {
  const qs = params ? "?" + new URLSearchParams(params as any).toString() : "";
  return j<Offer[]>(`/offers${qs}`);
}
export function listOffersFull(params?: Record<string, string|number>) {
  const qs = params ? "?" + new URLSearchParams(params as any).toString() : "";
  return j<OfferFull[]>(`/offers/full${qs}`);
}
export function getOffer(id: number)                            { return j<Offer>(`/offers/${id}`); }
export function createOffer(data: Omit<Offer, "id">)            { return j<Offer>("/offers", { method: "POST", body: JSON.stringify(data) }); }
export function updateOffer(id: number, data: Partial<Offer>)   { return j<Offer>(`/offers/${id}`, { method: "PATCH", body: JSON.stringify(data) }); }
export async function deleteOffer(id: number)                   { await j<void>(`/offers/${id}`, { method: "DELETE" }); }
