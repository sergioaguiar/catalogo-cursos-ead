// client/src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";

import CoursesPage from "./pages/CoursesPage.tsx";
import OffersPage from "./pages/OffersPage.tsx";
import CourseForm from "./components/CourseForm.tsx";
import OfferForm from "./components/OfferForm.tsx";
import Navbar from "./components/Navbar.tsx";
import OfferFormPage from "./pages/OfferFormPage";

import { listCourses, type Course } from "./lib/api";

function NewOfferPage() {
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Carregando cursos…</p>;

  return (
    <OfferForm
      initial={null}
      courses={courses}
      onSaved={() => nav("/offers")}
      onCancel={() => nav("/offers")}
    />
  );
}

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

          {/* específicas antes das genéricas */}
          <Route path="/courses/:id/edit" element={<CourseForm />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses" element={<CoursesPage />} />

          <Route path="/offers/:id/edit" element={<OfferFormPage />} />
          <Route path="/offers/new" element={<NewOfferPage />} />
          <Route path="/offers" element={<OffersPage />} />

          <Route path="*" element={<Navigate to="/courses" replace />} />
        </Routes>
      </Container>

      {/* Rodapé */}
      <footer className="mt-12 border-t bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-300">
          Fonte do logo:{" "}
          <a
            href="https://br.freepik.com/vetores-gratis/ilustracao-do-conceito-abstrato-da-plataforma-da-escola-online-ensino-domestico-plataforma-de-educacao-online-aulas-digitais-cursos-virtuais-lms-para-a-escola_12145615.htm#fromView=keyword&page=1&position=0&uuid=ba1cc70d-f72c-4055-83e5-87318c33e749&query=Educacao+svg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Freepik
          </a>
        </div>
      </footer>
    </BrowserRouter>
  );
}
