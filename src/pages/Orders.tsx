import { useTranslation } from 'react-i18next'
import { useOrders, type Order } from '../hooks/useOrders'
import { useCustomers } from '../hooks/useCustomers'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'
import { useMemo, useState } from 'react'
import Input from '../components/ui/Input'
import PageHeader from '../components/common/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import StatusDropdown from '../components/orders/StatusDropdown'
import OrderDetailsDialog from '../components/orders/OrderDetailsDialog'
import { downloadCsv } from '../utils/csv'
import Pagination from '../components/ui/Pagination'

export default function Orders() {
  const { t } = useTranslation()
  const { data: orders = [], isLoading } = useOrders()
  const { data: customers = [] } = useCustomers()
  const [q, setQ] = useState('')

  const [sortKey, setSortKey] = useState<'id'|'date'|'status'|'total'>('date')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const filtered = useMemo(() => {
    const base = orders.filter(o => [o.id, o.status, o.city, o.channel].join(' ').toLowerCase().includes(q.toLowerCase()))
    const sorted = [...base].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'total') return (a.total - b.total) * dir
      const va = sortKey === 'date' ? a.date : (a as any)[sortKey]
      const vb = sortKey === 'date' ? b.date : (b as any)[sortKey]
      return String(va).localeCompare(String(vb)) * dir
    })
    return sorted
  }, [orders, q, sortKey, sortDir])
  const [selected, setSelected] = useState<Order | null>(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10

  function onExport() {
    const idToName = new Map(customers.map(c => [c.id, c.name]))
    const rows = filtered.map(o => ({ id: o.id, date: o.date, customerId: o.customerId, customer: idToName.get(o.customerId) || '', city: o.city || '', channel: o.channel || '', status: o.status, total: o.total }))
    downloadCsv(
      `orders_${new Date().toISOString().slice(0,10)}.csv`,
      rows,
      ['id','date','customerId','customer','city','channel','status','total'],
      { bom: true, crlf: true, headerLabels: { id: 'Order ID', date: 'Date', customerId: 'Customer ID', customer: 'Customer', city: 'City', channel: 'Channel', status: 'Status', total: 'Total' } }
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('orders')}
        actions={(
          <div className="flex gap-2">
            <Input placeholder={t('search') || 'Search'} value={q} onChange={e => setQ(e.target.value)} className="max-w-xs" />
            <button className="h-9 px-4 rounded border bg-blue-600 text-white hover:bg-blue-700" onClick={onExport}>Export CSV</button>
          </div>
        )}
      />
      {isLoading ? (
        <Skeleton className="h-48" />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('no_results') || 'No results'} description={t('try_adjusting_filters') || 'Try adjusting your filters.'} />
      ) : (
        <>
        <Table>
          <THead>
            <TR>
              <TH><button className="font-semibold" onClick={() => { setSortKey('id'); setSortDir(d => sortKey==='id' && d==='asc' ? 'desc' : 'asc') }} aria-sort={sortKey==='id' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>ID</button></TH>
              <TH><button className="font-semibold" onClick={() => { setSortKey('date'); setSortDir(d => sortKey==='date' && d==='asc' ? 'desc' : 'asc') }} aria-sort={sortKey==='date' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>Date</button></TH>
              <TH><button className="font-semibold" onClick={() => { setSortKey('status'); setSortDir(d => sortKey==='status' && d==='asc' ? 'desc' : 'asc') }} aria-sort={sortKey==='status' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>{t('status')}</button></TH>
              <TH><button className="font-semibold" onClick={() => { setSortKey('total'); setSortDir(d => sortKey==='total' && d==='asc' ? 'desc' : 'asc') }} aria-sort={sortKey==='total' ? (sortDir==='asc'?'ascending':'descending') : 'none'}>Total</button></TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.slice((page-1)*pageSize, page*pageSize).map(o => (
              <TR key={o.id} className="cursor-pointer" onClick={() => { setSelected(o); setOpen(true) }}>
                <TD>{o.id}</TD>
                <TD>{o.date}</TD>
                <TD><StatusBadge status={o.status} /></TD>
                <TD>{o.total.toLocaleString()}</TD>
                <TD>
                  <StatusDropdown id={o.id} status={o.status} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
        <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
        </>
      )}
      <OrderDetailsDialog order={selected} open={open} onOpenChange={setOpen} />
    </div>
  )
}