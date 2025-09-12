// client/src/pages/OffersPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OfferCard from "../components/OfferCard";
import { listOffersFull, deleteOffer, type OfferFull } from "../lib/api";

export default function OffersPage() {
  const nav = useNavigate();
  const [offers, setOffers] = useState<OfferFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await listOffersFull();
      setOffers(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar ofertas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Remover esta oferta?")) return;
    try {
      await deleteOffer(id);
      setOffers(curr => curr.filter(o => o.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Erro ao remover");
    }
  }

  const filtered = offers.filter((o) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    const inId = String(o.id).includes(term) || String(o.course_id).includes(term);
    const inTitle = o.course?.title?.toLowerCase().includes(term);
    return inId || inTitle;
  });

  return (
    <section>
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ofertas</h1>
          <p className="text-sm text-zinc-600">
            Listagem carregada de <code>/offers</code> (títulos cruzados de <code>/courses</code>).
          </p>
        </div>
        <Link to="/offers/new" className="btn btn-success">Nova oferta</Link>
      </header>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título do curso ou ID…"
          className="input sm:w-96"
        />
      </div>

      {loading && <p>Carregando…</p>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="text-zinc-600">Nenhuma oferta encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onEdit={(o) => nav(`/offers/new`, { state: { initial: o } })} // abra o form pré-preenchido se seu OfferForm ler location.state.initial
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
