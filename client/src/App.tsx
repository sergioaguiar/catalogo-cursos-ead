import { NavLink, Routes, Route } from "react-router-dom";
import CoursesPage from "./pages/CoursesPage";
import OffersPage from "./pages/OffersPage";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl gap-6 p-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-zinc-900" : "text-zinc-500"}`
            }
          >
            Cursos
          </NavLink>
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `font-medium ${isActive ? "text-zinc-900" : "text-zinc-500"}`
            }
          >
            Ofertas
          </NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/offers" element={<OffersPage />} />
      </Routes>
    </div>
  );
}
