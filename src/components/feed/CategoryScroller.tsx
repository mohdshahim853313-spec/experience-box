import { CATEGORIES } from "../../services/data";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

interface CategoryScrollerProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORY_ICONS: Record<string, { emoji: string, bg: string }> = {
  "All Posts": { emoji: "📚", bg: "bg-blue-100" },
  "Experiences": { emoji: "🧘‍♂️", bg: "bg-amber-100" },
  "Mistakes": { emoji: "❌", bg: "bg-red-100" },
  "Ground Reality": { emoji: "🌍", bg: "bg-emerald-100" },
  "Reality Check": { emoji: "🎭", bg: "bg-purple-100" },
  "Embarrassing": { emoji: "🙈", bg: "bg-pink-100" },
};

export function CategoryScroller({ activeCategory, onSelectCategory }: CategoryScrollerProps) {
  return (
    <div className="w-full relative pb-1">
      <div className="overflow-x-auto scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-3 relative w-max after:block after:w-4 after:flex-shrink-0 sm:after:hidden">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const IconData = CATEGORY_ICONS[cat];
            const emoji = IconData?.emoji;
            return (
              <motion.button
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  "relative whitespace-nowrap flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-[14px] font-medium transition-all duration-300 shadow-sm border",
                  isActive
                    ? "text-white border-transparent"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {emoji && (
                    <span className={cn("flex items-center justify-center w-6 h-6 rounded-full text-[12px]", IconData?.bg)}>
                      {emoji}
                    </span>
                  )}
                  {cat}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Inline styles for hide-scrollbar across browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
