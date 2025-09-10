import type { Course } from "../types";
import StatusBadge from "./StatusBadge";

function fmt(d: string) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

type Props = { course: Course };

export default function CourseCard({ course }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <header className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-tight">{course.title}</h3>
        <StatusBadge status={course.status} />
      </header>
      <p className="text-sm text-zinc-500">
        Criado em <time dateTime={course.created_at}>{fmt(course.created_at)}</time>
      </p>
    </article>
  );
}
