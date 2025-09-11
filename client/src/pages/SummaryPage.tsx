// client/src/pages/SummaryPage.tsx
import { useEffect, useState } from "react";
import { ReportsApi } from "../lib/api";

export default function SummaryPage() {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState<{ courses: number; offers: number } | null>(null);
  const [byStatus, setByStatus] = useState<Record<string, number>>({});
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await ReportsApi.summary();
        setTotals(s.totals);
        setByStatus(s.coursesByStatus);
      } catch (e: any) {
        setErr(e?.message ?? "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Resumo</h1>
      {loading && <div>Carregando...</div>}
      {err && <div className="text-red-600">{err}</div>}
      {!loading && !err && totals && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-zinc-500">Cursos</div>
            <div className="text-3xl font-bold">{totals.courses}</div>
          </div>
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-zinc-500">Ofertas</div>
            <div className="text-3xl font-bold">{totals.offers}</div>
          </div>
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-zinc-500">Por status</div>
            <ul className="mt-2 space-y-1">
              {Object.entries(byStatus).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
