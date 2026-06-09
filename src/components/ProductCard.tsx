import { Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Listing } from "../types";
import { buildListingPath, formatPrice, postedLabel } from "../utils/marketplace";
import { useToast } from "./ui/Toast";

interface ProductCardProps {
  listing: Listing;
  compact?: boolean;
}

export function ProductCard({ listing, compact = false }: ProductCardProps) {
  const { notify } = useToast();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link
        to={buildListingPath(listing.id)}
        className="block focus-visible:outline-offset-[-3px]"
        aria-label={`View ${listing.title}`}
      >
        <div className={compact ? "aspect-[4/3] bg-slate-100" : "aspect-square bg-slate-100"}>
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={buildListingPath(listing.id)}
              className="line-clamp-2 text-base font-bold text-slate-950 hover:text-blue-700"
            >
              {listing.title}
            </Link>
            <p className="mt-1 text-lg font-extrabold text-slate-950">
              {formatPrice(listing.price)}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              notify(
                listing.saved
                  ? "Saved item is already in your favorites."
                  : `${listing.title} saved.`,
              )
            }
            aria-label={`Save ${listing.title}`}
            className="min-h-11 min-w-11 rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Heart
              className={`mx-auto h-5 w-5 ${listing.saved ? "fill-blue-700 text-blue-700" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-auto space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" aria-hidden="true" />
            <span>
              {listing.location} · {listing.distanceMiles} mi
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {listing.condition}
            </span>
            <span>{postedLabel(listing.postedDaysAgo)}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            <span className="font-semibold">{listing.seller.rating.toFixed(1)}</span>
            <span className="text-slate-500">seller rating</span>
          </div>
        </div>
      </div>
    </article>
  );
}
