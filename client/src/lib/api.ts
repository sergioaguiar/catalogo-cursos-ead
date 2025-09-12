// client/src/lib/api.ts

/** =========================
 *  Tipos
 *  ========================= */
export type Course = {
  id: number;
  title: string;
  status: string;      // "ativo"/"inativo" (ou "active"/"inactive")
  created_at: string;  // ISO
};

export type Offer = {
  id: number;
  course_id: number;
  period_start: string; // ISO "YYYY-MM-DD"
  period_end: string;   // ISO "YYYY-MM-DD"
  created_at: string;   // ISO datetime
};

export type OfferFull = Offer & {
  course: Course; // usado pelo seu OfferCard
};

/** =========================
 *  Config / Helpers
 *  ========================= */
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "http://localhost:3000";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Erro ${res.status} em ${path}${txt ? `: ${txt}` : ""}`);
  }
  return res.json();
}

/** =========================
 *  Courses
 *  ========================= */
export function listCourses(): Promise<Course[]> {
  return fetchJSON<Course[]>("/courses");
}

export function getCourse(id: number): Promise<Course> {
  return fetchJSON<Course>(`/courses/${id}`);
}

export function createCourse(data: Omit<Course, "id">): Promise<Course> {
  return fetchJSON<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCourse(id: number, data: Partial<Omit<Course, "id">>): Promise<Course> {
  return fetchJSON<Course>(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCourse(id: number): Promise<void> {
  return fetchJSON<void>(`/courses/${id}`, { method: "DELETE" });
}

/** =========================
 *  Offers
 *  ========================= */
export function listOffers(): Promise<Offer[]> {
  return fetchJSON<Offer[]>("/offers");
}

export function getOffer(id: number): Promise<Offer> {
  return fetchJSON<Offer>(`/offers/${id}`);
}

export function createOffer(data: Omit<Offer, "id">): Promise<Offer> {
  return fetchJSON<Offer>("/offers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Mantive PUT porque seu arquivo atual usa PUT para updateOffer
export function updateOffer(id: number, data: Partial<Offer>): Promise<Offer> {
  return fetchJSON<Offer>(`/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteOffer(id: number): Promise<void> {
  return fetchJSON<void>(`/offers/${id}`, { method: "DELETE" });
}

/** =========================
 *  Offers "cheias" (OfferFull)
 *  =========================
 *  Gera o shape esperado pelo OfferCard: { ...offer, course }
 */
export async function listOffersFull(): Promise<OfferFull[]> {
  const [offers, courses] = await Promise.all([listOffers(), listCourses()]);
  const byId = new Map<number, Course>(courses.map(c => [c.id, c]));
  return offers.map(o => ({
    ...o,
    course: byId.get(o.course_id) ?? { id: o.course_id, title: `Curso #${o.course_id}`, status: "ativo", created_at: new Date().toISOString() },
  }));
}
