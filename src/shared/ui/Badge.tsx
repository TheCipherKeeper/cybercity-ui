import { cn } from '@/shared/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
        className,
      )}
      style={color ? { backgroundColor: `${color}33`, color } : undefined}
    >
      {children}
    </span>
  )
}
