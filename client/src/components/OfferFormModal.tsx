import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  CoursesApi,
  OffersApi,
  type Course,
  type Offer,
  type OfferFull,
  type OfferUpsert,
} from "../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (o: OfferFull, mode: "create" | "update") => void;
  initial?: OfferFull | null; // se vier -> editar
};

export default function OfferFormModal({ open, onClose, onSaved, initial }: Props) {
  const isEdit = !!initial;

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState<number | "">("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      setLoadingCourses(true);
      try {
        const list = await CoursesApi.list();
        setCourses(list);
      } catch (e: any) {
        setErr(e?.message ?? "Erro ao carregar cursos");
      } finally {
        setLoadingCourses(false);
      }
    }
    if (open) loadCourses();
  }, [open]);

  useEffect(() => {
    if (open) {
      if (initial) {
        setCourseId(initial.course_id);
        setPeriodStart(initial.period_start);
        setPeriodEnd(initial.period_end);
        setCreatedAt(initial.created_at.slice(0, 19));
      } else {
        setCourseId("");
        setPeriodStart("");
        setPeriodEnd("");
        setCreatedAt(new Date().toISOString().slice(0, 19));
      }
      setErr(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) { setErr("Selecione um curso"); return; }
    setSaving(true);
    setErr(null);
    try {
      const payload: OfferUpsert = {
        course_id: Number(courseId),
        created_at: new Date(createdAt).toISOString(),
        period_start: periodStart,
        period_end: periodEnd,
      };

      let saved: OfferFull;
      let mode: "create" | "update";
      if (isEdit && initial) {
        const updated: Offer = await OffersApi.update(initial.id, payload);
        saved = await OffersApi.getFull(updated.id);
        mode = "update";
      } else {
        const created: Offer = await OffersApi.create(payload);
        saved = await OffersApi.getFull(created.id);
        mode = "create";
      }
      onSaved(saved, mode);
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Editar oferta" : "Nova oferta"}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded bg-zinc-100 hover:bg-zinc-200" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60" disabled={saving} onClick={handleSubmit as any}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      }
    >
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {err && <p className="col-span-full text-red-600">{err}</p>}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Curso</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : "")}
            disabled={loadingCourses}
            required
          >
            <option value="">Selecione...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title} (#{c.id})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Início (AAAA-MM-DD)</label>
          <input className="w-full rounded border px-3 py-2"
            value={periodStart}
            onChange={(e) => setPeriodStart(e.target.value)}
            placeholder="2025-09-15"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fim (AAAA-MM-DD)</label>
          <input className="w-full rounded border px-3 py-2"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
            placeholder="2025-10-15"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Criado em</label>
          <input type="datetime-local" className="w-full rounded border px-3 py-2"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
}
