import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  const item = (to: string, label: string) => (
    <Link
      to={to}
      className={[
        "px-3 py-2 rounded-md text-sm",
        pathname.startsWith(to)
          ? "bg-zinc-900 text-white"
          : "text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/courses" className="text-lg font-semibold">
          Catálogo EAD
        </Link>
        <nav className="flex gap-2">
          {item("/courses", "Cursos")}
          {item("/offers", "Ofertas")}
        </nav>
      </div>
    </header>
  );
}
