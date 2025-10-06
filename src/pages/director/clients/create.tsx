import { useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import PageHeader from "../../../components/common/PageHeader"
import { FormField } from "../../../components/ui/FormField"
import { BackButton } from "../../../components/ui/BackButton"
import { useAppDispatch } from "../../../store/hooks"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import type { IClientProps } from "../../../types/director/ClientTypes"
import { createClient } from "../../../store/director/clientSlice"

interface ValidationErrors {
  fullname?: string
  username?: string
  password?: string
}

const ClientCreate = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [client, setClient] = useState<IClientProps>({
    fullname: '',
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: keyof IClientProps, value: string | number | undefined): string | undefined => {
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
  
      case 'password':
        if (!String(value)) return 'Это поле обязательно для заполнения';
        if (String(value).length < 5) return 'Минимум 6 символов';
        return undefined;
  
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
  
    (Object.keys(client) as (keyof IClientProps)[]).forEach((fieldName) => {
      const error = validateField(fieldName, client[fieldName]);
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
    setClient(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof IClientProps]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      await dispatch(createClient(client)).unwrap();
      toast.success('Клиент успешно создан!');
      handleReset(); // очистим форму после успеха
      navigate('/crm/clients')
    } catch (error) {
      console.error('Ошибка при создании клинета:', error);
      toast.error('Произошла ошибка при создании клинета');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleReset = () => {
    setClient({ fullname: '', username: '', password: '' })
    setErrors({})
  }

  return (
    <div className="w-full h-screen flex flex-col p-3">
      <BackButton className="mb-2"/>

      <PageHeader title="Создание клиента" />
      
      <div className="flex-1 overflow-auto my-3">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <FormField
              label="ФИО"
              name="fullname"
              value={client.fullname}
              error={errors.fullname}
              placeholder="Введите ФИО"
              required
              onChange={handleInputChange}
            />

            <FormField
              label="Логин"
              name="username"
              value={client.username}
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
              value={client.password || ''}
              error={errors.password}
              placeholder="Введите пароль"
              autoComplete="new-password"
              required
              onChange={handleInputChange}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Создание...' : 'Создать клиента'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 light:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Очистить
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default ClientCreate