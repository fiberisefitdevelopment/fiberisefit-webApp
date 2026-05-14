'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openCart, getItemCount } = useCartStore()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const itemCount = getItemCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'SCIENCE', href: '/science' },
    { name: 'CONTACT', href: '/contact' },
    { name: 'LYTE', href: '/lyte' },
    { name: 'BUY', href: '/#products' },
  ]

  return (
    <>
      {/* Announcement Bar - Single Marquee */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black py-2 overflow-hidden">
        <div className="flex w-max animate-marquee-text whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex gap-12 flex-shrink-0 pr-12 items-center">
              <span className="text-xs md:text-sm text-white tracking-wider">Introductory 50% OFF</span>
              <span className="text-xs md:text-sm text-white tracking-wider">India’s first Craving Control Supplement</span>
              <span className="text-xs md:text-sm text-white tracking-wider">Sustainable Weight Management</span>
              <span className="text-xs md:text-sm text-white tracking-wider">Free Shipping Pan India</span>
              <span className="text-xs md:text-sm text-white tracking-wider">7 Days No Questions asked money back guarantee</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Frosty Navbar */}
      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-500 pt-2 ${
          isScrolled
            ? 'bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg'
            : 'bg-white/40 backdrop-blur-lg border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-16">
            {/* Mobile: left column same width as right so logo is centered */}
            <div className="lg:hidden w-10 flex-shrink-0 flex items-center justify-start">
              <button
                className="p-2 transition-colors text-[#1a1a1a]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Mobile logo - center, in flow so it's clickable */}
            <Link
              href="/"
              className="lg:hidden flex-1 flex justify-center items-center min-w-0"
              aria-label="Fiberise - Go to home"
            >
              <Image
                src="/fiberisefit dark logo.png"
                alt="Fiberise Logo"
                width={96}
                height={24}
                className="object-contain object-center w-24 h-6"
                priority
              />
            </Link>

            {/* Logo - desktop only */}
            <Link
              href="/"
              className="hidden lg:block flex-shrink-0 relative h-8 w-32"
            >
              <Image
                src="/fiberisefit dark logo.png"
                alt="Fiberise Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>

            {/* Desktop Navigation - Center (hidden on mobile) */}
            <NavigationMenu className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 z-10">
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent hover:opacity-70 h-auto px-3 py-2',
                      'text-[#1a1a1a]'
                    )}
                  >
                    <Link href="/science">SCIENCE</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent hover:opacity-70 h-auto px-3 py-2',
                      'text-[#1a1a1a]'
                    )}
                  >
                    <Link href="/contact">CONTACT</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent hover:opacity-70 h-auto px-3 py-2',
                      'text-[#1a1a1a]'
                    )}
                  >
                    <Link href="/lyte">LYTE</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'text-xs font-semibold uppercase tracking-wider bg-transparent hover:bg-transparent hover:opacity-70 h-auto px-3 py-2',
                      'text-[#1a1a1a]'
                    )}
                  >
                    <Link href="/#products">BUY</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right Side Actions - same width as left on mobile so logo stays centered */}
            <div className="flex items-center justify-end flex-shrink-0 w-10 space-x-4 lg:w-auto lg:flex-1 lg:justify-end">
              {/* User Profile / Login */}
              {!authLoading && (
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push('/account/orders')
                    } else {
                      router.push('/account/login')
                    }
                  }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 transition-colors text-[#1a1a1a] hover:opacity-70 font-semibold text-sm uppercase tracking-wider"
                  aria-label={isAuthenticated ? 'My Account' : 'Login'}
                >
                  <User className="w-5 h-5" />
                  <span>{isAuthenticated ? 'My Account' : 'Login'}</span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 transition-colors text-[#1a1a1a] hover:opacity-70"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#1a1a1a] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm font-semibold uppercase tracking-wide py-2 text-[#1a1a1a]"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {!authLoading && (
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      router.push('/account/orders')
                    } else {
                      router.push('/account/login')
                    }
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-sm font-semibold uppercase tracking-wide py-2 text-[#1a1a1a]"
                >
                  {isAuthenticated ? 'My Account' : 'Login'}
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

