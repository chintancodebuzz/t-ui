"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";

const Header = ({ onSearch }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/products/search?q=${encodeURIComponent(searchValue)}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.products || []);
          setShowResults(true);
        })
        .catch((err) => {
          console.log("[v0] Search error:", err);
          setSearchResults([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearchClear = () => {
    setSearchValue("");
    setSearchResults([]);
    setShowResults(false);
    onSearch?.("");
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-color)] shadow-sm">
      <div
        className="flex items-center justify-end h-16 px-6"
        style={{ marginLeft: "16rem" }}
      >
        <div className="flex items-center gap-4">
          <div className="hidden md:block w-80 relative">
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-custom">
                {searchResults.map((product) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                  >
                    {product.image && (
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs ">{product.category}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 hover:bg-[var(--bg-secondary)]"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:account" className="text-white text-sm" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Admin User
                </p>
                <p className="text-xs ">Administrator</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
