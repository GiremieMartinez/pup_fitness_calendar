import { Bell, Bookmark, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryChips } from "../components/CategoryChips";
import { FilterSidebar } from "../components/FilterSidebar";
import { ProductCard } from "../components/ProductCard";
import { SearchAutocomplete } from "../components/SearchAutocomplete";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import {
  categories,
  listings,
  recentlyViewedIds,
  recommendationTags,
  savedSearches,
  searchSuggestions,
} from "../data/marketplace";
import type { SearchFilters } from "../types";
import { filterListings } from "../utils/marketplace";

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

export function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const navigate = useNavigate();
  const { notify } = useToast();

  const feedListings = useMemo(() => filterListings(listings, filters), [filters]);
  const recentlyViewed = recentlyViewedIds
    .map((id) => listings.find((listing) => listing.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-slate-100 p-5 shadow-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-blue-800 shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              HCI-optimized buying and selling
            </div>
            <div>
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Find relevant items faster with a calm, commerce-only marketplace.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
                Clear navigation, persistent filters, consistent product cards, and
                immediate feedback reduce cognitive load across browsing and selling.
              </p>
            </div>
            <SearchAutocomplete
              value={filters.query}
              suggestions={searchSuggestions}
              onChange={(query) => setFilters((current) => ({ ...current, query }))}
              onSubmit={(query) => navigate(`/search?q=${encodeURIComponent(query)}`)}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Saved searches</h2>
            <p className="mt-1 text-sm text-slate-600">
              Quick access to common intents without repeating filter setup.
            </p>
            <div className="mt-4 space-y-3">
              {savedSearches.map((savedSearch) => (
                <Link
                  key={savedSearch.id}
                  to={`/search?q=${encodeURIComponent(savedSearch.query)}`}
                  className="flex min-h-16 items-start gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <Bookmark className="mt-1 h-5 w-5 flex-none text-blue-700" aria-hidden="true" />
                  <span>
                    <span className="block font-bold text-slate-950">{savedSearch.label}</span>
                    <span className="block text-sm text-slate-600">{savedSearch.filters}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoryChips
        categories={categories}
        activeCategory={filters.categories[0]}
        onSelect={(category) =>
          setFilters((current) => ({
            ...current,
            categories: current.categories.includes(category) ? [] : [category],
          }))
        }
      />

      <section aria-labelledby="recommendations-heading" className="grid gap-3 md:grid-cols-4">
        <h2 id="recommendations-heading" className="sr-only">
          Personalized recommendations
        </h2>
        {recommendationTags.map((tag) => {
          const Icon = tag.icon;
          return (
            <button
              key={tag.label}
              type="button"
              onClick={() => notify(`${tag.label} smart filter applied.`, "info")}
              className="flex min-h-20 items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-slate-950">{tag.label}</span>
                <span className="block text-sm text-slate-600">{tag.value}</span>
              </span>
            </button>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Marketplace feed
              </p>
              <h2 className="text-2xl font-black text-slate-950">Recommended items</h2>
              <p className="mt-1 text-sm text-slate-600">
                {feedListings.length} commerce listings. Social posts and unrelated content are
                intentionally excluded.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => notify("Feed refreshed with current filters.", "info")}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {feedListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Continue browsing
            </p>
            <h2 id="recent-heading" className="text-2xl font-black text-slate-950">
              Recently viewed
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-blue-800 hover:bg-blue-50"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentlyViewed.map(
            (listing) => listing && <ProductCard key={listing.id} listing={listing} compact />,
          )}
        </div>
      </section>
    </div>
  );
}
