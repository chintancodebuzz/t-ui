"use client"

import React from "react"
import { Icon } from "@iconify/react"
import { twMerge } from "tailwind-merge"

const SearchInput = React.forwardRef(
  ({ value, onChange, onClear, placeholder = "Search...", className, ...props }, ref) => {
    return (
      <div className={twMerge("relative", className)}>
        <Icon
          icon="mdi:magnify"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
        />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          {...props}
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-150"
          >
            <Icon icon="mdi:close-circle" className="text-lg" />
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = "SearchInput"

export default SearchInput
