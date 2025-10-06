import { useTranslation } from 'react-i18next'
import { Card } from '../../components/ui/Card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import Skeleton from '../../components/ui/Skeleton'
import FiltersDialog, { type Filters } from '../../components/common/FiltersDialog'
import { useMemo, useState } from 'react'
import { downloadCsv } from '../../utils/csv'

export default function Dashboard() {
  const { t } = useTranslation()
  // const orders: any[] = [];
  // const isLoading = false
  // const [filtersOpen, setFiltersOpen] = useState(false)
  // const [filters, setFilters] = useState<Filters>({ period: '30d' })

  // const filtered = useMemo(() => {
  //   const end = new Date()
  //   let start = new Date()
  //   const qStart = new Date(end.getFullYear(), Math.floor(end.getMonth() / 3) * 3, 1)
  //   if (filters.period === '7d') start.setDate(end.getDate() - 6)
  //   else if (filters.period === '30d') start.setDate(end.getDate() - 29)
  //   else if (filters.period === 'qtd') start = qStart
  //   else if (filters.period === 'ytd') start = new Date(end.getFullYear(), 0, 1)
  //   else if (filters.period === 'custom' && filters.from && filters.to) {
  //     start = new Date(filters.from)
  //     ;(end as unknown as Date) = new Date(filters.to)
  //   }
  //   return orders.filter(o => {
  //     const d = new Date(o.date)
  //     if (d < start || d > end) return false
  //     if (filters.channel && o.channel !== filters.channel) return false
  //     if (filters.city && o.city !== filters.city) return false
  //     return true
  //   })
  // }, [orders, filters])

  // const revenue = filtered.reduce((sum, o) => sum + (o.total || 0), 0)
  // const aov = filtered.length ? revenue / filtered.length : 0
  // const conversion = 0.12 // placeholder
  // const daily = useMemo(() => {
  //   const map = new Map<string, { revenue: number; orders: number }>()
  //   for (const o of filtered) {
  //     const key = o.date
  //     const cur = map.get(key) || { revenue: 0, orders: 0 }
  //     cur.revenue += o.total || 0
  //     cur.orders += 1
  //     map.set(key, cur)
  //   }
  //   return Array.from(map.entries())
  //     .sort((a, b) => a[0].localeCompare(b[0]))
  //     .map(([date, v]) => ({ date, total: v.revenue, orders: v.orders }))
  // }, [filtered])
  // const chartData = daily

  // const cities = useMemo(() => Array.from(new Set(orders.map(o => o.city).filter(Boolean))) as string[], [orders])
  // const channels = useMemo(() => Array.from(new Set(orders.map(o => o.channel).filter(Boolean))) as string[], [orders])

  // function onExport() {
  //   const now = new Date()
  //   const name = `revenue_${filters.period}_${now.toISOString().slice(0,10)}.csv`
  //   downloadCsv(
  //     name,
  //     chartData.map(r => ({ date: r.date, revenue: r.total, orders: r.orders })),
  //     ['date', 'revenue', 'orders'],
  //     { bom: true, crlf: true, headerLabels: { date: 'Date', revenue: 'Revenue', orders: 'Orders' } }
  //   )
  // }

  return (
    // <div className="space-y-6 p-3">
    //   <PageHeader
    //     title={t('dashboard')}
    //     actions={(
    //       <div className="flex gap-2">
    //         <button className="h-9 px-4 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => setFiltersOpen(true)}>Filters</button>
    //         <button className="h-9 px-4 rounded border bg-blue-600 text-white hover:bg-blue-700" onClick={onExport}>Export CSV</button>
    //       </div>
    //     )}
    //   />

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //     <Card className="p-5">
    //       <div className="text-sm text-gray-500">{t('revenue')}</div>
    //       <div className="mt-2 text-2xl font-semibold">{revenue.toLocaleString()}</div>
    //     </Card>
    //     <Card className="p-5">
    //       <div className="text-sm text-gray-500">{t('orders')}</div>
    //       <div className="mt-2 text-2xl font-semibold">{orders.length}</div>
    //     </Card>
    //     <Card className="p-5">
    //       <div className="text-sm text-gray-500">{t('aov')}</div>
    //       <div className="mt-2 text-2xl font-semibold">{aov.toFixed(2)}</div>
    //     </Card>
    //     <Card className="p-5">
    //       <div className="text-sm text-gray-500">{t('conversion')}</div>
    //       <div className="mt-2 text-2xl font-semibold">{(conversion * 100).toFixed(1)}%</div>
    //     </Card>
    //   </div>

    //   <Card className="p-5">
    //     {isLoading ? (
    //       <Skeleton className="h-80" />
    //     ) : (
    //       <div className="h-80">
    //         <ResponsiveContainer width="100%" height="100%">
    //           <LineChart data={chartData}>
    //             <XAxis dataKey="date" />
    //             <YAxis />
    //             <Tooltip />
    //             <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={false} />
    //           </LineChart>
    //         </ResponsiveContainer>
    //       </div>
    //     )}
    //   </Card>

    //   <FiltersDialog
    //     open={filtersOpen}
    //     onOpenChange={setFiltersOpen}
    //     value={filters}
    //     onApply={setFilters}
    //     cities={cities}
    //     channels={channels}
    //   />
    // </div>

    <div>
      Dashboard Page
    </div>
  )
}