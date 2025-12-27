"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductStats, fetchProducts } from "../store/slices/productSlice";
import { Icon } from "@iconify/react";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductStats());
    dispatch(fetchProducts({ limit: 5 }));
  }, [dispatch]);

  const statsCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: "mdi:package-variant",
      color: "from-[var(--primary-500)] to-[var(--primary-600)]",
      bgColor: "bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/10",
      textColor: "text-[var(--primary-600)]",
      change: "+12%",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      icon: "mdi:check-circle",
      color: "from-[var(--accent-emerald)]/80 to-[var(--accent-emerald)]",
      bgColor: "bg-[var(--accent-emerald)]/10",
      textColor: "text-[var(--accent-emerald)]",
      change: "+8%",
    },
    {
      title: "Inactive Products",
      value: stats?.inactiveProducts || 0,
      icon: "mdi:close-circle",
      color: "from-[var(--accent-red)]/80 to-[var(--accent-red)]",
      bgColor: "bg-[var(--accent-red)]/10",
      textColor: "text-[var(--accent-red)]",
      change: "-3%",
    },
    {
      title: "Categories",
      value: stats?.categoryStats?.length || 0,
      icon: "mdi:tag-multiple",
      color: "from-[var(--accent-amber)]/80 to-[var(--accent-amber)]",
      bgColor: "bg-[var(--accent-amber)]/10",
      textColor: "text-[var(--accent-amber)]",
      change: "+5%",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="card hover:scale-[1.02] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <Skeleton className="w-8 h-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Category Distribution
            </h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] rounded-full h-2"
                      style={{ width: `${20 + i * 12}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Recent Products
              </h3>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                >
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Dashboard Overview
          </h1>
          <p className="text-[var(--text-tertiary)]">
            Welcome back! Here's what's happening with your products today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="card hover:scale-[1.02] hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--accent-emerald)] mt-1">
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon
                  icon={stat.icon}
                  className={`text-2xl ${stat.textColor}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.categoryStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Category Distribution
            </h3>
            <div className="space-y-4">
              {stats.categoryStats.slice(0, 5).map((category) => (
                <div key={category._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {category._id}
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {category.count} products
                    </span>
                  </div>
                  <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${
                          (category.count / stats.totalProducts) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Recent Products
              </h3>
            </div>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  {product.image?.url ? (
                    <img
                      src={product.image.url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                      <Icon
                        icon="mdi:package"
                        className="text-[var(--text-tertiary)]"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">
                      {product.name}
                    </p>
                    <p className="text-sm text-[var(--text-tertiary)]">
                      {product.category} • ₹{product.mrp?.toFixed(2)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-[var(--accent-emerald)]/15 text-[var(--accent-emerald)]"
                        : "bg-[var(--accent-red)]/15 text-[var(--accent-red)]"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
