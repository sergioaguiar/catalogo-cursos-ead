// client/src/pages/OffersPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfferCard from "../components/OfferCard";
import {
  listOffers,
  listCourses,
  deleteOffer,
  type Offer,
  type Course,
} from "../lib/api";

type OfferWithCourse = Offer & { course?: Course | null };

export default function OffersPage() {
  const nav = useNavigate();

  const [offers, setOffers] = useState<OfferWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // filtro por título do curso
  const [q, setQ] = useState("");

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        const [offersRaw, courses] = await Promise.all([
          listOffers(),
          listCourses(),
        ]);

        const byId = new Map<number, Course>(courses.map((c) => [c.id, c]));
        const joined: OfferWithCourse[] = offersRaw.map((o) => ({
          ...o,
          course: byId.get(o.course_id) ?? null,
        }));

        if (!canceled) setOffers(joined);
      } catch (e: any) {
        if (!canceled) setLoadError(e?.message ?? "Falha ao carregar ofertas.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => {
      canceled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return offers.filter((o) =>
      !term ? true : o.course?.title?.toLowerCase().includes(term) ?? false
    );
  }, [offers, q]);

  async function handleDelete(id: number) {
    if (!confirm("Remover esta oferta?")) return;
    try {
      await deleteOffer(id);
      setOffers((curr) => curr.filter((o) => o.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Erro ao remover oferta");
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ofertas</h1>
          <button
            className="btn btn-success"
            onClick={() => nav("/offers/new")}
          >
            Nova oferta
          </button>
        </header>
        <p>Carregando…</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Ofertas</h1>
          <button
            className="btn btn-success"
            onClick={() => nav("/offers/new")}
          >
            Nova oferta
          </button>
        </header>
        <p className="rounded-md bg-red-50 p-3 text-red-700">{loadError}</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ofertas</h1>
        <button className="btn btn-success" onClick={() => nav("/offers/new")}>
          Nova oferta
        </button>
      </header>

      {/* filtro por título do curso */}
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título do curso…"
          className="input sm:w-80"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-600">Nenhuma oferta encontrada.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((o) => (
            <li key={o.id}>
              <OfferCard
                offer={o as any}
                onEdit={() => nav(`/offers/${o.id}/edit`)}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
