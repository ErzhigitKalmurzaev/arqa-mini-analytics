import { useEffect, useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import PageHeader from "../../../components/common/PageHeader"
import { FormField } from "../../../components/ui/FormField"
import { BackButton } from "../../../components/ui/BackButton"
import { useAppDispatch } from "../../../store/hooks"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"
import type { IClientProps } from "../../../types/director/ClientTypes"
import { deleteClient, editClient, getClientById } from "../../../store/director/clientSlice"

interface ValidationErrors {
  fullname?: string
  username?: string
  password?: string
}

const ClientEdit = () => {

  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [client, setClient] = useState<IClientProps>({
    fullname: '',
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await dispatch(getClientById(id)).unwrap();
        setClient({
          fullname: data.fullname,
          username: data.user.username,
          password: ''
        });
      } catch (error) {
        console.error('Ошибка при загрузке сотрудника:', error);
      }
    };
  
    fetchEmployee();
  }, [dispatch, id]);

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
      const { password, ...rest } = client;
      const payload = password ? client : rest;

      await dispatch(editClient({client: payload, id: id})).unwrap();
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
    setClient({
      fullname: '',
      username: '',
      password: '',
    });
    setErrors({})
  }
  
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить клиента?')) {
      dispatch(deleteClient({ id })).then(() => {
        toast.success('Клиент успешно удален!');
        navigate('/crm/clients')
      }).catch(() => {
        toast.error('Произошла ошибка при удалении клиента');
      });
    }
  }

  return (
    <div className="w-full h-screen flex flex-col p-3">
      <BackButton className="mb-2"/>

      <PageHeader title="Редактрование клиента" />
      
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
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white light:text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Удалить
              </button>
            </div>
          </form>
      </div>
    </div>
  )
}

export default ClientEdit