import { cn } from '../../utils/cn'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
    outline: 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  }
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4 text-sm',
    lg: 'h-10 px-6 text-base',
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export default Button


