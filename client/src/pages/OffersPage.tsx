// client/src/pages/OffersPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OfferCard from "../components/OfferCard";
import { listOffersFull, deleteOffer, type OfferFull } from "../lib/api";

export default function OffersPage() {
  const [items, setItems] = useState<OfferFull[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await listOffersFull();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Remover esta oferta?")) return;
    await deleteOffer(id);
    setItems(prev => prev.filter(o => o.id !== id));
  }

  return (
    <section className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ofertas</h1>
        <Link to="/offers/new" className="btn btn-success">Nova oferta</Link>
      </header>

      {loading ? <p>Carregando…</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(o => (
            <OfferCard
              key={o.id}
              offer={o}
              onEdit={(offer) => nav(`/offers/${offer.id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
