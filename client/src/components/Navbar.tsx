// client/src/components/Navbar.tsx
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-gradient-to-b from-slate-800 to-slate-900 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/courses" className="flex items-center">
          <img
            src={logo}
            alt="Catálogo EAD"
            className="mr-3 h-20 w-20 rounded-full object-cover ring-2 ring-slate-700"
          />
          <span className="self-center text-2xl font-semibold tracking-tight text-white">
            Catálogo EAD
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Cursos
          </NavLink>
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-slate-900"
                  : "text-slate-200 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Ofertas
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
