type Props = { status: "ativo" | "inativo" };

export default function StatusBadge({ status }: Props) {
  const active = status === "ativo";
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
        (active
          ? "bg-green-100 text-green-800 ring-1 ring-green-200"
          : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200")
      }
      title={active ? "Curso ativo" : "Curso inativo"}
    >
      {status}
    </span>
  );
}
