"use client"

import { Icon } from "@iconify/react"
import { useNavigate } from "react-router-dom"
import Button from "../ui/Button"

const ProductCard = ({ product, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-[var(--accent-emerald)]/15 text-[var(--accent-emerald)]"
      : "bg-[var(--accent-red)]/15 text-[var(--accent-red)]"
  }

  const handleViewProduct = () => {
    navigate(`/products/${product._id}`)
  }

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative mb-4">
        {product.image?.url ? (
          <img
            src={product.image.url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-lg flex items-center justify-center border border-[var(--border-color)]">
            <Icon icon="mdi:package-variant" className="text-4xl text-[var(--text-tertiary)]" />
          </div>
        )}

        <span
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
        >
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </span>

        <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="lg"
            icon="mdi:pencil"
            onClick={onEdit}
            className="!p-2 bg-[var(--bg-primary)]/90 backdrop-blur-sm"
          />
          <Button
            variant="ghost"
            size="lg"
            icon="mdi:trash"
            onClick={onDelete}
            className="!p-2 bg-[var(--bg-primary)]/90 backdrop-blur-sm text-[var(--accent-red)]"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-1 bg-[var(--primary-50)] text-[var(--primary-600)] dark:bg-[var(--primary-600)]/20 dark:text-[var(--primary-400)] rounded-full text-xs font-medium">
              {product.category}
            </span>
            <span className="text-sm text-[var(--text-tertiary)]">
              {product.uom} • {product.unit} units
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[var(--border-color)]">
          <div className="text-center">
            <p className="text-xs text-[var(--text-tertiary)]">MRP</p>
            <p className="font-semibold text-[var(--text-primary)]">₹{product.mrp?.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-tertiary)]">Distributor</p>
            <p className="font-semibold text-[var(--text-primary)]">₹{product.distributorRate?.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--text-tertiary)]">Retailer</p>
            <p className="font-semibold text-[var(--text-primary)]">₹{product.retailerPrice?.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Icon icon="mdi:scale" className="text-[var(--text-tertiary)]" />
              <span className="text-[var(--text-tertiary)]">
                {product.weight || "0"} {product.weightUnit || "gms"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Icon icon="mdi:cube-outline" className="text-[var(--text-tertiary)]" />
              <span className="text-[var(--text-tertiary)]">CRT: {product.crt}</span>
            </div>
          </div>

          <Button variant="ghost" size="lg" icon="mdi:eye" className="text-sm" onClick={handleViewProduct}>
            View
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
