import { useTranslation } from 'react-i18next'
import { useCustomers, type Customer } from '../hooks/useCustomers'
import { useMemo, useState } from 'react'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'    
import Input from '../components/ui/Input'
import PageHeader from '../components/common/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import CustomerDialog from '../components/customers/CustomerDialog'

export default function Customers() {
  const { t } = useTranslation()
  const { data: customers = [], isLoading } = useCustomers()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  const cities = useMemo(() => Array.from(new Set(customers.map(c => c.city).filter(Boolean))) as string[], [customers])
  const filtered = useMemo(
    () =>
      customers.filter(c =>
        (!city || c.city === city) &&
        [c.name, c.email, c.city].join(' ').toLowerCase().includes(q.toLowerCase())
      ),
    [customers, q, city]
  )

  const [selected, setSelected] = useState<Customer | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('customers')}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Input placeholder={t('search') || 'Search'} value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
            <select value={city} onChange={e => setCity(e.target.value)} className="h-9 rounded border px-3 text-sm dark:border-gray-700 dark:bg-gray-900">
              <option value="">{t('filters')}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      />
      {isLoading ? (
        <Skeleton className="h-48" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('no_results') || 'No results'} description={t('try_adjusting_filters') || 'Try adjusting your filters.'} />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>City</TH>
              <TH>LTV</TH>
              <TH>Orders</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map(c => (
              <TR key={c.id} onClick={() => { setSelected(c); setOpen(true) }} className="cursor-pointer">
                <TD>{c.name}</TD>
                <TD>{c.email}</TD>
                <TD>{c.city}</TD>
                <TD>{(c.ltv || 0).toLocaleString()}</TD>
                <TD>{c.ordersCount || 0}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
      <CustomerDialog customer={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}