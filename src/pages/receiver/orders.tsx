import { useTranslation } from 'react-i18next'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table'
import { useEffect, useState } from 'react'
import Input from '../../components/ui/Input'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import Pagination from '../../components/ui/Pagination'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getOrders, getValueOrder } from '../../store/receiver/ordersSlice'
import { formatDateTime } from '../../utils/functions'
import type { IOrder } from '../../types/receiver/orderType'

export default function Orders() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { orders, orders_status } = useAppSelector(state => state.receiver_orders)
  
  useEffect(() => {
    dispatch(getOrders());
  }, [])
  
  const selectOrder = (data: IOrder) => {
    navigate(`/crm/orders/${data.id}`)
    dispatch(getValueOrder(data));
  }

  return (
    <div className="space-y-6 p-3">
      <PageHeader
        title={t('orders')}
        actions={(
          <div className="flex gap-2">
            <button className="h-9 px-4 rounded border bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate('/orders/create')}>+ Создать</button>
          </div>
        )}
      />

      <div className="flex gap-2">
        <Input placeholder={'Поиск...'} value={q} onChange={e => setQ(e.target.value)} className="" />
        <button className="h-9 px-3 rounded text-sm bg-blue-600 text-white hover:bg-blue-700">Поиск</button>
      </div>

      {orders_status === 'loading' ? (
        <Skeleton className="h-48" />
      ) : orders.length === 0 ? (
        <EmptyState title={t('no_results') || 'No results'} description={t('try_adjusting_filters') || 'Try adjusting your filters.'} />
      ) : (
        <>
        <Table>
          <THead>
            <TR>
              <TH>Название</TH>
              <TH>Статус</TH>
              <TH>Дата</TH>
            </TR>
          </THead>
          <TBody>
            {orders.slice((page-1)*pageSize, page*pageSize).map(o => (
              <TR key={o.id} className="cursor-pointer" onClick={() => selectOrder(o)}>
                <TD>{o.client_info.fullname}</TD>
                <TD><StatusBadge status={o.status} /></TD>
                <TD>{formatDateTime(o.created_at)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
        <Pagination page={page} pageSize={pageSize} total={orders.length} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}