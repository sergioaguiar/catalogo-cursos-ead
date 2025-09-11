// client/src/components/OfferCard.tsx
import type { OfferFull } from "../lib/api";
import { formatISOToBR } from "../lib/dates";

type Props = {
  offer: OfferFull;
  onEdit?: (o: OfferFull) => void;
  onDelete?: (id: number) => void;
};

export default function OfferCard({ offer, onEdit, onDelete }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{offer.course.title}</h3>
      </header>
      <p className="text-sm text-zinc-500">
        {formatISOToBR(offer.period_start)} até {formatISOToBR(offer.period_end)}
      </p>

      <footer className="mt-3 flex gap-2">
        <button className="btn btn-sm" onClick={() => onEdit?.(offer)}>Editar</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(offer.id)}>Remover</button>
      </footer>
    </article>
  );
}
