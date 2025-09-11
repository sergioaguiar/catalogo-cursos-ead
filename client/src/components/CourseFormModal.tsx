import { useEffect, useState } from "react";
import Modal from "./Modal";
import { CoursesApi, type Course, type CourseUpsert } from "../lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (c: Course, mode: "create" | "update") => void;
  initial?: Course | null; // se vier -> editar
};

export default function CourseFormModal({ open, onClose, onSaved, initial }: Props) {
  const isEdit = !!initial;
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Course["status"]>("ativo");
  const [createdAt, setCreatedAt] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setTitle(initial.title);
        setStatus(initial.status);
        setCreatedAt(initial.created_at.slice(0, 19)); // para input datetime-local
      } else {
        setTitle("");
        setStatus("ativo");
        setCreatedAt(new Date().toISOString().slice(0, 19));
      }
      setErr(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload: CourseUpsert = {
        title: title.trim(),
        status,
        created_at: new Date(createdAt).toISOString(),
      };
      let saved: Course;
      let mode: "create" | "update";
      if (isEdit && initial) {
        saved = await CoursesApi.update(initial.id, payload);
        mode = "update";
      } else {
        saved = await CoursesApi.create(payload);
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
      title={isEdit ? "Editar curso" : "Novo curso"}
      footer={
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded bg-zinc-100 hover:bg-zinc-200" onClick={onClose} disabled={saving}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60" disabled={saving} onClick={handleSubmit as any}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {err && <p className="text-red-600">{err}</p>}

        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as Course["status"])}
          >
            <option value="ativo">ativo</option>
            <option value="inativo">inativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Criado em</label>
          <input
            type="datetime-local"
            className="w-full rounded border px-3 py-2"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
}
