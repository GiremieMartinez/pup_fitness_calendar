import { Heart, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import { listings } from "../data/marketplace";
import { formatPrice, postedLabel } from "../utils/marketplace";

export function ProductDetailPage() {
  const { id } = useParams();
  const listing = listings.find((item) => item.id === id) ?? listings[0];
  const [activeImage, setActiveImage] = useState(0);
  const { notify } = useToast();

  const similarItems = useMemo(
    () =>
      listings
        .filter((item) => item.id !== listing.id && item.category === listing.category)
        .slice(0, 4),
    [listing],
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: listing.category, href: `/search?q=${encodeURIComponent(listing.category)}` },
          { label: listing.title },
        ]}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="aspect-[4/3] bg-slate-100 lg:aspect-[16/10]">
              <img
                src={listing.images[activeImage]}
                alt={`${listing.title} photo ${activeImage + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="scrollbar-hide flex gap-3 overflow-x-auto p-4" aria-label="Gallery thumbnails">
              {listing.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-pressed={activeImage === index}
                  className={[
                    "h-20 w-24 flex-none overflow-hidden rounded-2xl border-2 transition",
                    activeImage === index ? "border-blue-700" : "border-transparent",
                  ].join(" ")}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  {listing.category}
                </p>
                <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                  {listing.title}
                </h1>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {formatPrice(listing.price)}
                </p>
              </div>
              <span className="inline-flex min-h-11 items-center rounded-full bg-green-50 px-4 text-sm font-bold text-green-800">
                {listing.condition}
              </span>
            </div>

            <dl className="mt-6 grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Location
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">{listing.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Posted
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {postedLabel(listing.postedDaysAgo)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Distance
                </dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {listing.distanceMiles} miles
                </dd>
              </div>
            </dl>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black text-slate-950">Product specifications</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  {Object.entries(listing.specs).map(([label, value]) => (
                    <tr key={label} className="border-b border-slate-200 last:border-0">
                      <th scope="row" className="w-1/3 bg-slate-50 px-4 py-3 font-bold text-slate-700">
                        {label}
                      </th>
                      <td className="px-4 py-3 text-slate-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <details className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6" open>
            <summary className="min-h-11 cursor-pointer text-2xl font-black text-slate-950">
              Description
            </summary>
            <p className="mt-4 max-w-3xl leading-7 text-slate-700">{listing.description}</p>
          </details>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Seller details</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-lg font-black text-blue-800">
                {listing.seller.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-black text-slate-950">{listing.seller.name}</p>
                <p className="text-sm text-slate-600">{listing.seller.type} seller</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  Rating
                </span>
                <strong>{listing.seller.rating.toFixed(1)} / 5</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-700">Response rate</span>
                <strong>{listing.seller.responseRate}%</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-700">Member since</span>
                <strong>{listing.seller.memberSince}</strong>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm text-green-900">
              <ShieldCheck className="mr-2 inline h-4 w-4" aria-hidden="true" />
              Transaction-based seller rating model shown for trust and safety.
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Primary actions</h2>
            <p className="mt-1 text-sm text-slate-600">
              Always visible on desktop and reachable from the mobile bottom nav.
            </p>
            <div className="mt-4 grid gap-3">
              <Button fullWidth onClick={() => notify("Message composer opened.", "info")}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Message seller
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => notify(`${listing.title} saved.`)}
              >
                <Heart className="h-4 w-4" aria-hidden="true" />
                Save item
              </Button>
            </div>
          </div>
        </aside>
      </section>

      <section aria-labelledby="similar-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="similar-heading" className="text-2xl font-black text-slate-950">
            Similar items
          </h2>
          <Link
            to={`/search?q=${encodeURIComponent(listing.category)}`}
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-blue-800 hover:bg-blue-50"
          >
            See all
          </Link>
        </div>
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-3">
          {similarItems.map((item) => (
            <div key={item.id} className="w-72 flex-none">
              <ProductCard listing={item} compact />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
