export interface OrderItem {
  title: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  name: string
  date: string
  total: number
  currency: string
  paymentStatus: string
  fulfillmentStatus: string
  items: OrderItem[]
}

