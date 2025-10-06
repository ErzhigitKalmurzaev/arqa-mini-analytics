// components/common/BackButton.tsx
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  label?: string
  className?: string
}

export const BackButton = ({ label = 'Назад', className = '' }: BackButtonProps) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-1 dark:text-gray-400 hover:text-gray-900 transition-colors ${className}`}
    >
      <ArrowLeft size={16} />
      <span className="font-medium text-sm dark:text-gray-300">{label}</span>
    </button>
  )
}