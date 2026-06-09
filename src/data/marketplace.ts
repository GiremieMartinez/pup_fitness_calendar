import {
  Armchair,
  Bike,
  BriefcaseBusiness,
  Camera,
  Car,
  Gamepad2,
  Home,
  Laptop,
  Shirt,
  Sofa,
  Sparkles,
  Watch,
} from "lucide-react";
import type { Category, Listing, ListingCondition, SellerType } from "../types";

export const categories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: Laptop,
    children: ["Computers", "Cameras", "Audio", "Gaming"],
  },
  {
    id: "home",
    name: "Home",
    icon: Home,
    children: ["Furniture", "Kitchen", "Decor", "Garden"],
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: Sofa,
    children: ["Sofas", "Tables", "Storage", "Office"],
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: Car,
    children: ["Cars", "Bikes", "Parts", "Accessories"],
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    children: ["Women", "Men", "Shoes", "Bags"],
  },
  {
    id: "sports",
    name: "Sports",
    icon: Bike,
    children: ["Cycling", "Fitness", "Outdoors", "Team Sports"],
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: Watch,
    children: ["Watches", "Art", "Vintage", "Trading Cards"],
  },
  {
    id: "services",
    name: "Services",
    icon: BriefcaseBusiness,
    children: ["Repair", "Lessons", "Moving", "Cleaning"],
  },
];

const sellers = {
  maya: {
    id: "seller-maya",
    name: "Maya Santos",
    type: "Individual" as SellerType,
    rating: 4.9,
    responseRate: 96,
    memberSince: "2021",
    location: "Quezon City",
  },
  urban: {
    id: "seller-urban",
    name: "Urban Renew Co.",
    type: "Business" as SellerType,
    rating: 4.8,
    responseRate: 91,
    memberSince: "2019",
    location: "Makati",
  },
  leo: {
    id: "seller-leo",
    name: "Leo Ramirez",
    type: "Individual" as SellerType,
    rating: 4.7,
    responseRate: 88,
    memberSince: "2020",
    location: "Pasig",
  },
  clara: {
    id: "seller-clara",
    name: "Clara Home Studio",
    type: "Business" as SellerType,
    rating: 5,
    responseRate: 99,
    memberSince: "2018",
    location: "Taguig",
  },
};

export const listings: Listing[] = [
  {
    id: "sony-a6400-camera-kit",
    title: "Sony A6400 mirrorless camera kit",
    price: 38900,
    category: "Electronics",
    brand: "Sony",
    condition: "Like new",
    seller: sellers.maya,
    location: "Quezon City",
    distanceMiles: 3.8,
    postedDate: "2026-06-07",
    postedDaysAgo: 2,
    description:
      "Lightly used Sony A6400 with 16-50mm lens, two batteries, charger, strap, and padded camera bag. Clean sensor and shutter count under 8,000.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
    ],
    saved: true,
    specs: {
      Brand: "Sony",
      Category: "Electronics > Cameras",
      Condition: "Like new",
      Location: "Quezon City",
      "Posted date": "June 7, 2026",
    },
  },
  {
    id: "ergonomic-office-chair",
    title: "Ergonomic office chair with lumbar support",
    price: 7200,
    category: "Furniture",
    brand: "ErgoFlex",
    condition: "Good",
    seller: sellers.urban,
    location: "Makati",
    distanceMiles: 6.4,
    postedDate: "2026-06-08",
    postedDaysAgo: 1,
    description:
      "Adjustable office chair with breathable mesh, 4D armrests, tilt lock, and strong lumbar support. Ideal for hybrid work setups.",
    images: [
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "ErgoFlex",
      Category: "Furniture > Office",
      Condition: "Good",
      Location: "Makati",
      "Posted date": "June 8, 2026",
    },
  },
  {
    id: "city-commuter-bike",
    title: "Lightweight city commuter bicycle",
    price: 14500,
    category: "Sports",
    brand: "Trek",
    condition: "Good",
    seller: sellers.leo,
    location: "Pasig",
    distanceMiles: 4.9,
    postedDate: "2026-06-03",
    postedDaysAgo: 6,
    description:
      "Reliable daily commuter with recently serviced brakes, puncture-resistant tires, rear rack, bell, and integrated lights.",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "Trek",
      Category: "Sports > Cycling",
      Condition: "Good",
      Location: "Pasig",
      "Posted date": "June 3, 2026",
    },
  },
  {
    id: "minimalist-oak-dining-table",
    title: "Minimalist oak dining table",
    price: 18800,
    category: "Home",
    brand: "Muji",
    condition: "Like new",
    seller: sellers.clara,
    location: "Taguig",
    distanceMiles: 8.7,
    postedDate: "2026-06-01",
    postedDaysAgo: 8,
    description:
      "Six-seat oak dining table with soft rounded corners and a satin finish. No major marks; professionally cleaned before pickup.",
    images: [
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "Muji",
      Category: "Home > Furniture",
      Condition: "Like new",
      Location: "Taguig",
      "Posted date": "June 1, 2026",
    },
  },
  {
    id: "macbook-air-m2",
    title: "MacBook Air M2 13-inch, 512GB",
    price: 54500,
    category: "Electronics",
    brand: "Apple",
    condition: "Like new",
    seller: sellers.urban,
    location: "Makati",
    distanceMiles: 5.6,
    postedDate: "2026-06-05",
    postedDaysAgo: 4,
    description:
      "Midnight MacBook Air M2 with 512GB SSD and 16GB memory. Includes box, charger, sleeve, and battery health report.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
    ],
    saved: true,
    specs: {
      Brand: "Apple",
      Category: "Electronics > Computers",
      Condition: "Like new",
      Location: "Makati",
      "Posted date": "June 5, 2026",
    },
  },
  {
    id: "playstation-5-bundle",
    title: "PlayStation 5 bundle with two controllers",
    price: 26500,
    category: "Electronics",
    brand: "Sony",
    condition: "Good",
    seller: sellers.leo,
    location: "Pasig",
    distanceMiles: 4.1,
    postedDate: "2026-05-28",
    postedDaysAgo: 12,
    description:
      "Disc edition PS5 with two DualSense controllers, charging dock, HDMI cable, and three physical games. Works perfectly.",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "Sony",
      Category: "Electronics > Gaming",
      Condition: "Good",
      Location: "Pasig",
      "Posted date": "May 28, 2026",
    },
  },
  {
    id: "linen-sofa",
    title: "Three-seat linen sofa in warm gray",
    price: 22000,
    category: "Furniture",
    brand: "West Elm",
    condition: "Good",
    seller: sellers.clara,
    location: "Taguig",
    distanceMiles: 9.2,
    postedDate: "2026-06-04",
    postedDaysAgo: 5,
    description:
      "Comfortable three-seat sofa with removable cushion covers, solid wood legs, and compact footprint for condo living.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "West Elm",
      Category: "Furniture > Sofas",
      Condition: "Good",
      Location: "Taguig",
      "Posted date": "June 4, 2026",
    },
  },
  {
    id: "dslr-photography-starter-kit",
    title: "DSLR photography starter kit",
    price: 19800,
    category: "Electronics",
    brand: "Canon",
    condition: "Fair",
    seller: sellers.maya,
    location: "Quezon City",
    distanceMiles: 2.5,
    postedDate: "2026-05-20",
    postedDaysAgo: 20,
    description:
      "Canon DSLR body with 18-55mm lens, tripod, memory cards, and beginner guidebook. Visible cosmetic wear but reliable operation.",
    images: [
      "https://images.unsplash.com/photo-1500646953400-045056a916d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: {
      Brand: "Canon",
      Category: "Electronics > Cameras",
      Condition: "Fair",
      Location: "Quezon City",
      "Posted date": "May 20, 2026",
    },
  },
];

export const recentlyViewedIds = [
  "sony-a6400-camera-kit",
  "minimalist-oak-dining-table",
  "city-commuter-bike",
];

export const savedSearches = [
  {
    id: "saved-cameras",
    label: "Mirrorless cameras under PHP 45k",
    query: "mirrorless camera",
    filters: "Electronics, Like new, within 10 mi",
  },
  {
    id: "saved-work",
    label: "Work-from-home furniture",
    query: "office chair desk",
    filters: "Furniture, Good+, business sellers",
  },
  {
    id: "saved-bike",
    label: "Commuter bikes nearby",
    query: "commuter bike",
    filters: "Sports, within 5 mi, posted this week",
  },
];

export const searchSuggestions = [
  "camera",
  "mirrorless camera",
  "macbook",
  "office chair",
  "sofa",
  "bike",
  "dining table",
  "playstation",
  "desk",
  "canon",
  "sony",
  "apple",
];

export const popularBrands = [
  "Apple",
  "Canon",
  "ErgoFlex",
  "Muji",
  "Sony",
  "Trek",
  "West Elm",
];

export const conditions: ListingCondition[] = ["New", "Like new", "Good", "Fair"];

export const sellerTypes: SellerType[] = ["Individual", "Business"];

export const recommendationTags = [
  { icon: Sparkles, label: "Recently posted", value: "Updated hourly" },
  { icon: Camera, label: "Camera deals", value: "Based on your saves" },
  { icon: Armchair, label: "Home office", value: "Popular near you" },
  { icon: Gamepad2, label: "Gaming picks", value: "High seller ratings" },
];
