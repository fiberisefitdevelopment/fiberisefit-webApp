'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown, ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuth } from '@/contexts/AuthContext'
import { useCampaignStore } from '@/store/campaignStore'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const { openCart, closeCart, getItemCount, isOpen: isCartOpen } = useCartStore()
  const { isAuthenticated } = useAuth()
  const { hydrateCampaign } = useCampaignStore()
  const router = useRouter()
  const itemCount = getItemCount()

  useEffect(() => {
    hydrateCampaign()
  }, [hydrateCampaign])

  useEffect(() => {
    if (isCartOpen) setIsMobileMenuOpen(false)
  }, [isCartOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setProductsOpen(false)
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      if (!useCartStore.getState().isOpen) document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'SCIENCE', href: '/science' },
    { name: 'CONTACT', href: '/contact' },
    { name: 'LYTE', href: '/lyte' },
    { name: 'BUY', href: '/#products' },
  ]

  const mobileProducts = [
    { name: 'Starter Pack', href: '/products/starter-pack' },
    { name: 'Transformation Pack', href: '/products/transformation-pack' },
    { name: 'Ultimate Pack', href: '/products/ultimate-pack' },
    { name: 'Elite Pack', href: '/products/elite-pack' },
  ]

  return (
    <>
      {/* Announcement Bar - Single Marquee */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black py-1 overflow-hidden">
        <div className="flex w-max animate-marquee-text whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex gap-12 flex-shrink-0 pr-12 items-center">
              <span className="text-xs md:text-sm text-white tracking-wider">Introductory 50% OFF</span>
              <span className="text-xs md:text-sm text-white tracking-wider">India’s first Craving Control Supplement</span>
              <span className="text-xs md:text-sm text-white tracking-wider">Sustainable Weight Management</span>
              <span className="text-xs md:text-sm text-white tracking-wider">Free Shipping Pan India</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Frosty Navbar */}
      <header
        className={`fixed left-0 right-0 z-40 top-7 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/60 backdrop-blur-xl border-b border-white/20 shadow-lg'
            : 'bg-white/40 backdrop-blur-lg border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center h-12 md:h-14 w-full">
            <div className="lg:hidden w-10 flex-shrink-0 flex items-center justify-start">
              <button
                type="button"
                className="p-1.5 transition-colors text-[#1a1a1a]"
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setIsMobileMenuOpen(false)
                    return
                  }
                  closeCart()
                  setIsMobileMenuOpen(true)
                }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            <Link
              href="/"
              className="lg:hidden flex-1 flex justify-center items-center min-w-0"
              aria-label="Fiberise - Go to home"
            >
              <Image
                src="/fiberisefit dark logo.png"
                alt=""
                aria-hidden
                width={88}
                height={22}
                className="object-contain object-center w-[5.5rem] h-[1.375rem] select-none text-transparent"
                loading="eager"
              />
            </Link>

            <Link
              href="/"
              className="hidden lg:block flex-shrink-0 relative h-7 w-28"
              aria-label="Fiberise - Go to home"
            >
              <Image
                src="/fiberisefit dark logo.png"
                alt=""
                aria-hidden
                fill
                className="object-contain object-left select-none text-transparent"
                sizes="112px"
                loading="eager"
              />
            </Link>

            <NavigationMenu className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10">
              <NavigationMenuList className="flex items-center gap-0">
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

            <div className="flex items-center justify-end flex-shrink-0 w-10 lg:w-auto lg:flex-1 lg:gap-4">
              <button
                type="button"
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/account/orders')
                  } else {
                    router.push('/account/login')
                  }
                }}
                className="hidden lg:flex items-center gap-2 px-2 py-1.5 transition-colors text-[#1a1a1a] hover:opacity-70 font-semibold text-sm uppercase tracking-wider"
                aria-label={isAuthenticated ? 'My Account' : 'Login'}
              >
                <User className="w-5 h-5" />
                <span>{isAuthenticated ? 'My Account' : 'Login'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openCart()
                }}
                className="relative p-1.5 lg:p-2 transition-colors text-[#1a1a1a] hover:opacity-70"
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

      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[calc(1.75rem+3rem)] z-[60] md:top-[calc(1.75rem+3.5rem)] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
            <nav className="animate-menu-drawer absolute bottom-0 left-0 top-0 flex w-52 max-w-[62vw] flex-col overflow-y-auto bg-white px-5 py-8 shadow-2xl">
              {navLinks.map((link, index) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    style={{ animationDelay: `${index * 70}ms` }}
                    className="animate-menu-item block py-3 text-sm font-semibold uppercase tracking-wide text-[#1a1a1a]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.name === 'LYTE' && (
                    <div className="animate-menu-item" style={{ animationDelay: `${index * 70 + 40}ms` }}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold uppercase tracking-wide text-[#1a1a1a]"
                        aria-expanded={productsOpen}
                        onClick={() => setProductsOpen((open) => !open)}
                      >
                        Products
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${productsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ${productsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <div className="overflow-hidden">
                          {mobileProducts.map((product) => (
                            <Link
                              key={product.href}
                              href={product.href}
                              className="block py-2 pl-4 text-sm text-[#3a3a3a]"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {product.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            <button
              type="button"
              style={{ animationDelay: `${navLinks.length * 70}ms` }}
              onClick={() => {
                router.push(isAuthenticated ? '/account/orders' : '/account/login')
                setIsMobileMenuOpen(false)
              }}
              className="animate-menu-item py-3 text-left text-sm font-semibold uppercase tracking-wide text-[#1a1a1a]"
            >
              {isAuthenticated ? 'My Account' : 'Login'}
            </button>
          </nav>
        </div>
      )}
    </>
  )
}

