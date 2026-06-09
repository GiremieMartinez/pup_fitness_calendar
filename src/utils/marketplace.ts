import type { DatePosted, Listing, SearchFilters } from "../types";

export const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number) {
  return currency.format(price).replace("PHP", "PHP ");
}

export function postedLabel(daysAgo: number) {
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return `${daysAgo} days ago`;
}

export function matchesDateRange(daysAgo: number, datePosted: DatePosted) {
  if (datePosted === "Anytime") return true;
  if (datePosted === "24h") return daysAgo <= 1;
  if (datePosted === "7d") return daysAgo <= 7;
  return daysAgo <= 30;
}

export function filterListings(listings: Listing[], filters: SearchFilters) {
  const query = filters.query.trim().toLowerCase();

  return listings.filter((listing) => {
    const haystack = [
      listing.title,
      listing.brand,
      listing.category,
      listing.condition,
      listing.location,
      listing.description,
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !query || haystack.includes(query);
    const priceMatch =
      listing.price >= filters.minPrice && listing.price <= filters.maxPrice;
    const conditionMatch =
      filters.condition.length === 0 || filters.condition.includes(listing.condition);
    const radiusMatch = listing.distanceMiles <= filters.radius;
    const categoryMatch =
      filters.categories.length === 0 || filters.categories.includes(listing.category);
    const dateMatch = matchesDateRange(listing.postedDaysAgo, filters.datePosted);
    const sellerMatch =
      filters.sellerTypes.length === 0 ||
      filters.sellerTypes.includes(listing.seller.type);

    return (
      queryMatch &&
      priceMatch &&
      conditionMatch &&
      radiusMatch &&
      categoryMatch &&
      dateMatch &&
      sellerMatch
    );
  });
}

export function sortListings(listings: Listing[], sort: string) {
  const copy = [...listings];

  if (sort === "price-low") return copy.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return copy.sort((a, b) => b.price - a.price);
  if (sort === "distance") return copy.sort((a, b) => a.distanceMiles - b.distanceMiles);
  if (sort === "date") return copy.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

  return copy.sort((a, b) => {
    const sellerScore = b.seller.rating - a.seller.rating;
    if (sellerScore !== 0) return sellerScore;
    return a.postedDaysAgo - b.postedDaysAgo;
  });
}

export function getActiveFilterLabels(filters: SearchFilters) {
  const labels: Array<{ key: keyof SearchFilters | string; value: string }> = [];

  if (filters.query) labels.push({ key: "query", value: `Search: ${filters.query}` });
  if (filters.minPrice > 0) {
    labels.push({ key: "minPrice", value: `Min ${formatPrice(filters.minPrice)}` });
  }
  if (filters.maxPrice < 75000) {
    labels.push({ key: "maxPrice", value: `Max ${formatPrice(filters.maxPrice)}` });
  }
  filters.condition.forEach((condition) =>
    labels.push({ key: `condition-${condition}`, value: condition }),
  );
  filters.categories.forEach((category) =>
    labels.push({ key: `category-${category}`, value: category }),
  );
  if (filters.radius < 50) labels.push({ key: "radius", value: `${filters.radius} mi` });
  if (filters.datePosted !== "Anytime") {
    labels.push({ key: "datePosted", value: `Posted: ${filters.datePosted}` });
  }
  filters.sellerTypes.forEach((sellerType) =>
    labels.push({ key: `seller-${sellerType}`, value: sellerType }),
  );

  return labels;
}

export function buildListingPath(id: string) {
  return `/listing/${id}`;
}
