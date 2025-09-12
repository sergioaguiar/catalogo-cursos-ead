// client/src/pages/CoursesPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCourses, deleteCourse, type Course } from "../lib/api";

export default function CoursesPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | "ativo" | "inativo">("");

  async function load() {
    try {
      setLoading(true);
      const data = await listCourses();
      setCourses(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Remover este curso?")) return;
    try {
      await deleteCourse(id);
      setCourses(curr => curr.filter(c => c.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Erro ao remover curso");
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return courses.filter(c => {
      const byText =
        !term ||
        String(c.id).includes(term) ||
        (c.title?.toLowerCase().includes(term) ?? false);
      const byStatus = !status || (c.status?.toLowerCase() === status);
      return byText && byStatus;
    });
  }, [courses, q, status]);

  return (
    <section>
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cursos</h1>
          <p className="text-sm text-zinc-600">
            Listagem carregada de <code>/courses</code>.
          </p>
        </div>
        <Link to="/courses/new" className="btn btn-success">Novo curso</Link>
      </header>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título ou ID…"
          className="input sm:w-80"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="input sm:w-44"
          title="Filtrar por status"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>

      {loading && <p>Carregando…</p>}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="text-zinc-600">Nenhum curso encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((c) => (
                <article
                  key={c.id}
                  className="rounded-2xl border border-gray-200 p-4 shadow hover:shadow-md transition"
                >
                  <header className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">
                      {c.title || `Curso #${c.id}`}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 border">
                      #{c.id}
                    </span>
                  </header>

                  <p className="text-sm text-gray-600 mt-1">
                    Status:{" "}
                    <strong className={c.status === "inativo" ? "text-red-700" : "text-emerald-700"}>
                      {c.status ?? "—"}
                    </strong>
                  </p>

                  {c.created_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Criado em {new Date(c.created_at).toLocaleString("pt-BR")}
                    </p>
                  )}

                  <footer className="mt-4 flex items-center gap-2">
                    <button
                      className="btn"
                      onClick={() => navigate("/courses/new", { state: { initial: c } })}
                      title="Editar"
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(c.id)}
                      title="Remover"
                    >
                      Remover
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
