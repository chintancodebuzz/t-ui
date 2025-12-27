"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  fetchProductOptions,
  setFilters,
  clearFilters,
  setPage,
} from "../store/slices/productSlice";
import { Icon } from "@iconify/react";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import SearchDropdown from "../components/ui/SearchDropdown";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, filters, options, loading } = useSelector(
    (state) => state.products
  );

  const [viewMode, setViewMode] = useState("table");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "";
    const urlStatus = searchParams.get("status") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlPage = Number.parseInt(searchParams.get("page")) || 1;

    // Set initial filters from URL on mount
    dispatch(
      setFilters({
        category: urlCategory,
        status: urlStatus,
        search: urlSearch,
      })
    );

    if (urlPage !== pagination.currentPage) {
      dispatch(setPage(urlPage));
    }

    setSearchTerm(urlSearch);
    setIsInitialLoad(false);
  }, []); // Run only on mount

  // Separate useEffect for initial data fetch after URL params are set
  useEffect(() => {
    if (!isInitialLoad) {
      dispatch(
        fetchProducts({
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          ...filters,
        })
      );
    }
  }, [
    dispatch,
    filters,
    pagination.currentPage,
    pagination.itemsPerPage,
    isInitialLoad,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.category) params.set("category", filters.category);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (pagination.currentPage > 1)
      params.set("page", pagination.currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [filters, pagination.currentPage, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filters.search]);

  useEffect(() => {
    dispatch(fetchProductOptions());
  }, [dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchProducts({
        page: pagination.currentPage,
        limit: 5,
        ...filters,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm("");
    setSearchParams({}, { replace: true });
  };

  const handleSearchClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p>Manage your products, inventory, and pricing</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon="mdi:plus"
            onClick={() => setCreateModalOpen(true)}
          >
            Add Product
          </Button>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={handleSearchClear}
              placeholder="Search products by name..."
            />
          </div>

          <SearchDropdown
            placeholder="All Categories"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            options={[
              ...(options?.categories?.map((cat) => ({
                label: cat,
                value: cat,
              })) || []),
            ]}
          />

          <SearchDropdown
            placeholder="All Status"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
          />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t ">
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5  rounded-full text-sm font-medium"
                >
                  <span className="capitalize">
                    {key}: {value}
                  </span>
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className=" transition-colors"
                  >
                    <Icon icon="mdi:close" className="text-sm" />
                  </button>
                </div>
              );
            })}

            {(filters.category || filters.status || filters.search) && (
              <Button variant="ghost" size="lg" onClick={handleClearFilters}>
                Clear All
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2  p-1.5 rounded-lg">
            <Button
              variant={viewMode === "table" ? "primary" : "secondary"}
              size="lg"
              icon="mdi:table"
              onClick={() => setViewMode("table")}
              className="transition-all duration-200 cursor-pointer"
              title="Table view"
            />
            <Button
              variant={viewMode === "grid" ? "primary" : "secondary"}
              size="lg"
              icon="mdi:view-grid"
              onClick={() => setViewMode("grid")}
              className=" transition-all duration-200 cursor-pointer"
              title="Grid view"
            />
          </div>
        </div>
      </div>

      <div className="transition-all duration-300">
        <ProductTable
          products={products}
          pagination={pagination}
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          viewMode={viewMode}
        />
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Product"
        size="xl"
      >
        <ProductForm onClose={() => setCreateModalOpen(false)} mode="create" />
      </Modal>
    </div>
  );
};

export default Products;
