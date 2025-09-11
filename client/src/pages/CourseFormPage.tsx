// client/src/pages/CourseFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCourse, getCourse, updateCourse, type Course } from "../lib/api";

export default function CourseFormPage() {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const nav = useNavigate();

  const [title, setTitle]   = useState("");
  const [status, setStatus] = useState<"ativo"|"inativo">("ativo");
  const [created, setCreated] = useState("");

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const c = await getCourse(Number(id));
      setTitle(c.title);
      setStatus(c.status);
      setCreated(c.created_at);
    })();
  }, [editing, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, status, created_at: created || new Date().toISOString() };
    if (editing) await updateCourse(Number(id), payload);
    else         await createCourse(payload as Omit<Course,"id">);
    nav("/courses");
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{editing ? "Editar curso" : "Novo curso"}</h1>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required minLength={3}/>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option value="ativo">ativo</option>
            <option value="inativo">inativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Criado em (ISO) – opcional</label>
          <input className="input" value={created} onChange={e=>setCreated(e.target.value)} placeholder="2025-09-03T10:00:00Z"/>
        </div>

        <div className="flex gap-2">
          <button type="button" className="btn" onClick={()=>nav(-1)}>Cancelar</button>
          <button className="btn btn-success" type="submit">Salvar</button>
        </div>
      </form>
    </section>
  );
}
