'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, User, LogOut, MapPin } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/account/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/details', label: 'Account details', icon: User },
]

export function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <aside className="w-full lg:w-56 flex-shrink-0">
      <nav className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        {navItems.map((item) => {
          const isActive =
            item.href === '/account/orders'
              ? pathname === '/account/orders' || pathname.startsWith('/account/orders/')
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 text-gray-500" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left border-b border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-gray-500" />
          <span>Customer Logout</span>
        </button>
      </nav>
    </aside>
  )
}
