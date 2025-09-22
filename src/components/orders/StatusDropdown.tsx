import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useUpdateOrderStatus, type Order } from '../../hooks/useOrders'

const options: Order['status'][] = ['New', 'Processing', 'Shipped', 'Cancelled']

export default function StatusDropdown({ id, status }: { id: string; status: Order['status'] }) {
  const update = useUpdateOrderStatus()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="h-8 px-3 rounded border text-xs hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          {status}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-50 min-w-[160px] rounded-md border bg-white p-1 shadow-md text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          {options.map(opt => (
            <DropdownMenu.Item
              key={opt}
              className={`px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${opt === status ? 'text-blue-600' : ''}`}
              onClick={() => void update(id, opt)}
            >
              {opt}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}


