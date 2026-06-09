import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

interface SearchAutocompleteProps {
  value: string;
  suggestions: string[];
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
}

export function SearchAutocomplete({
  value,
  suggestions,
  onChange,
  onSubmit,
  placeholder = "Search for items, brands, or categories",
}: SearchAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const visibleSuggestions = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return suggestions.slice(0, 5);
    return suggestions.filter((suggestion) => suggestion.includes(query)).slice(0, 5);
  }, [suggestions, value]);

  return (
    <div className="relative">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setIsOpen(false);
          onSubmit?.(value);
        }}
        className="relative"
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
          aria-hidden="true"
        />
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-12 text-base text-slate-950 shadow-sm placeholder:text-slate-500"
          placeholder={placeholder}
          aria-label="Search marketplace"
          aria-expanded={isOpen}
          aria-controls="search-suggestions"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
            className="absolute right-2 top-1/2 min-h-11 min-w-11 -translate-y-1/2 rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="mx-auto h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </form>

      {isOpen && visibleSuggestions.length > 0 && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
        >
          {visibleSuggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              role="option"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(suggestion);
                setIsOpen(false);
                onSubmit?.(suggestion);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
