"use client";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import Button from "../components/ui/Button";
import { fetchProductById } from "../store/slices/productSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="relative w-16 h-16">
          <Icon
            icon="svg-spinners:ring-resize"
            className="text-5xl text-[var(--primary-600)]"
          />
        </div>
        <p className="text-[var(--text-tertiary)] animate-pulse font-medium">
          Loading product details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="bg-[var(--accent-red)]/10 p-6 rounded-full mb-6">
          <Icon
            icon="solar:shield-warning-bold-duotone"
            className="text-6xl text-[var(--accent-red)]"
          />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Product Not Found
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md text-center">
          {error ||
            "The product you're looking for might have been removed or doesn't exist."}
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/products")}
          className="px-8"
        >
          Return to Catalog
        </Button>
      </div>
    );
  }

  const productImageUrl =
    product.image?.url || product.image || "/placeholder.svg";

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-2 text-sm mb-8 text-[var(--text-tertiary)]">
        <button
          onClick={() => navigate("/")}
          className="hover:text-[var(--primary-600)] transition-colors"
        >
          Home
        </button>
        <Icon icon="heroicons:chevron-right-20-solid" />
        <button
          onClick={() => navigate("/products")}
          className="hover:text-[var(--primary-600)] transition-colors"
        >
          Products
        </button>
        <Icon icon="heroicons:chevron-right-20-solid" />
        <span className="text-[var(--text-secondary)] font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card overflow-hidden group relative bg-white dark:bg-[var(--bg-secondary)] aspect-square md:aspect-video flex items-center justify-center border-2 border-[var(--border-color)] shadow-xl rounded-2xl">
            <img
              src={productImageUrl || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.src = "/diverse-products-still-life.png";
              }}
            />
            {product.status === "active" && (
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border border-[var(--accent-emerald)]/20 shadow-sm">
                In Stock
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center space-y-2 hover:border-[var(--primary-500)] transition-colors">
              <div className="w-10 h-10 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 rounded-lg flex items-center justify-center mx-auto">
                <Icon
                  icon="solar:box-minimalistic-bold-duotone"
                  className="text-xl text-[var(--primary-600)]"
                />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">
                UOM
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {product.uom || "Units"}
              </p>
            </div>
            <div className="glass-card p-4 text-center space-y-2 hover:border-[var(--primary-500)] transition-colors">
              <div className="w-10 h-10 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 rounded-lg flex items-center justify-center mx-auto">
                <Icon
                  icon="solar:bill-list-bold-duotone"
                  className="text-xl text-[var(--primary-600)]"
                />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">
                Category
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {product.category}
              </p>
            </div>
            <div className="glass-card p-4 text-center space-y-2 hover:border-[var(--primary-500)] transition-colors">
              <div className="w-10 h-10 bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10 rounded-lg flex items-center justify-center mx-auto">
                <Icon
                  icon="solar:tag-price-bold-duotone"
                  className="text-xl text-[var(--primary-600)]"
                />
              </div>
              <p className="text-xs text-[var(--text-tertiary)] font-medium">
                Brand
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Premium
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-prose">
              {product.description ||
                "Premium quality product designed for excellence and performance in every use case."}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-[var(--border-color)] via-[var(--border-color)] to-transparent" />

          <div className="space-y-4">
            <h3 className="text-sm font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
              Product Specifications
            </h3>
            <div className="glass-card overflow-hidden border-[var(--border-color-light)]">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[var(--border-color-light)]">
                  <tr className="group">
                    <td className="py-4 px-6 text-[var(--text-tertiary)] font-medium bg-[var(--bg-secondary)]/30 w-1/3">
                      Weight
                    </td>
                    <td className="py-4 px-6 text-[var(--text-primary)] font-bold">
                      {product.weight || "0"} {product.weightUnit || "gms"}
                    </td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 px-6 text-[var(--text-tertiary)] font-medium bg-[var(--bg-secondary)]/30">
                      Crt Value
                    </td>
                    <td className="py-4 px-6 text-[var(--text-primary)] font-bold">
                      {product.crt || "N/A"}
                    </td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 px-6 text-[var(--text-tertiary)] font-medium bg-[var(--bg-secondary)]/30">
                      Units/Pack
                    </td>
                    <td className="py-4 px-6 text-[var(--text-primary)] font-bold">
                      {product.unit || "1"} Units
                    </td>
                  </tr>
                  <tr className="group">
                    <td className="py-4 px-6 text-[var(--text-tertiary)] font-medium bg-[var(--bg-secondary)]/30">
                      SKU Code
                    </td>
                    <td className="py-4 px-6 text-[var(--text-primary)] font-mono font-bold text-[var(--primary-600)] uppercase">
                      #{product._id?.slice(-8)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
