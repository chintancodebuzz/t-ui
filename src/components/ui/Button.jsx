import { twMerge } from "tailwind-merge"
import { Icon } from "@iconify/react"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)] shadow-sm hover:shadow-md focus:ring-[var(--primary-500)]",
    secondary:
      "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] focus:ring-[var(--primary-500)]",
    danger:
      "bg-[var(--accent-red)] text-white hover:bg-red-700 shadow-sm hover:shadow-md focus:ring-[var(--accent-red)]",
    ghost: "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] focus:ring-[var(--primary-500)]",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={twMerge(baseClasses, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Icon icon="mdi:loading" className="animate-spin" />
      ) : icon && iconPosition === "left" ? (
        <Icon icon={icon} className="" />
      ) : null}

      {children}

      {icon && iconPosition === "right" && !loading && <Icon icon={icon} className="ml-2" />}
    </button>
  )
}

export default Button
