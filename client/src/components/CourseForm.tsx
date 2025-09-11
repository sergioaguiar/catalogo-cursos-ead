import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Course, createCourse, getCourse, updateCourse } from "../lib/api";
import { formatISOToBR, formatBRToISO } from "../lib/dates";

export default function CourseForm() {
  const navigate = useNavigate();
  const params = useParams();
  const isEdit = Boolean(params.id);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"ativo" | "inativo" | "">("");
  const [createdBR, setCreatedBR] = useState(""); // DD/MM/AAAA
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isEdit) return;
      try {
        const c = await getCourse(Number(params.id));
        setTitle(c.title);
        setStatus(c.status);
        setCreatedBR(formatISOToBR(c.created_at));
      } catch (e: any) {
        setErr(e?.message ?? "Erro ao carregar curso");
      }
    })();
  }, [isEdit, params.id]);

  const canSubmit = useMemo(() => {
    return title.trim().length >= 3 && (status === "ativo" || status === "inativo");
  }, [title, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!canSubmit) {
      setErr("Preencha um título (≥ 3) e selecione o status.");
      return;
    }

    const payload: Partial<Course> & { title: string; status: "ativo" | "inativo" } = {
      title: title.trim(),
      status,
    };

    if (createdBR.trim()) {
      const iso = formatBRToISO(createdBR);
      if (!iso) {
        setErr("Data inválida. Use DD/MM/AAAA.");
        return;
      }
      (payload as any).created_at = iso;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateCourse(Number(params.id), payload);
      } else {
        await createCourse(payload);
      }
      navigate("/courses");
    } catch (e: any) {
      setErr(e?.message ?? "Erro ao salvar curso");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">{isEdit ? "Editar curso" : "Novo curso"}</h1>

      {err && <p className="mb-4 rounded-md bg-red-50 p-3 text-red-700">{err}</p>}

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Título</label>
          <input
            className="rounded-md border p-2"
            placeholder="Ex.: Curso de Typescript"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="rounded-md border p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            required
          >
            <option value="">Selecione...</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Criado em (DD/MM/AAAA) — opcional</label>
          <input
            className="rounded-md border p-2"
            placeholder="DD/MM/AAAA"
            value={createdBR}
            onChange={(e) => setCreatedBR(e.target.value)}
          />
        </div>

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="rounded-md border px-4 py-2 hover:bg-zinc-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
