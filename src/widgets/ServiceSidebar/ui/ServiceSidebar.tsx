import { getNodeNeighbors, type ServiceNode } from '@/entities/service'
import type { ServiceLink } from '@/entities/link'
import { CRITICALITY_COLORS, EXPOSURE_COLORS } from '@/shared/config/colors'
import { Badge, Button, Panel } from '@/shared/ui'
import { useSelectServiceActions } from '@/features/selectService'

interface ServiceSidebarProps {
  service: ServiceNode
  links: ServiceLink[]
}

export function ServiceSidebar({ service, links }: ServiceSidebarProps) {
  const { clearSelection } = useSelectServiceActions()
  const { incoming, outgoing } = getNodeNeighbors(service.id, links)

  const handleCenter = () => {
    const center = (window as unknown as Record<string, (id: string) => void>)
      .__cybercityCenterOnNode
    if (center) center(service.id)
  }

  return (
    <Panel className="h-full w-80 overflow-y-auto border-cc-border bg-cc-panel text-sm">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="break-words text-lg font-semibold leading-tight">{service.id}</h2>
          <button
            onClick={clearSelection}
            className="text-cc-muted hover:text-cc-text"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge color={EXPOSURE_COLORS[service.exposure]}>{service.exposure}</Badge>
          <Badge color={CRITICALITY_COLORS[service.criticality]}>{service.criticality}</Badge>
          <Badge>{service.kind}</Badge>
        </div>

        <Button variant="primary" size="sm" className="w-full" onClick={handleCenter}>
          Центрировать на графе
        </Button>

        <dl className="space-y-2">
          <Row label="Организация" value={service.orgName} />
          <Row label="Сеть" value={service.networkId ?? '-'} />
          <Row label="IP" value={service.bindIp ?? '-'} />
          <Row label="Host" value={service.host ?? '-'} />
          <Row label="Auth" value={service.auth} />
          <Row label="Data class" value={service.dataClassification} />
          <Row label="Ports" value={service.ports.join(', ') || '-'} />
          {service.description && <Row label="Description" value={service.description} />}
        </dl>

        <Section title={`Исходящие связи (${outgoing.length})`} links={outgoing} />
        <Section title={`Входящие связи (${incoming.length})`} links={incoming} />
      </div>
    </Panel>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cc-muted">{label}</dt>
      <dd className="break-all text-right">{value}</dd>
    </div>
  )
}

function Section({ title, links }: { title: string; links: ServiceLink[] }) {
  if (links.length === 0) return null
  return (
    <div>
      <h3 className="mb-2 font-medium text-cc-muted">{title}</h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.id} className="rounded bg-cc-bg px-2 py-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{link.kind}</span>
              <span className="text-cc-muted">{link.protocol}</span>
            </div>
            <div className="text-xs text-cc-muted">
              {link.from} → {link.to}
            </div>
            {link.label && <div className="text-xs text-cc-muted">{link.label}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}
