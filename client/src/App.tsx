import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// IMPORTS **COM EXTENSÃO** PARA FORÇAR O RESOLVER DO VITE
import CoursesPage from "./pages/CoursesPage.tsx";
import OffersPage from "./pages/OffersPage.tsx";
import CourseForm from "./components/CourseForm.tsx";
import OfferForm from "./components/OfferForm.tsx";

import { useEffect, useState } from "react";
import { listCourses, Course } from "./lib/api";

// Wrapper para nova oferta
function NewOfferPage() {
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando cursos...</p>;

  return (
    <OfferForm
      initial={null}
      courses={courses}
      onSaved={() => nav("/offers")}
      onCancel={() => nav("/offers")}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/new" element={<CourseForm />} />
        <Route path="/courses/:id/edit" element={<CourseForm />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/offers/new" element={<NewOfferPage />} /> {/* nova rota */}
      </Routes>
    </BrowserRouter>
  );
}
