"use client"

import React, { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"
import { twMerge } from "tailwind-merge"

const SearchDropdown = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "Select...",
      value,
      onChange,
      className,
      containerClassName,
      labelClassName,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const containerRef = useRef(null)
    const searchInputRef = useRef(null)

    const filteredOptions = (options || []).filter((option) => {
      const label = option?.label || option || ""
      return label.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })

    const selectedOption = (options || []).find((opt) => (opt?.value || opt) === value)
    const selectedLabel = selectedOption?.label || selectedOption || ""

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, [isOpen])

    return (
      <div className={twMerge("space-y-2", containerClassName)} ref={containerRef}>
        {label && (
          <label className={twMerge("block text-sm font-medium text-[var(--text-primary)]", labelClassName)}>
            {label}
          </label>
        )}

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={twMerge(
              "w-full px-4 py-2.5 text-left bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg transition-all duration-200 flex items-center justify-between hover:border-[var(--primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent",
              error && "border-[var(--accent-red)] focus:ring-[var(--accent-red)]",
              className,
            )}
          >
            <span className={selectedLabel ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}>
              {selectedLabel || placeholder}
            </span>
            <Icon
              icon="mdi:chevron-down"
              className={twMerge(
                "text-[var(--text-tertiary)] transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-[var(--border-color)]">
                <div className="relative">
                  <Icon
                    icon="mdi:magnify"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Options List with custom scrollbar */}
              <ul className="max-h-64 overflow-y-auto scrollbar-custom">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li key={option.value || option}>
                      <button
                        onClick={() => {
                          onChange?.({ target: { value: option.value || option } })
                          setIsOpen(false)
                          setSearchTerm("")
                        }}
                        className={twMerge(
                          "w-full text-left px-4 py-2.5 transition-colors duration-150 flex items-center gap-2 hover:bg-[var(--bg-secondary)]",
                          (option.value || option) === value &&
                            "bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] font-medium",
                        )}
                      >
                        {(option.value || option) === value && <Icon icon="mdi:check" className="text-lg" />}
                        <span>{option.label || option}</span>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-center text-sm text-[var(--text-tertiary)]">No options found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={twMerge("text-sm", error ? "text-[var(--accent-red)]" : "text-[var(--text-tertiary)]")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  },
)

SearchDropdown.displayName = "SearchDropdown"

export default SearchDropdown
