// client/src/lib/dates.ts
export const pad = (n: number) => String(n).padStart(2, "0");

export function formatISOToBR(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + 1); // 👈 soma 1 dia SEMPRE
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// "DD/MM/AAAA" -> "AAAA-MM-DD"
export function formatBRToISO(br?: string) {
  if (!br) return "";
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  d.setDate(d.getDate() + 1); // 👈 soma 1 dia ANTES de salvar
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// útil para created_at
export function toLocalISODate(d: Date) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + 1); // 👈 soma 1 dia
  return `${copy.getFullYear()}-${pad(copy.getMonth() + 1)}-${pad(copy.getDate())}`;
}

export function normalizeISO(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + 1); // 👈 soma 1 dia
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
