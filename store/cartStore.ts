import { create } from 'zustand'
import { useCampaignStore } from '@/store/campaignStore'

export interface CartItem {
  id: string // Should be Shopify variant GID (gid://shopify/ProductVariant/123)
  title: string
  price: number
  quantity: number
  image: string
  variant?: string
  variantId?: string // Optional: for backward compatibility
  handle?: string // Optional: Shopify product handle for campaign discount checking
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  paymentMethod: 'prepaid' | 'cod'
  setPaymentMethod: (method: 'prepaid' | 'cod') => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  paymentMethod: 'prepaid',
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  addItem: (item) => {
    const items = get().items
    const existingItem = items.find((i) => i.id === item.id)
    
    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      })
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] })
    }
    get().openCart()
  },
  removeItem: (id) => {
    set({ items: get().items.filter((item) => item.id !== id) })
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }
    set({
      items: get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })
  },
  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ items: [], isOpen: false }),
  getTotal: () => {
    const campaign = useCampaignStore.getState().activeCampaign
    const now = new Date().getTime()
    const isCampaignValid = campaign && now < new Date(campaign.expiresAt).getTime()

    return get().items.reduce((total, item) => {
      let price = item.price

      // Apply dynamic discount calculation
      if (isCampaignValid && item.handle && campaign.applicableProducts.includes(item.handle)) {
        if (campaign.discountType === 'fixed') {
          price = Math.max(0, item.price - campaign.discountValue)
        } else if (campaign.discountType === 'percentage') {
          price = Math.max(0, item.price * (1 - campaign.discountValue / 100))
        }
      }

      return total + price * item.quantity
    }, 0)
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
}))

