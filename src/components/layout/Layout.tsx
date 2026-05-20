import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";
import { useLocalStorage } from "../../hooks/useShared";

export function Layout({ children }: { children: ReactNode }) {
  const [theme] = useLocalStorage("expbox_theme", "minimal");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col font-sans w-full">
      <Navbar />
      <MobileHeader />
      {/* pb-20 prevents content from hiding behind the fixed mobile bottom nav */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto pb-20 md:pb-8 pt-0 md:pt-6 px-0 sm:px-6 lg:px-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
