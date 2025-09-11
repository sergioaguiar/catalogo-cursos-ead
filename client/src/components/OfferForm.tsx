import { useEffect, useMemo, useState } from "react";
import { Course, Offer, createOffer, updateOffer } from "../lib/api";
import { formatISOToBR, formatBRToISO } from "../lib/dates";

type Props = {
  /** null => nova oferta (campos vazios) */
  initial: Offer | null;
  /** cursos carregados fora (wrapper/rota) */
  courses: Course[];
  /** callback após salvar com sucesso */
  onSaved: () => void;
  /** callback ao cancelar */
  onCancel: () => void;
};

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

// Helper local para não depender do api.ts
function isActive(c?: Course) {
  if (!c?.status) return false;
  const st = String(c.status).trim().toLowerCase();
  return st === "ativo" || st === "active";
}

export default function OfferForm({ initial, courses, onSaved, onCancel }: Props) {
  const [courseId, setCourseId] = useState<string>(initial ? String(initial.course_id) : "");
  const [startBR, setStartBR] = useState<string>(initial ? formatISOToBR(initial.period_start) : "");
  const [endBR, setEndBR] = useState<string>(initial ? formatISOToBR(initial.period_end) : "");
  const [createdAtBR, setCreatedAtBR] = useState<string>(
    initial ? formatISOToBR(initial.created_at) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Regras:
   * - Nova oferta: listar somente cursos ativos
   * - Editar: listar cursos ativos + o curso atual (mesmo se inativo)
   */
  const selectableCourses: Course[] = useMemo(() => {
    const onlyActives = courses.filter(isActive);

    if (!initial) {
      // criação
      return [...onlyActives].sort((a, b) => collator.compare(a.title, b.title));
    }

    // edição
    const current = courses.find((c) => c.id === initial.course_id);
    const base = [...onlyActives];
    if (current && !isActive(current) && !base.some((c) => c.id === current.id)) {
      base.push(current);
    }
    return base.sort((a, b) => collator.compare(a.title, b.title));
  }, [courses, initial]);

  useEffect(() => {
    // se estiver criando e não houver seleção, tente pré-selecionar o primeiro ativo
    if (!initial && !courseId && selectableCourses.length > 0) {
      setCourseId(String(selectableCourses[0].id));
    }
  }, [initial, courseId, selectableCourses]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!courseId) {
      setError("Selecione um curso.");
      return;
    }
    if (!startBR || !endBR) {
      setError("Preencha as datas de início e fim.");
      return;
    }

    const payload = {
      course_id: Number(courseId),
      period_start: formatBRToISO(startBR), // yyyy-mm-dd
      period_end: formatBRToISO(endBR),
      created_at: createdAtBR ? formatBRToISO(createdAtBR) : undefined,
    };

    try {
      setSaving(true);
      if (initial) {
        await updateOffer(initial.id, payload);
      } else {
        await createOffer(payload as any);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao salvar oferta.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">
        {initial ? "Editar oferta" : "Nova oferta"}
      </h1>

      {error && <p className="rounded-md bg-red-50 p-3 text-red-700">{error}</p>}

      {/* Curso */}
      <div>
        <label htmlFor="course" className="mb-1 block text-sm font-medium text-zinc-700">
          Curso
        </label>
        <select
          id="course"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="input"
          required
        >
          <option value="">Selecione…</option>
          {selectableCourses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
              {!isActive(c) ? " (inativo)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Início</label>
          <input
            className="input"
            placeholder="DD/MM/AAAA"
            value={startBR}
            onChange={(e) => setStartBR(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Fim</label>
          <input
            className="input"
            placeholder="DD/MM/AAAA"
            value={endBR}
            onChange={(e) => setEndBR(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Criado em (opcional)</label>
          <input
            className="input"
            placeholder="DD/MM/AAAA"
            value={createdAtBR}
            onChange={(e) => setCreatedAtBR(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Salvando..." : initial ? "Salvar alterações" : "Criar oferta"}
        </button>
        <button type="button" className="btn" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
