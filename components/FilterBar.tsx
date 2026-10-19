"use client";

import { useEffect, useRef } from "react";
import { Search, X, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { Category, CATEGORIES, SortOption, LayoutMode } from "../lib/types";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  layoutMode: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  categoryCounts: Record<Category, number>;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  layoutMode,
  onLayoutChange,
  categoryCounts,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mb-8 space-y-4">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-sage-600 dark:group-focus-within:text-sage-300 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          ref={searchInputRef}
          type="search"
          placeholder="Search stories, topics, life notes, travel, tags, or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-24 py-3.5 sm:py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-500/40 dark:focus:ring-sage-300/30 focus:border-sage-600 dark:focus:border-sage-300 transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange("");
                searchInputRef.current?.focus();
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted border border-border rounded-md pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Filter Bar: Category Pills + Sort & Layout View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-sage-600 dark:bg-sage-300 text-white dark:text-slate-950 font-semibold shadow-sm scale-105"
                    : "bg-card text-muted-foreground border border-border hover:border-slate-300 dark:hover:border-[#343a48] hover:text-foreground"
                }`}
              >
                <span>{cat === "Saved" ? "★ Saved" : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? "bg-black/15 dark:bg-black/20 text-white dark:text-slate-950"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Sort Dropdown + Grid/List View Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-card border border-border text-foreground rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-sage-500 dark:focus:border-sage-300 transition-colors cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Appreciated</option>
              <option value="quick">Quick Reads</option>
            </select>
          </div>

          {/* Grid vs List View switcher */}
          <div className="inline-flex items-center rounded-lg p-0.5 bg-muted border border-border">
            <button
              onClick={() => onLayoutChange("grid")}
              className={`p-1.5 rounded-md transition-all ${
                layoutMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onLayoutChange("list")}
              className={`p-1.5 rounded-md transition-all ${
                layoutMode === "list"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
