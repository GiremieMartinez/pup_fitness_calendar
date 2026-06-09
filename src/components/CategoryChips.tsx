import type { Category } from "../types";

interface CategoryChipsProps {
  categories: Category[];
  activeCategory?: string;
  onSelect?: (categoryName: string) => void;
}

export function CategoryChips({ categories, activeCategory, onSelect }: CategoryChipsProps) {
  return (
    <section aria-labelledby="category-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="category-heading" className="text-lg font-bold text-slate-950">
          Browse categories
        </h2>
        <p className="hidden text-sm text-slate-600 sm:block">
          Reach any category in 3 clicks or fewer
        </p>
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const selected = activeCategory === category.name;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelect?.(category.name)}
              aria-pressed={selected}
              className={[
                "flex min-h-11 flex-none items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                selected
                  ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}
