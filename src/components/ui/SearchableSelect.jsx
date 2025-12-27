"use client"

import React, { useState, useRef, useEffect } from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "@iconify/react"

const SearchableSelect = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "Select...",
      className,
      containerClassName,
      labelClassName,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredOptions, setFilteredOptions] = useState(options)
    const containerRef = useRef(null)
    const inputRef = useRef(null)

    // Filter options based on search term
    useEffect(() => {
      const filtered = options.filter((option) =>
        (option.label || option).toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredOptions(filtered)
    }, [searchTerm, options])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Find selected option label
    const selectedOption = options.find((opt) => (opt.value || opt) === value)
    const selectedLabel = selectedOption ? selectedOption.label || selectedOption : placeholder

    const handleSelect = (option) => {
      const selectValue = option.value || option
      onChange?.({ target: { name: props.name, value: selectValue } })
      setIsOpen(false)
      setSearchTerm("")
    }

    return (
      <div className={twMerge("space-y-2", containerClassName)}>
        {label && (
          <label className={twMerge("block text-sm font-medium text-[var(--text-primary)]", labelClassName)}>
            {label}
          </label>
        )}

        <div className="relative" ref={containerRef}>
          {/* Hidden input for form submission */}
          <input type="hidden" name={props.name} value={value} />

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={twMerge(
              "w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200 text-left flex items-center justify-between",
              error && "border-[var(--accent-red)] focus:ring-[var(--accent-red)]",
              className,
            )}
          >
            <span className={value ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}>
              {selectedLabel}
            </span>
            <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="text-[var(--text-tertiary)]" />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50">
              {/* Search input */}
              <div className="p-3 border-b border-[var(--border-color)]">
                <div className="relative">
                  <Icon
                    icon="mdi:magnify"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-sm text-[var(--text-primary)]"
                  />
                </div>
              </div>

              {/* Options list with custom scrollbar */}
              <div className="max-h-64 overflow-y-auto scrollbar-custom">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const optionValue = option.value || option
                    const optionLabel = option.label || option
                    const isSelected = optionValue === value

                    return (
                      <button
                        key={optionValue}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className={twMerge(
                          "w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors text-sm",
                          isSelected &&
                            "bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)]",
                        )}
                      >
                        <span>{optionLabel}</span>
                        {isSelected && (
                          <Icon icon="mdi:check" className="text-[var(--primary-600)] dark:text-[var(--primary-400)]" />
                        )}
                      </button>
                    )
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-[var(--text-tertiary)] text-sm">No options found</div>
                )}
              </div>
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

SearchableSelect.displayName = "SearchableSelect"

export default SearchableSelect
