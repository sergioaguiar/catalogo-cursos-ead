// client/src/pages/OfferFormPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OfferForm from "../components/OfferForm";
import { listCourses, getOffer, type Course, type Offer } from "../lib/api";

export default function OfferFormPage() {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const nav = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [initial, setInitial] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const [cs, off] = await Promise.all([
          listCourses(),
          editing ? getOffer(Number(id)) : Promise.resolve(null),
        ]);
        if (canceled) return;
        setCourses(cs);
        setInitial(off as Offer | null);
      } catch (e: any) {
        if (!canceled) setLoadError(e?.message ?? "Falha ao carregar dados.");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [editing, id]);

  if (loading) {
    return (
      <section className="container mx-auto p-4">
        <p>Carregando…</p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="container mx-auto p-4">
        <p className="rounded-md bg-red-50 p-3 text-red-700">{loadError}</p>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-4">
      <OfferForm
        initial={editing ? initial : null}
        courses={courses}
        onSaved={() => nav("/offers")}
        onCancel={() => nav(-1)}
      />
    </section>
  );
}
