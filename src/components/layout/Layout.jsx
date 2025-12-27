"use client"

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { Toaster } from "react-hot-toast"

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 ml-64"> 
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderRadius: "0.75rem",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-lg)",
          },
          success: {
            iconTheme: {
              primary: "var(--accent-emerald)",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--accent-red)",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  )
}

export default Layout