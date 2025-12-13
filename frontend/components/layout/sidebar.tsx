"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Building2, LayoutDashboard, Home, Plus, LogOut, Moon, Sun, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/properties", icon: Home },
    ...(user?.role === "admin" ? [{ name: "Add Property", href: "/properties/add", icon: Plus }] : []),
  ]

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-border/50 bg-sidebar backdrop-blur-xl",
          "lg:static lg:translate-x-0",
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-1 shadow-lg shadow-primary/25">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">RentOps</h1>
            <p className="text-[11px] text-sidebar-foreground/60">Property Manager</p>
          </div>
        </div>

        <div className="border-b border-border/50 px-4 py-4">
          <div className="rounded-xl border border-border/50 bg-sidebar-accent/50 px-4 py-3">
            <p className="text-sm font-semibold text-sidebar-foreground">{user?.name}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
              <Badge
                variant={user?.role === "admin" ? "default" : "secondary"}
                className="h-5 px-2 text-[10px] font-medium"
              >
                {user?.role}
              </Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-all duration-200",
                      isActive ? "text-primary" : "group-hover:text-primary",
                    )}
                  />
                  {item.name}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="border-t border-border/50 p-3 space-y-1.5">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            size="sm"
          >
            {theme === "dark" ? (
              <Sun className="mr-2.5 h-[18px] w-[18px]" />
            ) : (
              <Moon className="mr-2.5 h-[18px] w-[18px]" />
            )}
            <span className="text-sm">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
            size="sm"
          >
            <LogOut className="mr-2.5 h-[18px] w-[18px]" />
            <span className="text-sm">Sign out</span>
          </Button>
        </div>
      </motion.div>
    </>
  )
}
