import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// IMPORTS **COM EXTENSÃO** PARA FORÇAR O RESOLVER DO VITE
import CoursesPage from "./pages/CoursesPage.tsx";
import OffersPage from "./pages/OffersPage.tsx";
import CourseForm from "./components/CourseForm.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/new" element={<CourseForm />} />
        <Route path="/courses/:id/edit" element={<CourseForm />} />
        <Route path="/offers" element={<OffersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
