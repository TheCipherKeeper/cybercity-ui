import { cn } from '@/shared/lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-cc-accent focus:ring-offset-2 focus:ring-offset-cc-bg',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-cc-accent text-white hover:bg-cc-accentHover',
        variant === 'secondary' && 'bg-cc-panel text-cc-text border border-cc-border hover:bg-cc-border',
        variant === 'ghost' && 'bg-transparent text-cc-muted hover:text-cc-text hover:bg-cc-panel',
        size === 'sm' && 'px-2 py-1 text-xs',
        size === 'md' && 'px-3 py-1.5 text-sm',
        className,
      )}
      {...props}
    />
  )
}
