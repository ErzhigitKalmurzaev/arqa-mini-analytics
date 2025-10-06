import { useNavigate } from "react-router-dom"
import PageHeader from "../../../components/common/PageHeader"
import EmptyState from "../../../components/ui/EmptyState";
import Skeleton from "../../../components/ui/Skeleton";
import { Table, THead, TBody, TR, TH, TD } from '../../../components/ui/Table'
import { roles } from "../../../utils/constants";
import { useEffect, useState } from "react";
import Input from "../../../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getEmployees } from "../../../store/director/employeeSlice";


const EmployeesPage = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { employees, employees_status } = useAppSelector(state => state.employee);

  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(getEmployees())
  }, [])

  return (
    <div className="space-y-6 p-3">
      <PageHeader
        title={'Сотрудники'}
        actions={(
          <div className="flex flex-wrap gap-2">
            <button className="h-9 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate('/crm/employees/create')}>Добавить</button>
          </div>
        )}
      />

      <div className="flex gap-2">
        <Input placeholder={'Поиск...'} value={q} onChange={e => setQ(e.target.value)} className="" />
        <button className="h-9 px-3 rounded text-sm bg-blue-600 text-white hover:bg-blue-700">Поиск</button>
      </div>

      {employees_status === 'loading' ? (
        <Skeleton className="h-48" />
      ) : employees.length === 0 ? (
        <EmptyState title={'No results'}/>
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Ф.И.О.</TH>
              <TH>Роль</TH>
            </TR>
          </THead>
          <TBody>
            {employees.map(c => (
              <TR key={c.id} className="cursor-pointer" onClick={() => navigate(`/crm/employees/${c.id}`)}>
                <TD>{c.fullname}</TD>
                <TD>{roles?.find((r: any) => r.value === c.role)?.label}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  )
}

export default EmployeesPage
