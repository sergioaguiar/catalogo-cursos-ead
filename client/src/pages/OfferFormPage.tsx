// client/src/pages/OfferFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  listCourses,
  getOffer,
  createOffer,
  updateOffer,
  type Course,
} from "../lib/api";
import { formatBRToISO, formatISOToBR } from "../lib/dates";

function todayYYYYMMDD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function OfferFormPage() {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const nav = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [startBR, setStartBR] = useState(""); // DD/MM/AAAA
  const [endBR, setEndBR] = useState("");
  const [createdBR, setCreatedBR] = useState("");

  useEffect(() => {
    listCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const o = await getOffer(Number(id));
      setCourseId(String(o.course_id));
      setStartBR(formatISOToBR(o.period_start));
      setEndBR(formatISOToBR(o.period_end));
      setCreatedBR(formatISOToBR(o.created_at));
    })();
  }, [editing, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      course_id: Number(courseId),
      // STRINGS puras "YYYY-MM-DD" (sem Date/UTC)
      period_start: formatBRToISO(startBR),
      period_end: formatBRToISO(endBR),
      created_at: createdBR ? formatBRToISO(createdBR) : todayYYYYMMDD(),
    };

    if (editing) await updateOffer(Number(id), payload);
    else await createOffer(payload as any);

    nav("/offers");
  }

  return (
    <section className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {editing ? "Editar oferta" : "Nova oferta"}
      </h1>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium">Curso</label>
          <select
            className="input"
            required
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Selecione…</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">
              Início (DD/MM/AAAA)
            </label>
            <input
              className="input"
              placeholder="DD/MM/AAAA"
              value={startBR}
              onChange={(e) => setStartBR(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Fim (DD/MM/AAAA)
            </label>
            <input
              className="input"
              placeholder="DD/MM/AAAA"
              value={endBR}
              onChange={(e) => setEndBR(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Criado em (DD/MM/AAAA) – opcional
          </label>
          <input
            className="input"
            placeholder="DD/MM/AAAA"
            value={createdBR}
            onChange={(e) => setCreatedBR(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button type="button" className="btn" onClick={() => nav(-1)}>
            Cancelar
          </button>
          <button className="btn btn-success" type="submit">
            Salvar
          </button>
        </div>
      </form>
    </section>
  );
}
