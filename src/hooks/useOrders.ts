import { useQuery, useQueryClient } from '@tanstack/react-query'
import ordersData from '../data/orders.json'

export type Order = {
  id: string
  customerId: string
  date: string
  total: number
  status: string
  city?: string
  channel?: string
  items?: Array<{ sku: string; name: string; qty: number; price: number }>
}

async function fetchOrders(): Promise<Order[]> {
  const data = ordersData as unknown as { orders: Order[] }
  return Promise.resolve(data.orders || [])
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return async (id: string, status: Order['status']) => {
    const current = (qc.getQueryData(['orders']) as Order[] | undefined) || []
    const next = current.map(o => (o.id === id ? { ...o, status } : o))
    qc.setQueryData(['orders'], next)
  }
}


