"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import { Icon } from "@iconify/react"

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard")

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "mdi:view-dashboard",
      path: "/",
    },
    {
      id: "products",
      label: "Products",
      icon: "mdi:package-variant",
      path: "/products",
    },
  ]

  return (
    <aside className="w-64 bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col h-screen">
      <div className="flex items-center gap-3 h-16 px-4 border-b border-[var(--border-color)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-700)] flex items-center justify-center flex-shrink-0">
          <Icon icon="mdi:warehouse" className="text-white text-lg" />
        </div>
        <span className="font-bold text-[var(--text-primary)] text-lg whitespace-nowrap font-poppins">
          Distributor MS
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-600)] dark:text-[var(--primary-400)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors",
              )
            }
            onClick={() => setActiveItem(item.id)}
          >
            <Icon
              icon={item.icon}
              width="24"
              height="24"
              className={twMerge(
                "text-xl transition-transform duration-200 flex-shrink-0 min-w-[24px]",
                activeItem === item.id && "scale-110",
              )}
            />
            <span className="font-medium whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--border-color)] p-4">
        <ThemeToggle />
      </div>
    </aside>
  )
}

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const isDark = theme === "dark" || (!theme && prefersDark)
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add("dark")
    }
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all duration-200 font-medium"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon
        icon={darkMode ? "mdi:weather-sunny" : "uil:moon"}
        className="text-xl flex-shrink-0 text-[var(--text-primary)]"
      />
      <span className="whitespace-nowrap">{darkMode ? "Light" : "Dark"}</span>
    </button>
  )
}

export default Sidebar
