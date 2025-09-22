import * as Dialog from '@radix-ui/react-dialog'
import { useOrders } from '../../hooks/useOrders'
import type { Customer } from '../../hooks/useCustomers'
import StatusBadge from '../ui/StatusBadge'
import { Card } from '../ui/Card'

export default function CustomerDialog({ customer, open, onOpenChange }: { customer: Customer | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const { data: orders = [] } = useOrders()
  const list = (orders || []).filter(o => o.customerId === customer?.id).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl rounded-lg border bg-white p-0 shadow-xl focus:outline-none text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold" id="customer-dialog-title">
              {customer ? `${customer.name} • ${customer.email}` : 'Customer'}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">
              Мини-таймлайн заказов клиента
            </Dialog.Description>
            <Dialog.Close aria-label="Close" className="h-8 px-3 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">✕</Dialog.Close>
          </div>
          <div className="p-4">
            {list.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">Нет заказов</div>
            ) : (
              <div className="space-y-4">
                {list.map(o => (
                  <Card key={o.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{o.id}</div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-between">
                      <span>{new Date(o.date).toLocaleDateString()}</span>
                      <span className="font-semibold">{o.total.toLocaleString()} ₸</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="p-3 border-t dark:border-gray-800 text-right">
            <Dialog.Close className="h-9 px-4 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Close</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


