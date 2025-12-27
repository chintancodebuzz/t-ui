"use client";

import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  setPage,
  fetchProducts,
} from "../../store/slices/productSlice";
import { Icon } from "@iconify/react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Skeleton from "../ui/Skeleton";

const ProductTable = ({
  products,
  pagination,
  filters,
  onFilterChange,
  onRefresh,
  viewMode,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };
  
  const sanitizeFilters = (f = {}) => {
    return Object.entries(f).reduce((acc, [k, v]) => {
      if (v == null) return acc;
      if (typeof v === "string") {
        const t = v.trim();
        if (t !== "") acc[k] = t;
      } else if (Array.isArray(v)) {
        if (v.length) acc[k] = v;
      } else {
        acc[k] = v;
      }
      return acc;
    }, {});
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete._id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
      const cleanFilters = sanitizeFilters(filters);
      await dispatch(
        fetchProducts({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          ...cleanFilters,
        })
      );
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleViewProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedIds([]);
    dispatch(setPage(page));
    const cleanFilters = sanitizeFilters(filters);
    dispatch(
      fetchProducts({
        page,
        limit: pagination.itemsPerPage,
        ...cleanFilters,
      })
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = useMemo(
    () => products.length > 0 && selectedIds.length === products.length,
    [products, selectedIds]
  );

  const isSomeSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < products.length,
    [selectedIds, products]
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-[var(--accent-emerald)]/15 text-[var(--accent-emerald)]",
      inactive: "bg-[var(--accent-red)]/15 text-[var(--accent-red)]",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const TableSkeleton = () => (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--bg-secondary)]">
              <th className="py-3 px-4 w-10">
                <Skeleton className="w-4 h-4 rounded" />
              </th>
              {[
                "Product",
                "Category",
                "MRP",
                "Distributor Rate",
                "Retailer Price",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td className="py-4 px-4">
                  <Skeleton className="w-4 h-4 rounded" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card">
          <Skeleton className="w-full h-48 rounded-lg mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[var(--border-color)]">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return viewMode === "grid" ? <GridSkeleton /> : <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center rounded-xl border border-[var(--accent-red)]/20">
        <Icon
          icon="mdi:alert-circle"
          className="mx-auto text-5xl text-[var(--accent-red)] mb-4"
        />
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Failed to load products
        </h3>
        <p className="text-[var(--text-tertiary)] mb-6">{error}</p>
        <Button variant="primary" onClick={onRefresh} icon="mdi:refresh">
          Try Again
        </Button>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
            />
          ))}
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-12 col-span-full">
            <Icon
              icon="mdi:package-variant-empty"
              className="mx-auto text-6xl text-[var(--text-tertiary)] mb-4 opacity-50"
            />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No products found
            </h3>
            <p className="text-[var(--text-tertiary)]">
              {Object.values(filters).some(Boolean)
                ? "Try changing your filters"
                : "Create your first product to get started"}
            </p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Product"
          size="lg"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-red)]/15 mb-4">
              <Icon
                icon="mdi:alert-circle"
                className="h-6 w-6 text-[var(--accent-red)]"
              />
            </div>
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              Delete Product
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} icon="mdi:trash">
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Product"
          size="xl"
        >
          <ProductForm
            product={selectedProduct}
            onClose={() => setEditModalOpen(false)}
            mode="edit"
          />
        </Modal>
      </>
    );
  }

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[var(--bg-primary)] border border-[var(--primary-500)] shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-[var(--primary-500)] text-white text-xs font-bold rounded-full">
                {selectedIds.length}
              </span>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                items selected
              </span>
            </div>
            <div className="h-6 w-px bg-[var(--border-color)]" />
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                size="sm"
                icon="mdi:trash"
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete Selected
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden animate-fadeIn">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-500)] focus:ring-[var(--primary-500)] cursor-pointer"
                    checked={isAllSelected}
                    ref={(el) => el && (el.indeterminate = isSomeSelected)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Product
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Category
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  MRP
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Distributor Rate
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Retailer Price
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  UOM
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  CRT
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={`hover:bg-[var(--bg-secondary)] transition-colors duration-150 ${
                    selectedIds.includes(product._id)
                      ? "bg-[var(--primary-50)]/30 dark:bg-[var(--primary-600)]/5"
                      : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--primary-500)] focus:ring-[var(--primary-500)] cursor-pointer"
                      checked={selectedIds.includes(product._id)}
                      onChange={() => handleSelectOne(product._id)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {product.image?.url ? (
                        <img
                          src={product.image.url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                          <Icon
                            icon="mdi:package"
                            className="text-[var(--text-tertiary)]"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">
                          {product.name}
                        </p>
                        <p className="text-sm text-[var(--text-tertiary)]">
                          {product.uom} • {product.unit} units
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      ₹{product.mrp?.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      ₹{product.distributorRate?.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      ₹{product.retailerPrice?.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      {product.unit} {product.uom}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[var(--text-primary)]">
                      {product.crt}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="lg"
                        icon="mdi:pencil"
                        onClick={() => handleEdit(product)}
                        className="!p-2 cursor-pointer"
                      />
                      <Button
                        variant="ghost"
                        size="lg"
                        icon="mdi:trash"
                        onClick={() => handleDelete(product)}
                        className="!p-2 cursor-pointer text-[var(--accent-red)]"
                      />
                      <Button
                        variant="ghost"
                        size="lg"
                        icon="mdi:eye"
                        className="!p-2 cursor-pointer"
                        onClick={() => handleViewProduct(product)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <Icon
              icon="mdi:package-variant-empty"
              className="mx-auto text-4xl text-[var(--text-tertiary)] mb-4 opacity-50"
            />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No products found
            </h3>
            <p className="text-[var(--text-tertiary)]">
              {Object.values(filters).some(Boolean)
                ? "Try changing your filters"
                : "Create your first product to get started"}
            </p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        size="lg"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[var(--accent-red)]/15 mb-4">
            <Icon
              icon="mdi:alert-circle"
              className="h-6 w-6 text-[var(--accent-red)]"
            />
          </div>
          <h3 className="text-lg font-medium  ">Delete Product</h3>
          <p className="text-sm text-[var(--text-tertiary)] mb-6">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} icon="mdi:trash">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Product"
        size="xl"
      >
        <ProductForm
          product={selectedProduct}
          onClose={() => setEditModalOpen(false)}
          mode="edit"
        />
      </Modal>
    </>
  );
};

export default ProductTable;
