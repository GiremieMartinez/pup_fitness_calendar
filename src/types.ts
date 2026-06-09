import type { LucideIcon } from "lucide-react";

export type ListingCondition = "New" | "Like new" | "Good" | "Fair";
export type SellerType = "Individual" | "Business";
export type DatePosted = "Anytime" | "24h" | "7d" | "30d";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  children?: string[];
}

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  rating: number;
  responseRate: number;
  memberSince: string;
  location: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  brand: string;
  condition: ListingCondition;
  seller: Seller;
  location: string;
  distanceMiles: number;
  postedDate: string;
  postedDaysAgo: number;
  description: string;
  images: string[];
  saved?: boolean;
  specs: Record<string, string>;
}

export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  condition: ListingCondition[];
  radius: number;
  categories: string[];
  datePosted: DatePosted;
  sellerTypes: SellerType[];
}

export interface ListingDraft {
  photos: string[];
  title: string;
  brand: string;
  category: string;
  condition: ListingCondition | "";
  description: string;
  price: string;
  location: string;
}
