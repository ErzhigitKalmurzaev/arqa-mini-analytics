// components/common/FormField.tsx
import type { ChangeEvent } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'password' | 'email' | 'number'
  value: string | number
  error?: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  error,
  placeholder,
  required = false,
  autoComplete,
  onChange
}: FormFieldProps) => {
  return (
    <div className="space-y-2 flex flex-col justify-start">
      <label htmlFor={name} className="text-sm text-start font-medium dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm dark:placeholder:text-gray-400 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="inline-block w-4 h-4 text-center mb-1">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}

interface FormSelectProps {
  label: string
  name: string
  value: string | number
  error?: string
  required?: boolean
  options: { value: string | number; label: string }[]
  placeholder?: string
  onChange: (value: any) => void
}

export const FormSelect = ({
  label,
  name,
  value,
  error,
  required = false,
  options,
  placeholder = 'Выберите...',
  onChange
}: FormSelectProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-start text-sm font-medium dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm dark:placeholder:text-gray-400 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="inline-block w-4 h-4 text-center">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}