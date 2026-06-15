import { cn } from '@/shared/lib/cn'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded border border-cc-border bg-cc-bg px-3 py-1.5 text-sm text-cc-text',
        'placeholder:text-cc-muted',
        'focus:border-cc-accent focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
