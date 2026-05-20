import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft } from "lucide-react";

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  return (
    <header className="md:hidden sticky top-0 z-50 w-full h-14 glass flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        {!isHome && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-[color:var(--text-primary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded text-white font-bold text-sm flex items-center justify-center w-7 h-7">
            E
          </div>
          <span className="font-bold tracking-tight text-[color:var(--text-primary)]">ExperienceBox</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/notifications" className="relative p-1.5 text-[color:var(--text-primary)] opacity-80 hover:opacity-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Link>
      </div>
    </header>
  );
}
