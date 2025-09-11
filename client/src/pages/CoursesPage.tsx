import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCourses, deleteCourse, Course } from "../lib/api";
import StatusBadge from "../components/StatusBadge";
import { formatISOToBR } from "../lib/dates";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await listCourses();
      setCourses(data);
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao carregar cursos");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return;
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Erro ao excluir curso");
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursos</h1>
        <Link
          to="/courses/new"
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Novo Curso
        </Link>
      </div>

      {err && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{err}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <header className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold leading-tight">{c.title}</h3>
              <StatusBadge status={c.status} />
            </header>
            <p className="text-sm text-zinc-500">
              Criado em {formatISOToBR(c.created_at)}
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                to={`/courses/${c.id}/edit`}
                className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-50"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
