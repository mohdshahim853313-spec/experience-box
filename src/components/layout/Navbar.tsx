import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Edit3, Grid, User as UserIcon, Search, Bell, ArrowLeft, Box } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLocalStorage } from "../../hooks/useShared";
import { useState, useEffect } from "react";
import { initAuth } from "../../lib/auth";

const NAV_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Following", path: "/following", icon: Users },
  { name: "Write", path: "/write", icon: Edit3 },
  { name: "Spaces", path: "/spaces", icon: Grid },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
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

  const [notifications] = useLocalStorage<any[]>("expbox_notifications", []);
  const hasUnread = notifications.some(n => !n.read);

  return (
    <header className="hidden md:flex sticky top-0 z-50 w-full h-16 glass shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center flex-1 justify-start">
          <div className="w-10">
            <button 
              onClick={() => !isHome && navigate(-1)} 
              disabled={isHome}
              className={cn(
                "p-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all duration-300 rounded-full hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20",
                isHome ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
              )}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <Link to="/" className="flex items-center gap-2 -ml-1">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white font-bold text-lg leading-none flex items-center justify-center w-8 h-8 cursor-pointer">
              <Box className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[color:var(--text-primary)]">ExperienceBox</span>
          </Link>
        </div>

        {/* Center Nav */}
        <nav className="flex items-center gap-2 lg:gap-8 justify-center max-w-2xl px-8 h-full font-medium text-[color:var(--text-primary)]">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center justify-center h-16 border-b-2 transition-all duration-300 focus:outline-none gap-1.5 text-[color:var(--text-primary)] hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 px-4 hover:text-indigo-600 dark:hover:text-indigo-400",
                  isActive
                    ? "border-indigo-600 text-indigo-600 opacity-100"
                    : "border-transparent text-[color:var(--text-primary)] opacity-70 cursor-pointer"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] transition-colors duration-200", isActive ? "text-indigo-600" : "")} strokeWidth={2} />
                <span className={cn("text-[15px] font-semibold transition-colors duration-200", isActive ? "text-indigo-600" : "")}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-4 flex-1">
          <Link to="/notifications" className="p-2 text-[color:var(--text-primary)] opacity-80 hover:opacity-100 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-all duration-300 relative">
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-indigo-900"></span>
            )}
          </Link>

          {!isAuthenticated && (
            <Link to="/login" className="text-sm font-bold text-[color:var(--text-primary)] bg-slate-500/10 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 px-4 py-2 rounded-full transition-all duration-300 truncate">
              Log in
            </Link>
          )}
          
          <Link to="/profile" className="h-9 w-9 rounded-full bg-slate-300 overflow-hidden border-2 border-[color:var(--bg-primary)] hover:scale-110 transition-transform cursor-pointer">
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          </Link>

          <Link
            to="/write"
            className="hidden lg:flex items-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_10px_rgba(79,70,229,0.4)] rounded-full px-5 py-2 text-sm font-semibold transition-all hover:-translate-y-0.5 gap-2"
          >
            <Edit3 className="w-[18px] h-[18px]" strokeWidth={2.5} />
            Add Story
          </Link>
        </div>
      </div>
    </header>
  );
}
