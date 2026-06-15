import { cn } from '@/shared/lib/cn'

interface PanelProps {
  children: React.ReactNode
  className?: string
  title?: string
}

export function Panel({ children, className, title }: PanelProps) {
  return (
    <div
      className={cn(
        'rounded border border-cc-border bg-cc-panel text-cc-text shadow',
        className,
      )}
    >
      {title && (
        <div className="border-b border-cc-border px-4 py-2 text-sm font-semibold">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}
