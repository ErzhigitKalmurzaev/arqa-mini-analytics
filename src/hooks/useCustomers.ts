import { useQuery } from '@tanstack/react-query'
import customersData from '../data/customers.json'

export type Customer = {
  id: string
  name: string
  email: string
  city?: string
  ltv?: number
  ordersCount?: number
}

async function fetchCustomers(): Promise<Customer[]> {
  const data = customersData as unknown as { customers: Customer[] }
  return Promise.resolve(data.customers || [])
}

export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    staleTime: 5 * 60 * 1000,
  })
}


