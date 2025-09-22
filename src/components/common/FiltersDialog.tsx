import * as Dialog from '@radix-ui/react-dialog'
import { useMemo, useState } from 'react'

export type PeriodPreset = '7d' | '30d' | 'qtd' | 'ytd' | 'custom'
export type Filters = {
  period: PeriodPreset
  from?: string
  to?: string
  channel?: string
  city?: string
}

export default function FiltersDialog({
  open,
  onOpenChange,
  value,
  onApply,
  cities,
  channels,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  value: Filters
  onApply: (v: Filters) => void
  cities: string[]
  channels: string[]
}) {
  const [local, setLocal] = useState<Filters>(value)
  const isCustom = local.period === 'custom'

  const presets: Array<{ key: PeriodPreset; label: string }> = useMemo(
    () => [
      { key: '7d', label: 'Last 7 days' },
      { key: '30d', label: 'Last 30 days' },
      { key: 'qtd', label: 'Quarter to date' },
      { key: 'ytd', label: 'Year to date' },
      { key: 'custom', label: 'Custom' },
    ],
    []
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg rounded-lg border bg-white p-0 shadow-xl focus:outline-none text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold" id="filters-dialog-title">Filters</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400">Select period and optional filters</Dialog.Description>
            <Dialog.Close aria-label="Close" className="h-8 px-3 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">✕</Dialog.Close>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Period</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map(p => (
                  <button
                    key={p.key}
                    className={`h-9 rounded border px-3 text-sm ${local.period === p.key ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'} `}
                    onClick={() => setLocal(prev => ({ ...prev, period: p.key }))}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            {isCustom ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="text-sm mb-1">From</div>
                  <input type="date" className="h-9 w-full rounded border px-3 text-sm dark:border-gray-700 dark:bg-gray-900" value={local.from || ''} onChange={e => setLocal(prev => ({ ...prev, from: e.target.value }))} />
                </div>
                <div>
                  <div className="text-sm mb-1">To</div>
                  <input type="date" className="h-9 w-full rounded border px-3 text-sm dark:border-gray-700 dark:bg-gray-900" value={local.to || ''} onChange={e => setLocal(prev => ({ ...prev, to: e.target.value }))} />
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <div className="text-sm mb-1">Channel</div>
                <select className="h-9 w-full rounded border px-3 text-sm dark:border-gray-700 dark:bg-gray-900" value={local.channel || ''} onChange={e => setLocal(prev => ({ ...prev, channel: e.target.value || undefined }))}>
                  <option value="">All</option>
                  {channels.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="text-sm mb-1">City</div>
                <select className="h-9 w-full rounded border px-3 text-sm dark:border-gray-700 dark:bg-gray-900" value={local.city || ''} onChange={e => setLocal(prev => ({ ...prev, city: e.target.value || undefined }))}>
                  <option value="">All</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="p-3 border-t dark:border-gray-800 flex justify-end gap-2">
            <Dialog.Close className="h-9 px-4 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</Dialog.Close>
            <button
              className="h-9 px-4 rounded border bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => { onApply(local); onOpenChange(false) }}
            >
              Apply
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


