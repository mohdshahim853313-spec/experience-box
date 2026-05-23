import { Link, useLocation } from "react-router-dom";
import { Home, Users, Edit3, Grid, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { useScrollDirection } from "../../hooks/useScrollDirection";

const BOTTOM_LINKS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Following", path: "/following", icon: Users },
  { name: "Write", path: "/write", icon: Edit3 },
  { name: "Spaces", path: "/spaces", icon: Grid },
  { name: "Profile", path: "/profile", icon: User },
];

export function MobileNav() {
  const location = useLocation();
  const scrollDirection = useScrollDirection();

  return (
    <nav className={cn(
      "md:hidden fixed bottom-0 left-0 w-full glass safe-area-pb z-50 px-2 flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)] transition-transform duration-300",
      scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
    )}>
      {BOTTOM_LINKS.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2.5 transition-colors rounded-lg my-1 text-[color:var(--text-primary)]",
              isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
            )}
          >
            <Icon className="w-[22px] h-[22px] mb-1.5" strokeWidth={isActive ? 2.5 : 2} />
            <span className={cn("text-[10px] font-medium leading-none", isActive ? "text-indigo-600" : "")}>
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
