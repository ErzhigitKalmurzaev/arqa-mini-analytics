import { useTranslation } from 'react-i18next'
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table'    
import Input from '../../../components/ui/Input'
import PageHeader from '../../../components/common/PageHeader'
import EmptyState from '../../../components/ui/EmptyState'
import Skeleton from '../../../components/ui/Skeleton'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { getStatements, postStatement } from '../../../store/director/orderSlice'
import { formatDateTime } from '../../../utils/functions'

export default function Statement() {

  const { t } = useTranslation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { statements, statements_status } = useAppSelector(state => state.order);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(getStatements())
  }, [])

  const choseStatement = (data: any) => {
      dispatch(postStatement(data)).then(() => dispatch(getStatements()))
  }

  return (
    <div className="space-y-6 p-3">
      <PageHeader
        title={'Заявки'}
        actions={(
          <></>
        )}
      />

      {statements_status === 'loading' ? (
        <Skeleton className="h-48" />
      ) : statements.length === 0 ? (
        <EmptyState title={'Нет заявок'} description={'По вашему запросу ничего не нашлось'} />
      ) : (
        <Table>
          <THead>
            <TR className='bg-gray-400'>
              <TH>Сотрудник</TH>
              <TH>Товар</TH>
              <TH>Действие</TH>
            </TR>
          </THead>
          <TBody>
            {statements.map(c => (
              <TR key={c.id} className="cursor-pointer">
                <TD>{c.staff.fullname}</TD>
                <TD>{c.product.title}</TD>
                <TD>
                    <div className='flex gap-x-4'>
                        <button className='bg-green-600 hover:bg-green-700 w-19 h-7 rounded' onClick={() => choseStatement({ statement_id: c.id, is_success: true })}>Принять</button>
                        <button className='bg-red-600 hover:bg-red-700 w-16 h-7 rounded' onClick={() => choseStatement({ statement_id: c.id, is_success: false })}>Нет</button>
                    </div>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  )
}