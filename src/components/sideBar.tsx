"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
} from "lucide-react"

import brandlogo from "@/assets/brandlogo.png"
import LogoutButton from "./logoutButton"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Audits",
    href: "/audits",
    icon: ClipboardCheck,
  },
  {
    label: "Find",
    href: "/findings",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
]



const SideBar = () => {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white px-3 py-4">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-6">
        <Image
          src={brandlogo}
          width={30}
          height={30}
          alt="Care Track logo"
        />

        <h1 className="text-xl font-bold tracking-tight text-[#4650C9]">
          Care Track
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        

        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#4650C9]/10 text-[#4650C9]"
                  : "text-gray-600 hover:bg-[#4650C9]/10 hover:text-[#4650C9] "
              }`}
            >
              <Icon size={19} strokeWidth={1.8} />

              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">

        {/* User */}
        <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4650C9]/10 text-sm font-semibold text-[#4650C9]">
            AR
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              Ahmad Raza
            </p>

            <p className="text-xs text-gray-400">
              Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        
        <LogoutButton />

      </div>
    </aside>
  )
}

export default SideBar