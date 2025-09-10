// src/pages/OffersPage.tsx
import { useEffect, useState } from "react";
import OfferCard from "../components/OfferCard";
import type { OfferFull } from "../types";


const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function OffersPage() {
  const [data, setData] = useState<OfferFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch(`${API}/offers/full`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: OfferFull[] = await res.json();
        if (live) setData(json);
      } catch (e: any) {
        if (live) setErr(e?.message ?? "erro");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (loading) return <p className="p-6 text-zinc-500">Carregando…</p>;
  if (err)      return <p className="p-6 text-red-600">Erro: {err}</p>;
  if (!data.length) return <p className="p-6 text-zinc-500">Nenhuma oferta encontrada.</p>;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Ofertas</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map(o => <OfferCard key={o.id} offer={o} />)}
      </div>
    </main>
  );
}
