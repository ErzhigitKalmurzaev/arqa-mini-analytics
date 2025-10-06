// pages/employee/EmployeeCreate.tsx
'use client'
import { useEffect, useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import PageHeader from "../../../components/common/PageHeader"
import { FormField, FormSelect } from "../../../components/ui/FormField"
import { BackButton } from "../../../components/ui/BackButton"
import { useAppDispatch } from "../../../store/hooks"
import { deleteEmployee, editEmployee, getEmployeeById } from "../../../store/director/employeeSlice"
import type { EmployeeProps } from "../../../types/director/EmployeeTypes"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import { roles } from "../../../utils/constants"

interface ValidationErrors {
  fullname?: string
  username?: string
  password?: string
  role?: string
}

const EmployeeEdit = () => {

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<EmployeeProps>({
    fullname: '',
    username: '',
    password: '',
    role: 0
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await dispatch(getEmployeeById(id)).unwrap();
        setEmployee({
          fullname: data.fullname,
          username: data.user.username,
          password: '', // пароль не возвращается, задаем пустым
          role: data.role,
        });
      } catch (error) {
        console.error('Ошибка при загрузке сотрудника:', error);
      }
    };
  
    fetchEmployee();
  }, [dispatch, id]);
  

  const validateField = (name: keyof EmployeeProps, value: string | number | undefined): string | undefined => {
    switch (name) {
      case 'fullname':
        if (!String(value).trim()) return 'Это поле обязательно для заполнения';
        if (String(value).trim().length < 2) return 'Минимум 2 символа';
        return undefined;
  
      case 'username':
        if (!String(value).trim()) return 'Это поле обязательно для заполнения';
        if (String(value).trim().length < 3) return 'Минимум 3 символа';
        if (!/^[a-zA-Z0-9_]+$/.test(String(value))) return 'Только латинские буквы, цифры и подчеркивание';
        return undefined;
  
      case 'role':
        if (!value || value === 0) return 'Выберите роль';
        return undefined;
  
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
  
    (Object.keys(employee) as (keyof EmployeeProps)[]).forEach((fieldName) => {
      const error = validateField(fieldName, employee[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployee(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof EmployeeProps]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (value: number) => {
    setEmployee(prev => ({ ...prev, role: value }))
    
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const { password, ...rest } = employee;
      const payload = password ? employee : rest;

      await dispatch(editEmployee({employee: payload, id: id})).unwrap();
      toast.success('Сотрудник успешно изменен!');
      handleReset(); // очистим форму после успеха
      navigate('/crm/employees')
    } catch (error) {
      console.error('Ошибка при редактировании сотрудника:', error);
      toast.error('Произошла ошибка при редактировании сотрудника');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleReset = () => {
    setEmployee({ fullname: '', username: '', password: '', role: 0 })
    setErrors({})
  }

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить сотрудника?')) {
      dispatch(deleteEmployee({ id })).then(() => {
        toast.success('Сотрудник успешно удален!');
        navigate('/crm/employees')
      }).catch(() => {
        toast.error('Произошла ошибка при удалении сотрудника');
      });
    }
  }

  return (
    <div className="w-full h-screen flex flex-col p-3">
      <BackButton className="mb-2"/>

      <PageHeader title="Редактирование сотрудника" />
      
      <div className="flex-1 overflow-auto my-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <FormField
              label="ФИО"
              name="fullname"
              value={employee.fullname}
              error={errors.fullname}
              placeholder="Введите ФИО"
              required
              onChange={handleInputChange}
            />

            <FormField
              label="Логин"
              name="username"
              value={employee.username}
              error={errors.username}
              placeholder="Введите логин"
              autoComplete="off"
              required
              onChange={handleInputChange}
            />

            <FormField
              label="Пароль"
              name="password"
              type="password"
              value={employee.password || ''}
              error={errors.password}
              placeholder="Введите пароль"
              autoComplete="new-password"
              required
              onChange={handleInputChange}
            />

            <FormSelect
              label="Роль"
              name="role"
              value={employee.role}
              error={errors.role}
              options={roles}
              placeholder="Выберите роль"
              required
              onChange={handleSelectChange}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white light:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Очистить
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default EmployeeEdit