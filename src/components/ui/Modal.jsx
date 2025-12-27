"use client"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { Icon } from "@iconify/react"

const Modal = ({ isOpen, onClose, title, children, size = "md", closeOnBackdrop = true, className }) => {
  if (!isOpen) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  }

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className={twMerge(
          "w-full bg-[var(--bg-primary)] rounded-2xl shadow-xl transform transition-all duration-300 scale-100 opacity-100 border border-[var(--border-color)]",
          sizes[size],
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Icon icon="mdi:close" className="text-2xl" />
          </button>
        </div>

        {/* Content with custom scrollbar */}
        <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-custom">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export default Modal
