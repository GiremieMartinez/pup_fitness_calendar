import { SlidersHorizontal } from "lucide-react";
import { categories, conditions, sellerTypes } from "../data/marketplace";
import type { DatePosted, ListingCondition, SearchFilters, SellerType } from "../types";
import { Button } from "./ui/Button";

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const dateRanges: Array<{ label: string; value: DatePosted }> = [
  { label: "Anytime", value: "Anytime" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past 7 days", value: "7d" },
  { label: "Past 30 days", value: "30d" },
];

function toggleValue<T>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((current) => current !== value)
    : [...values, value];
}

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Precision filters
          </p>
          <h2 className="text-xl font-bold text-slate-950">Refine results</h2>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>

      <div className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-950">Price range</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Min
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) =>
                  update({ minPrice: Math.max(0, Number(event.target.value)) })
                }
                className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
              />
            </label>
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Max
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) =>
                  update({ maxPrice: Math.max(filters.minPrice, Number(event.target.value)) })
                }
                className="min-h-11 w-full rounded-xl border border-slate-300 px-3 text-slate-950"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Max price slider
            <input
              type="range"
              min="1000"
              max="75000"
              step="500"
              value={filters.maxPrice}
              onChange={(event) => update({ maxPrice: Number(event.target.value) })}
              className="mt-2 w-full accent-blue-700"
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-950">Condition</legend>
          <div className="grid grid-cols-2 gap-2">
            {conditions.map((condition) => (
              <label
                key={condition}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={filters.condition.includes(condition)}
                  onChange={() =>
                    update({
                      condition: toggleValue<ListingCondition>(filters.condition, condition),
                    })
                  }
                  className="h-4 w-4 accent-blue-700"
                />
                {condition}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block space-y-2 text-sm font-bold text-slate-950">
          Location radius
          <span className="block text-sm font-medium text-slate-600">
            Within {filters.radius} miles
          </span>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.radius}
            onChange={(event) => update({ radius: Number(event.target.value) })}
            className="w-full accent-blue-700"
          />
        </label>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-950">Categories</legend>
          <div className="space-y-2">
            {categories.slice(0, 7).map((category) => {
              const Icon = category.icon;

              return (
                <label
                  key={category.id}
                  className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.name)}
                    onChange={() =>
                      update({
                        categories: toggleValue<string>(filters.categories, category.name),
                      })
                    }
                    className="h-4 w-4 accent-blue-700"
                  />
                  <Icon className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  {category.name}
                </label>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-950">Date posted</legend>
          <div className="space-y-2">
            {dateRanges.map((range) => (
              <label
                key={range.value}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700"
              >
                <input
                  type="radio"
                  name="date-posted"
                  checked={filters.datePosted === range.value}
                  onChange={() => update({ datePosted: range.value })}
                  className="h-4 w-4 accent-blue-700"
                />
                {range.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-slate-950">Seller type</legend>
          <div className="grid grid-cols-2 gap-2">
            {sellerTypes.map((sellerType) => (
              <label
                key={sellerType}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-medium text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={filters.sellerTypes.includes(sellerType)}
                  onChange={() =>
                    update({
                      sellerTypes: toggleValue<SellerType>(filters.sellerTypes, sellerType),
                    })
                  }
                  className="h-4 w-4 accent-blue-700"
                />
                {sellerType}
              </label>
            ))}
          </div>
        </fieldset>

        <Button variant="secondary" fullWidth onClick={onReset}>
          Reset all filters
        </Button>
      </div>
    </aside>
  );
}
