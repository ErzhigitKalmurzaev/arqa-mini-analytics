// pages/auth/Login.tsx
import { useState } from "react"
import type { FormEvent, ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { logIn } from "../../store/auth/authSlice"
import { toast } from "react-toastify"
import { useAppDispatch } from "../../store/hooks"

interface LoginForm {
  login: string
  password: string
}

interface ValidationErrors {
  login?: string
  password?: string
}

const Login = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    login: '',
    password: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    if (!form.login.trim()) {
      newErrors.login = 'Введите логин'
      isValid = false
    }

    if (!form.password) {
      newErrors.password = 'Введите пароль'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    if (!validateForm()) return
  
    setIsSubmitting(true)
  
    try {
      const result = await dispatch(
        logIn({ username: form.login, password: form.password })
      ).unwrap() // Используем unwrap() для получения payload или выброса ошибки
      
      console.log(result)
      
      // Навигация происходит только после успешного обновления Redux state
      toast.success("Вы успешно вошли!")
      navigate("/crm")
    } catch (error: any) {
      console.error("Ошибка авторизации:", error)
      toast.error(
        error?.response?.data?.detail || "Неверный логин или пароль"
      )
      setErrors({ login: "Неверный логин или пароль" })
    } finally {
      setIsSubmitting(false)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        
        {/* Логотип/Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Добро пожаловать
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Войдите в свою учетную запись
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Логин */}
            <div className="space-y-2">
              <label 
                htmlFor="login" 
                className="block text-sm text-start font-medium text-gray-700 dark:text-gray-300"
              >
                Логин
              </label>
              <input
                type="text"
                id="login"
                name="login"
                value={form.login}
                onChange={handleChange}
                autoComplete="username"
                placeholder="Введите логин"
                className={`w-full px-4 py-3 text-base border rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.login 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.login && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.login}
                </p>
              )}
            </div>

            {/* Пароль */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm text-start font-medium text-gray-700 dark:text-gray-300"
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  className={`w-full px-4 py-3 text-base border rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-12 ${
                    errors.password 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
            >
              {isSubmitting ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Нет доступа? Обратитесь к администратору
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login