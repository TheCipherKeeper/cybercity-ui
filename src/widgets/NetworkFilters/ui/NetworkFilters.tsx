import { useMemo } from 'react'
import { useNetworkFilters } from '@/features/filterNetwork'
import type { ServiceNode } from '@/entities/service'
import { Panel } from '@/shared/ui'

interface NetworkFiltersProps {
  nodes: ServiceNode[]
}

export function NetworkFilters({ nodes }: NetworkFiltersProps) {
  const { filters, setOrgIds, setKinds, setExposures, reset } = useNetworkFilters()

  const orgs = useMemo(() => {
    const map = new Map<string, string>()
    for (const node of nodes) {
      if (!map.has(node.orgId)) map.set(node.orgId, node.orgName)
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]))
  }, [nodes])

  const kinds = useMemo(() => Array.from(new Set(nodes.map((n) => n.kind))).sort(), [nodes])
  const exposures = useMemo(() => Array.from(new Set(nodes.map((n) => n.exposure))).sort(), [nodes])

  return (
    <Panel className="w-72 bg-cc-panel text-sm">
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Фильтры</h3>
          <button
            onClick={reset}
            className="text-xs text-cc-accent hover:text-cc-accentHover"
          >
            Сбросить
          </button>
        </div>

        <FilterGroup
          title="Организации"
          options={orgs.map(([id, name]) => ({ value: id, label: name }))}
          selected={filters.orgIds}
          onChange={setOrgIds}
        />

        <FilterGroup
          title="Типы сервисов"
          options={kinds.map((k) => ({ value: k, label: k }))}
          selected={filters.kinds}
          onChange={setKinds}
        />

        <FilterGroup
          title="Экспозиция"
          options={exposures.map((e) => ({ value: e, label: e }))}
          selected={filters.exposures}
          onChange={setExposures}
        />
      </div>
    </Panel>
  )
}

interface FilterGroupProps {
  title: string
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
}

function FilterGroup({ title, options, selected, onChange }: FilterGroupProps) {
  const selectedSet = new Set(selected)
  const toggle = (value: string) => {
    const next = new Set(selectedSet)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    onChange(Array.from(next))
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium uppercase tracking-wide text-cc-muted">{title}</h4>
      <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-cc-bg"
            title={opt.label}
          >
            <input
              type="checkbox"
              checked={selectedSet.has(opt.value)}
              onChange={() => toggle(opt.value)}
              className="h-4 w-4 rounded border-cc-border bg-cc-bg text-cc-accent focus:ring-cc-accent"
            />
            <span className="truncate text-cc-text">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
