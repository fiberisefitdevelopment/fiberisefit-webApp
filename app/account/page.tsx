import { redirect } from 'next/navigation'

/** Account home: no separate dashboard — land on Orders */
export default function AccountIndexPage() {
  redirect('/account/orders')
}
