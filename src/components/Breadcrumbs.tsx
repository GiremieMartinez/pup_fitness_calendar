import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1 rounded-lg px-1 font-semibold text-slate-700 hover:text-blue-700"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Marketplace
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="inline-flex min-h-11 items-center rounded-lg px-1 font-semibold text-slate-700 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="inline-flex min-h-11 items-center rounded-lg px-1 text-slate-500">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
