import { useTranslation } from 'react-i18next'
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table'    
import Input from '../../../components/ui/Input'
import PageHeader from '../../../components/common/PageHeader'
import EmptyState from '../../../components/ui/EmptyState'
import Skeleton from '../../../components/ui/Skeleton'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getClients } from '../../../store/director/clientSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'

export default function Customers() {

  const { t } = useTranslation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { clients, clients_status } = useAppSelector(state => state.client);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(getClients())
  }, [])

  return (
    <div className="space-y-6 p-3">
      <PageHeader
        title={t('customers')}
        actions={(
          <div className="flex flex-wrap gap-2">
            <button className="h-9 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate('/crm/clients/create')}>Добавить</button>
          </div>
        )}
      />
      
      <div className="flex gap-2">
        <Input placeholder={'Поиск...'} value={q} onChange={e => setQ(e.target.value)} className="" />
        <button className="h-9 px-3 rounded text-sm bg-blue-600 text-white hover:bg-blue-700">Поиск</button>
      </div>

      {clients_status === 'loading' ? (
        <Skeleton className="h-48" />
      ) : clients.length === 0 ? (
        <EmptyState title={t('no_results') || 'No results'} description={t('try_adjusting_filters') || 'Try adjusting your filters.'} />
      ) : (
        <Table>
          <THead>
            <TR className='bg-gray-400'>
              <TH>Имя</TH>
            </TR>
          </THead>
          <TBody>
            {clients.map(c => (
              <TR key={c.id} className="cursor-pointer" onClick={() => navigate(`/crm/clients/${c.id}`)}>
                <TD>{c.fullname}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
      {/* <CustomerDialog customer={selected} open={open} onOpenChange={setOpen} /> */}
    </div>
  )
}