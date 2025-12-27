import React from "react"
import { twMerge } from "tailwind-merge"
import { Icon } from "@iconify/react"

const Select = React.forwardRef(
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
      ...props
    },
    ref,
  ) => {
    return (
      <div className={twMerge("space-y-2", containerClassName)}>
        {label && (
          <label className={twMerge("block text-sm font-medium text-[var(--text-primary)]", labelClassName)}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={twMerge(
              "input-field appearance-none pr-10",
              error && "border-[var(--accent-red)] focus:ring-[var(--accent-red)]",
              className,
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
          <Icon
            icon="mdi:chevron-down"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
          />
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

Select.displayName = "Select"

export default Select
