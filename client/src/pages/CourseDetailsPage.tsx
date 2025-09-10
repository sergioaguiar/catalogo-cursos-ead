import { useParams } from "react-router-dom";

export default function CourseDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold">Detalhes do Curso</h1>
      <p>Você está vendo o curso ID: {id}</p>
    </div>
  );
}
