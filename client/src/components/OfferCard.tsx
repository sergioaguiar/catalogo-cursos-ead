// src/components/OfferCard.tsx
import type { OfferFull } from "../types";

function fmtDate(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

type Props = { offer: OfferFull };

export default function OfferCard({ offer }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <header className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight">
          {offer.course?.title ?? `Curso #${offer.course_id}`}
        </h3>
        <span className="text-xs rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
          {offer.period_start} → {offer.period_end}
        </span>
      </header>

      <p className="text-sm text-zinc-500">
        Criada em <time dateTime={offer.created_at}>{fmtDate(offer.created_at)}</time>
      </p>
    </article>
  );
}
