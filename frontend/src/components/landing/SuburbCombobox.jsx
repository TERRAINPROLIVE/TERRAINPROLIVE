import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { AU_SUBURBS_UNIQUE } from "@/lib/auSuburbs";

// Compact combobox: type-ahead through ~600 AU suburbs.
// On select, calls onSelect({suburb, state, postcode}).
export default function SuburbCombobox({
  value,
  onSelect,
  placeholder = "Search suburb…",
  testId = "suburb-combobox",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AU_SUBURBS_UNIQUE.slice(0, 60);
    return AU_SUBURBS_UNIQUE.filter((s) => s.key.includes(q)).slice(0, 100);
  }, [query]);

  const label = value
    ? `${value.suburb}, ${value.state} ${value.postcode || ""}`.trim()
    : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-testid={testId}
          aria-expanded={open}
          className="h-12 w-full inline-flex items-center justify-between px-3 rounded-none bg-black border border-neutral-800 hover:border-neutral-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm transition-colors"
        >
          <span className={label ? "text-neutral-100" : "text-neutral-500"}>
            {label || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-neutral-500 flex-shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0 w-[--radix-popover-trigger-width] bg-neutral-950 border-neutral-800 rounded-none"
      >
        <Command className="bg-transparent rounded-none">
          <div className="flex items-center border-b border-neutral-800 px-3">
            <Search className="w-4 h-4 text-neutral-500 flex-shrink-0" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Type suburb or postcode…"
              data-testid={`${testId}-input`}
              className="h-11 bg-transparent text-sm placeholder:text-neutral-600 border-0 focus-visible:ring-0"
            />
          </div>
          <CommandList className="max-h-72">
            <CommandEmpty className="py-6 text-center text-xs text-neutral-500">
              No suburb match — you can still type a free-form address below.
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((s) => {
                const id = `${s.suburb}-${s.state}-${s.postcode}`;
                const selected =
                  value &&
                  value.suburb === s.suburb &&
                  value.state === s.state &&
                  value.postcode === s.postcode;
                return (
                  <CommandItem
                    key={id}
                    value={`${s.suburb} ${s.state} ${s.postcode}`}
                    onSelect={() => {
                      onSelect({
                        suburb: s.suburb,
                        state: s.state,
                        postcode: s.postcode,
                      });
                      setOpen(false);
                      setQuery("");
                    }}
                    data-testid={`suburb-option-${s.suburb.replace(/\s+/g, "-").toLowerCase()}-${s.postcode}`}
                    className="rounded-none aria-selected:bg-yellow-500 aria-selected:text-black cursor-pointer flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {selected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                      <span>{s.suburb}</span>
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-70">
                      {s.state} · {s.postcode}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
