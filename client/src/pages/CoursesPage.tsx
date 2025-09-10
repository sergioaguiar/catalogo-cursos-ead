import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import type { Course } from "../types";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`${API}/courses`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: Course[] = await res.json();
        if (live) setData(json);
      } catch (e: any) {
        if (live) setErr(e?.message ?? "erro");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  if (loading) return <p className="p-6 text-zinc-500">Carregando…</p>;
  if (err)      return <p className="p-6 text-red-600">Erro: {err}</p>;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Cursos</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map(c => <CourseCard key={c.id} course={c} />)}
      </div>
    </main>
  );
}
