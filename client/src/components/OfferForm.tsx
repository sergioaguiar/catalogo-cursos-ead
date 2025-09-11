// client/src/components/OfferForm.tsx (trecho principal)
import { useEffect, useState } from "react";
import { Course, Offer, createOffer, updateOffer } from "../lib/api";
import { formatISOToBR, formatBRToISO } from "../lib/dates";

type Props = {
  initial: Offer | null;      // null => NOVA oferta (campos vazios)
  courses: Course[];
  onSaved: () => void;
  onCancel: () => void;
};

export default function OfferForm({ initial, courses, onSaved, onCancel }: Props) {
  const [courseId, setCourseId] = useState<string>(initial ? String(initial.course_id) : "");
  const [startBR, setStartBR] = useState<string>(initial ? formatISOToBR(initial.period_start) : "");
  const [endBR, setEndBR] = useState<string>(initial ? formatISOToBR(initial.period_end) : "");
  const [createdAtBR, setCreatedAtBR] = useState<string>(initial ? formatISOToBR(initial.created_at) : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      course_id: Number(courseId),
      period_start: formatBRToISO(startBR), // => YYYY-MM-DD
      period_end: formatBRToISO(endBR),
      created_at: formatBRToISO(createdAtBR), // se você usa date-time ISO, ajuste o conversor
    };

    if (initial) await updateOffer(initial.id, payload);
    else         await createOffer(payload as any);

    onSaved();
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* select de curso */}
      {/* inputs de data com placeholders DD/MM/AAAA */}
      {/* ...seu markup... */}
      <input
        placeholder="DD/MM/AAAA"
        value={startBR}
        onChange={(e) => setStartBR(e.target.value)}
      />
      <input
        placeholder="DD/MM/AAAA"
        value={endBR}
        onChange={(e) => setEndBR(e.target.value)}
      />
      <input
        placeholder="DD/MM/AAAA"
        value={createdAtBR}
        onChange={(e) => setCreatedAtBR(e.target.value)}
      />
      {/* ...botoes salvar/cancelar... */}
    </form>
  );
}
