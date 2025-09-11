import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Páginas/Componentes
import CoursesPage from "./pages/CoursesPage.tsx";
import OffersPage from "./pages/OffersPage.tsx";
import CourseForm from "./components/CourseForm.tsx";
import OfferForm from "./components/OfferForm.tsx";
import Navbar from "./components/Navbar.tsx";

// API
import { listCourses, type Course } from "./lib/api";

// Wrapper para /offers/new (carrega cursos e define navegação pós-salvar/cancelar)
function NewOfferPage() {
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Carregando cursos...</p>;

  return (
    <OfferForm
      initial={null}
      courses={courses}
      onSaved={() => nav("/offers")}
      onCancel={() => nav("/offers")}
    />
  );
}

// Container para padronizar espaçamento
function Container({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id/edit" element={<CourseForm />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/new" element={<NewOfferPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
