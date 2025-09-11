// client/src/components/CourseCard.tsx
import type { Course } from "../lib/api";
import { formatISOToBR } from "../lib/dates"; // adicione o import no topo

type Props = {
  course: Course;
  onEdit?: (c: Course) => void;
  onDelete?: (id: number) => void;
};

export default function CourseCard({ course, onEdit, onDelete }: Props) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <span
          className={`rounded-full px-3 py-1 text-xs ${
            course.status === "ativo" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {course.status}
        </span>
      </header>

     

	  <p className="text-sm text-zinc-500">Criado em {formatISOToBR(course.created_at)}</p>


      <footer className="mt-3 flex gap-2">
        <button className="btn btn-sm" onClick={() => onEdit?.(course)}>Editar</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(course.id)}>Remover</button>
      </footer>
    </article>
  );
}
