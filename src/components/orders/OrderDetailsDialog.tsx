import * as Dialog from '@radix-ui/react-dialog'
import type { Order } from '../../hooks/useOrders'

export default function OrderDetailsDialog({ order, open, onOpenChange }: { order: Order | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xl rounded-lg border bg-white p-0 shadow-xl focus:outline-none text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold" id="order-dialog-title">Order {order?.id}</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Details and items</Dialog.Description>
            <Dialog.Close aria-label="Close" className="h-8 px-3 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">✕</Dialog.Close>
          </div>
          <div className="p-4 space-y-3">
            {order ? (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-300">Date: {order.date}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">City: {order.city}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Channel: {order.channel}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Total: {order.total.toLocaleString()}</div>
                <div>
                  <div className="font-medium mb-1">Items</div>
                  <div className="rounded border dark:border-gray-800 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-3 py-2 text-left">SKU</th>
                          <th className="px-3 py-2 text-left">Name</th>
                          <th className="px-3 py-2 text-left">Qty</th>
                          <th className="px-3 py-2 text-left">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.items || []).map((it, idx) => (
                          <tr key={idx} className="odd:bg-white even:bg-gray-50/50 dark:odd:bg-gray-950 dark:even:bg-gray-900/40">
                            <td className="px-3 py-2">{it.sku}</td>
                            <td className="px-3 py-2">{it.name}</td>
                            <td className="px-3 py-2">{it.qty}</td>
                            <td className="px-3 py-2">{it.price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {order.comment ? (
                  <div className="text-sm text-gray-600 dark:text-gray-300">Comment: {order.comment}</div>
                ) : null}
              </>
            ) : null}
          </div>
          <div className="p-3 border-t dark:border-gray-800 text-right">
            <Dialog.Close className="h-9 px-4 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Close</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


