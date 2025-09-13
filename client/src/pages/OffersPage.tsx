// client/src/pages/OffersPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfferCard from "../components/OfferCard";
import { listOffers, listCourses, type Offer, type Course } from "../lib/api";

type OfferWithCourse = Offer & { course?: Course | null };

export default function OffersPage() {
  const nav = useNavigate();

  const [offers, setOffers] = useState<OfferWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setLoading(true);
        setLoadError(null);

        // Busca ofertas e cursos em paralelo
        const [offersRaw, courses] = await Promise.all([
          listOffers(),
          listCourses(),
        ]);

        // Junta cada oferta ao seu curso
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

  if (loading) {
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

      {offers.length === 0 ? (
        <p className="text-zinc-600">Nenhuma oferta cadastrada.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {offers.map((o) => (
            <li key={o.id}>
              <OfferCard offer={o} onEdit={() => nav(`/offers/${o.id}/edit`)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
