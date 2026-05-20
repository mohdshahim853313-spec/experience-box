import { CATEGORIES } from "../../services/data";
import { cn } from "../../lib/utils";

interface CategoryScrollerProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export function CategoryScroller({ activeCategory, onSelectCategory }: CategoryScrollerProps) {
  return (
    <div className="w-full relative pb-1">
      <div className="overflow-x-auto scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex space-x-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  "whitespace-nowrap px-5 py-1.5 rounded-full text-[14px] font-medium transition-all shadow-sm",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
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
