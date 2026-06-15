import { Panel } from '@/shared/ui'

interface NetworkSummaryProps {
  nodeCount: number
  linkCount: number
  orgCount: number
  isLoading: boolean
  error: Error | undefined
}

export function NetworkSummary({
  nodeCount,
  linkCount,
  orgCount,
  isLoading,
  error,
}: NetworkSummaryProps) {
  return (
    <Panel className="bg-cc-panel text-sm">
      <div className="flex items-center gap-4 px-4 py-2">
        <Stat label="Сервисы" value={nodeCount} />
        <Stat label="Связи" value={linkCount} />
        <Stat label="Организации" value={orgCount} />
        {isLoading && <span className="text-cc-muted">Загрузка…</span>}
        {error && <span className="text-cc-danger">Ошибка: {error.message}</span>}
      </div>
    </Panel>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-cc-muted">{label}:</span>
      <span className="font-semibold tabular-nums">{value.toLocaleString()}</span>
    </div>
  )
}
