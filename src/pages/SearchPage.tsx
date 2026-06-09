import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FilterSidebar } from "../components/FilterSidebar";
import { ProductCard } from "../components/ProductCard";
import { SearchAutocomplete } from "../components/SearchAutocomplete";
import { ProductGridSkeleton } from "../components/Skeleton";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { listings, searchSuggestions } from "../data/marketplace";
import type { SearchFilters } from "../types";
import {
  filterListings,
  getActiveFilterLabels,
  sortListings,
} from "../utils/marketplace";

const defaultFilters: SearchFilters = {
  query: "",
  minPrice: 0,
  maxPrice: 75000,
  condition: [],
  radius: 50,
  categories: [],
  datePosted: "Anytime",
  sellerTypes: [],
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [filters, setFilters] = useState<SearchFilters>({ ...defaultFilters, query: initialQuery });
  const [sort, setSort] = useState("relevance");
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const timer = window.setTimeout(() => setIsLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, [filters, sort]);

  const results = useMemo(() => {
    return sortListings(filterListings(listings, filters), sort);
  }, [filters, sort]);

  const activeFilters = getActiveFilterLabels(filters);

  function updateQuery(query: string) {
    setFilters((current) => ({ ...current, query }));
    if (query) setParams({ q: query });
    else setParams({});
  }

  function removeFilter(key: string) {
    setFilters((current) => {
      if (key === "query") return { ...current, query: "" };
      if (key === "minPrice") return { ...current, minPrice: defaultFilters.minPrice };
      if (key === "maxPrice") return { ...current, maxPrice: defaultFilters.maxPrice };
      if (key === "radius") return { ...current, radius: defaultFilters.radius };
      if (key === "datePosted") return { ...current, datePosted: "Anytime" };
      if (key.startsWith("condition-")) {
        const condition = key.replace("condition-", "");
        return {
          ...current,
          condition: current.condition.filter((value) => value !== condition),
        } as SearchFilters;
      }
      if (key.startsWith("category-")) {
        const category = key.replace("category-", "");
        return {
          ...current,
          categories: current.categories.filter((value) => value !== category),
        };
      }
      if (key.startsWith("seller-")) {
        const sellerType = key.replace("seller-", "");
        return {
          ...current,
          sellerTypes: current.sellerTypes.filter((value) => value !== sellerType),
        } as SearchFilters;
      }
      return current;
    });
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Search results" }]} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Search marketplace
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Find exactly what you need</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Autocomplete, facets, active chips, and clear result counts support recognition
              instead of recall.
            </p>
          </div>
          <label className="min-w-56 text-sm font-bold text-slate-700">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-950"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="distance">Distance</option>
              <option value="date">Date posted</option>
            </select>
          </label>
        </div>

        <div className="mt-5">
          <SearchAutocomplete
            value={filters.query}
            suggestions={searchSuggestions}
            onChange={updateQuery}
            onSubmit={(query) => {
              updateQuery(query);
              notify("Search updated.", "info");
            }}
          />
        </div>

        <details className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between text-sm font-bold text-slate-800">
            Smart filter suggestions
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Like new", "Within 10 miles", "Business sellers", "Posted this week"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => notify(`${label} suggestion noted.`, "info")}
                  className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </details>
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={() => {
            setFilters(defaultFilters);
            setParams({});
          }}
        />

        <section aria-labelledby="results-heading" className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 id="results-heading" className="text-xl font-black text-slate-950">
                  {isLoading ? "Loading results" : `${results.length} results`}
                </h2>
                <p className="text-sm text-slate-600">
                  Results use simulated loading under 2 seconds with skeleton feedback.
                </p>
              </div>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilters(defaultFilters);
                    setParams({});
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {activeFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
                {activeFilters.map((filter) => (
                  <button
                    type="button"
                    key={filter.key}
                    onClick={() => removeFilter(filter.key)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-50 px-4 text-sm font-bold text-blue-800 hover:bg-blue-100"
                  >
                    {filter.value}
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-xl font-black text-slate-950">No matching listings</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                Remove a filter, increase your radius, or save this search to get alerts when a
                matching item appears.
              </p>
              <Button
                className="mt-5"
                onClick={() => notify("Search saved. We will alert you when matches appear.")}
              >
                Save this search
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
