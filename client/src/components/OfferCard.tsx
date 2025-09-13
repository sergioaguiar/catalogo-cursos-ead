// client/src/components/OfferCard.tsx
import { useMemo } from "react";
import { type Offer, type Course } from "../lib/api";

export type OfferFull = Offer & { course?: Course | null };

type Props = {
  offer: OfferFull;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function OfferCard({ offer, onEdit, onDelete }: Props) {
  // Formatação "De ... até ..."
  const periodText = useMemo(() => {
    const start = new Date(offer.period_start);
    const end = new Date(offer.period_end);
    const opts: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const startStr = isNaN(start.getTime())
      ? "-"
      : start.toLocaleDateString("pt-BR", opts);
    const endStr = isNaN(end.getTime())
      ? "-"
      : end.toLocaleDateString("pt-BR", opts);
    return `De ${startStr} até ${endStr}`;
  }, [offer.period_start, offer.period_end]);

  return (
    <article className="rounded-2xl border border-gray-200 p-4 shadow hover:shadow-md transition">
      <header className="mb-2">
        <h3 className="text-lg font-semibold">
          {offer.course?.title ?? `Curso #${offer.course_id}`}
        </h3>
      </header>

      <p className="text-sm text-gray-600">{periodText}</p>

      <footer className="mt-4 flex items-center gap-2">
        <button className="btn" onClick={() => onEdit?.(offer.id)}>
          Editar
        </button>
        <button className="btn btn-danger" onClick={() => onDelete?.(offer.id)}>
          Remover
        </button>
      </footer>
    </article>
  );
}
