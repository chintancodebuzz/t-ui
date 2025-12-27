"use client"

import { Icon } from "@iconify/react"
import Button from "../ui/Button"

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange, loading, itemsPerPage = 10 }) => {
  const getPages = () => {
    const pages = []
    const showMax = 5

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push("...")
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--border-color)]">
      <div className="text-sm text-[var(--text-tertiary)]">
        Showing <span className="font-semibold text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
        <span className="font-semibold text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
        <span className="font-semibold text-[var(--text-primary)]">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="!px-2 h-9 border-[var(--border-color)]"
        >
          <Icon icon="mdi:chevron-left" className="text-lg" />
        </Button>

        <div className="flex items-center gap-1">
          {getPages().map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-[var(--text-tertiary)]">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-[var(--primary-600)] text-white shadow-sm"
                    : "hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-transparent hover:border-[var(--border-color)]"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="!px-2 h-9 border-[var(--border-color)]"
        >
          <Icon icon="mdi:chevron-right" className="text-lg" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
