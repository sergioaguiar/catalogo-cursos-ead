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
  period_start: string; // ISO
  period_end: string;   // ISO
  created_at: string;   // ISO
};

export type OfferFull = Offer & {
  course?: Course;
  [k: string]: any;
};

/** =========================
 *  Config / Helpers
 *  ========================= */
const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const normalize = (s: string) => String(s ?? "").trim().toLocaleLowerCase();

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `Resposta não-JSON em ${path}. CT: ${ct}. Trecho: ${txt.slice(0, 160)}`
    );
  }

  return res.json() as Promise<T>;
}

/** =========================
 *  Cursos  (rotas sem /api)
 *  ========================= */
export function listCourses(): Promise<Course[]> {
  return fetchJSON<Course[]>("/courses");
}

export function getCourse(id: number): Promise<Course> {
  return fetchJSON<Course>(`/courses/${id}`);
}

/** BLOQUEIO de nomes duplicados (case-insensitive) */
export async function createCourse(
  data: Omit<Course, "id">
): Promise<Course> {
  const all = await listCourses();
  const dup = all.some((c) => normalize(c.title) === normalize(data.title));
  if (dup) throw new Error("Já existe um curso com esse nome.");

  return fetchJSON<Course>("/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCourse(
  id: number,
  data: Partial<Course>
): Promise<Course> {
  if (data.title) {
    const all = await listCourses();
    const dup = all.some(
      (c) => c.id !== id && normalize(c.title) === normalize(data.title!)
    );
    if (dup) throw new Error("Já existe um curso com esse nome.");
  }

  return fetchJSON<Course>(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteCourse(id: number): Promise<void> {
  return fetchJSON<void>(`/courses/${id}`, { method: "DELETE" });
}

/** =========================
 *  Ofertas  (rotas sem /api)
 *  ========================= */
export function listOffersFull(): Promise<OfferFull[]> {
  return fetchJSON<OfferFull[]>("/offers/full");
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

export function updateOffer(
  id: number,
  data: Partial<Offer>
): Promise<Offer> {
  return fetchJSON<Offer>(`/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteOffer(id: number): Promise<void> {
  return fetchJSON<void>(`/offers/${id}`, { method: "DELETE" });
}
