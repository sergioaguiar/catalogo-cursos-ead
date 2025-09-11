// client/src/lib/dates.ts
export const pad = (n: number) => String(n).padStart(2, "0");

export function formatISOToBR(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Aceita "DD/MM/AAAA" e devolve "AAAA-MM-DD"
export function formatBRToISO(br?: string) {
  if (!br) return "";
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}
