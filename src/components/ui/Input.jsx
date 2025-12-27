import React from "react"
import { twMerge } from "tailwind-merge"

const Input = React.forwardRef(
  ({ label, error, helperText, className, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={twMerge("space-y-2", containerClassName)}>
        {label && (
          <label className={twMerge("block text-sm font-medium text-[var(--text-primary)]", labelClassName)}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            "input-field",
            error && "border-[var(--accent-red)] focus:ring-[var(--accent-red)]",
            className,
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={twMerge("text-sm", error ? "text-[var(--accent-red)]" : "text-[var(--text-tertiary)]")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
