import {
  Home,
  MessageCircle,
  PlusCircle,
  Search,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Search", href: "/search", icon: Search },
  { label: "Sell", href: "/sell", icon: PlusCircle },
  { label: "Messages", href: "/messages", icon: MessageCircle },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-blue-700 focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-h-11 items-center gap-3 rounded-xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-700 text-white shadow-sm">
              <ShoppingBag className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black text-slate-950">Clarity Market</span>
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                Commerce only. No social clutter.
              </span>
            </span>
          </NavLink>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    [
                      "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition",
                      isActive
                        ? "bg-blue-50 text-blue-800"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <nav
        aria-label="Mobile primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
      >
        <div className="grid grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  [
                    "flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold transition",
                    isActive ? "text-blue-800" : "text-slate-600",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
