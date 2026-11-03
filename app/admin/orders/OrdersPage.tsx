// app/admin/orders/page.tsx
import { createClient } from '@supabase/supabase-js'
import OrdersClient, { type StoreOrder } from './OrdersClient'



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function OrdersPage() {
  const orderSelection = `
      id, status, subtotal, discount_amount, shipping_amount, total, coupon_code, created_at,
      payment_method, payment_status, razorpay_payment_id,
      shiprocket_order_id, tracking_number, courier_name, shipping_booking_state, shipping_package,
      ship_full_name, ship_phone, ship_line1, ship_line2, ship_city, ship_state, ship_postal_code, ship_country,
      items:order_items (
        id, product_id, variation_id, product_name, variation_label, unit_price, quantity, line_total,
        product_variations ( image_url, image_urls, size, color, sku ),
        products ( image_url, product_variations ( image_url, image_urls ) )
      )
    `

  // Supabase returns a limited number of rows per request. Fetch every page so
  // the admin list and its totals include all orders, not just the first 200.
  const pageSize = 500
  const data: unknown[] = []
  let error: { message: string } | null = null

  for (let offset = 0; ; offset += pageSize) {
    const result = await supabase
      .from('orders')
      .select(orderSelection)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (result.error) {
      error = result.error
      break
    }

    const page = result.data ?? []
    data.push(...page)
    if (page.length < pageSize) break
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-[#FAF7F1] px-4 py-6 md:px-10 md:py-10 font-outfit text-black"
        style={{ colorScheme: 'light' }}
      >
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-600">
          Failed to load orders: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#FAF7F1] px-4 py-6 md:px-10 md:py-10 font-outfit text-black"
      style={{ colorScheme: 'light' }}
    >
      <OrdersClient orders={data as StoreOrder[]} />
    </div>
  )
}
