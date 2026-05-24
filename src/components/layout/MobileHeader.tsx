import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ArrowLeft, Box } from "lucide-react";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { useLocalStorage } from "../../hooks/useShared";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { initAuth } from "../../lib/auth";

export function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const scrollDirection = useScrollDirection();
  const [notifications] = useLocalStorage<any[]>("expbox_notifications", []);
  const hasUnread = notifications.some(n => !n.read);
  
  const [user] = useLocalStorage("expbox_user_profile", {
    name: "Mohd Shahim",
    email: "mohdshahim853313@gmail.com",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Shahim"
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => setIsAuthenticated(true),
      () => setIsAuthenticated(false)
    );
    return () => unsubscribe();
  }, []);

  return (
    <header className={cn(
      "md:hidden sticky top-0 z-50 w-full h-14 glass flex items-center justify-between px-4 border-b border-slate-200 transition-transform duration-300",
      scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
    )}>
      <div className="flex items-center gap-2">
        {!isHome && (
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-[color:var(--text-primary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1 rounded text-white font-bold text-sm flex items-center justify-center w-7 h-7">
            <Box className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-[color:var(--text-primary)]">ExperienceBox</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link to="/profile" className="h-7 w-7 rounded-full bg-slate-300 overflow-hidden border border-white cursor-pointer mr-1">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </Link>
        ) : (
          <Link to="/login" className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors mr-1">
            Log in
          </Link>
        )}
        <Link to="/notifications" className="relative p-1.5 text-[color:var(--text-primary)] opacity-80 hover:opacity-100">
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[color:var(--bg-primary)]"></span>
          )}
        </Link>
      </div>
    </header>
  );
}
