"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {
  LayoutDashboard,
  Home,
  Plus,
  LogOut,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type User = {
  email: string
  role: "ADMIN" | "STAFF"
}

export function SidebarClient() {
  const pathname = usePathname()
  const router = useRouter()

  const user: User | null = (() => {
    try {
      return JSON.parse(Cookies.get("user") || "")
    } catch {
      return null
    }
  })()

  if (!user) return null

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Properties", href: "/properties", icon: Home },
    ...(user.role === "ADMIN"
      ? [{ name: "Add Property", href: "/properties/add", icon: Plus }]
      : []),
  ]

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    Cookies.remove("user")
    router.push("/login")
  }

  return (
    <aside className="w-64 border-r bg-sidebar">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Building2 className="text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold">RentOps</p>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{user.email}</p>
      </div>

      <nav className="p-3 space-y-1">
        {navigation.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
              pathname === href
                ? "bg-muted font-semibold"
                : "hover:bg-muted/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {name}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
