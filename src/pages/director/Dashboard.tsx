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
  const orders: any[] = [];
  const isLoading = false
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({ period: '30d' })

  const filtered = useMemo(() => {
  }, [orders, filters])

  const cities = useMemo(() => Array.from(new Set(orders.map(o => o.city).filter(Boolean))) as string[], [orders])
  const channels = useMemo(() => Array.from(new Set(orders.map(o => o.channel).filter(Boolean))) as string[], [orders])

  return (
    <div className="space-y-6 p-3">
      <PageHeader
        title={t('dashboard')}
        actions={(
          <div className="flex gap-2">
            <button className="h-9 px-4 rounded border hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800" onClick={() => setFiltersOpen(true)}>Filters</button>
            <button className="h-9 px-4 rounded border bg-blue-600 text-white hover:bg-blue-700">Export CSV</button>
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-5">
          <div className="text-sm text-gray-500">{t('revenue')}</div>
          <div className="mt-2 text-2xl font-semibold">{100}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-gray-500">{t('orders')}</div>
          <div className="mt-2 text-2xl font-semibold">{100}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-gray-500">{t('aov')}</div>
          <div className="mt-2 text-2xl font-semibold">{100}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-gray-500">{t('conversion')}</div>
          <div className="mt-2 text-2xl font-semibold">{(100)}%</div>
        </Card>
      </div>

      <Card className="p-5">
        {isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <FiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        value={filters}
        onApply={setFilters}
        cities={cities}
        channels={channels}
      />
    </div>
  )
}